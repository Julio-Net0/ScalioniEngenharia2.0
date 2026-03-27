"""Router FastAPI para POST /api/webhooks/mercadopago."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.application import webhook_service
from backend.core.security import limiter
from backend.infrastructure.database.models import Pedido, PedidoStatus
from backend.infrastructure.database.session import get_db

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)


@router.post("/mercadopago", status_code=200)
@limiter.limit("5/minute")
async def mercadopago_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    # 1. Validar HMAC-SHA256
    signature = request.headers.get("x-signature", "")
    request_id = request.headers.get("x-request-id", "")
    body = await request.body()

    if not webhook_service.validate_hmac_signature(body, signature, request_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Assinatura inválida")

    data = await request.json()
    payment_id = str(data.get("data", {}).get("id", ""))
    if not payment_id:
        return {"status": "ignored"}

    # 2. Verificar idempotência por mp_payment_id
    stmt = select(Pedido).where(Pedido.mp_payment_id == payment_id)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing and existing.status == PedidoStatus.pago:
        logger.info("Pagamento %s já processado (idempotência)", payment_id)
        return {"status": "already_processed"}

    # 3. Double-check via API do Mercado Pago
    try:
        mp_data = await webhook_service.check_payment_status(payment_id)
        mp_status = mp_data.get("status", "")
        external_reference = mp_data.get("external_reference", "")
    except Exception as exc:
        logger.error("Falha no double-check MP: %s", exc)
        return {"status": "error"}

    # Buscar pedido pelo external_reference (UUID do pedido)
    from backend.infrastructure.database.models import Pedido as PedidoModel
    import uuid as uuid_mod
    try:
        pedido_id = uuid_mod.UUID(external_reference)
    except (ValueError, TypeError):
        return {"status": "ignored"}

    stmt2 = select(PedidoModel).where(PedidoModel.id == pedido_id)
    result2 = await db.execute(stmt2)
    pedido = result2.scalar_one_or_none()
    if not pedido:
        return {"status": "not_found"}

    pedido.mp_payment_id = payment_id

    # 4. Despachar por status
    if mp_status == "approved":
        await webhook_service.handle_approved(pedido, db)
    elif mp_status == "pending":
        pedido.status = PedidoStatus.in_process
        pedido.atualizado_em = datetime.now(timezone.utc)
    elif mp_status in ("rejected", "cancelled"):
        pedido.status = PedidoStatus[mp_status]
        pedido.atualizado_em = datetime.now(timezone.utc)
        from backend.application.email_service import send_payment_failed_email
        try:
            await send_payment_failed_email(email=pedido.email, nome=pedido.nome)
        except Exception as exc:
            logger.error("Falha ao enviar e-mail de falha: %s", exc)
    else:
        pedido.status = PedidoStatus.in_process
        pedido.atualizado_em = datetime.now(timezone.utc)

    await db.flush()
    return {"status": "processed"}
