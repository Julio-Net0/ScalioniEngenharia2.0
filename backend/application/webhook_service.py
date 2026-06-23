"""Serviço de application para processamento do webhook Mercado Pago."""

import hashlib
import hmac
import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.infrastructure.database.models import Pedido, PedidoStatus

logger = logging.getLogger(__name__)


def validate_hmac_signature(data_id: str, signature_header: str, request_id: str) -> bool:
    """Valida a assinatura HMAC-SHA256 do Mercado Pago.

    O MP não assina o corpo bruto da requisição: assina o manifest
    "id:{data.id};request-id:{x-request-id};ts:{ts};" montado a partir
    do query param data.id e dos headers x-request-id / ts (extraído do
    próprio x-signature). Ver https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks/additional-content/your-integrations/notifications/webhooks#editor_5
    """
    try:
        parts = dict(item.strip().split("=", 1) for item in signature_header.split(","))
        ts = parts.get("ts", "")
        v1 = parts.get("v1", "")
        manifest = f"id:{data_id};request-id:{request_id};ts:{ts};"
        expected = hmac.new(
            settings.mp_webhook_secret.encode(),
            manifest.encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, v1)
    except Exception:
        return False


async def check_payment_status(payment_id: str) -> dict:
    """Consulta status real do pagamento na API do Mercado Pago (double-check)."""
    import httpx
    from backend.core.config import settings

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.mercadopago.com/v1/payments/{payment_id}",
            headers={"Authorization": f"Bearer {settings.mp_access_token}"},
        )
        response.raise_for_status()
        return response.json()


async def handle_approved(pedido: Pedido, db: AsyncSession) -> None:
    """Processa pagamento aprovado: gera token de download (72h) e envia e-mail."""
    from backend.application.email_service import send_download_email
    from backend.infrastructure.repositories.pedido_repository import PedidoRepository
    from backend.infrastructure.repositories.planta_repository import PlantaRepository

    pedido.status = PedidoStatus.pago
    pedido.download_token = uuid.uuid4()
    pedido.expires_at = datetime.now(timezone.utc) + timedelta(hours=72)
    pedido.atualizado_em = datetime.now(timezone.utc)
    
    pedido_repo = PedidoRepository(db)
    await pedido_repo.update(pedido)

    planta_repo = PlantaRepository(db)
    planta = await planta_repo.get_by_id(pedido.planta_id)
    planta_titulo = planta.titulo if planta else "Planta"

    try:
        await send_download_email(
            to_email=pedido.email,
            nome=pedido.nome,
            download_token=str(pedido.download_token),
            planta_titulo=planta_titulo,
        )
    except Exception as exc:
        logger.error("Falha ao enviar e-mail de download: %s", exc)

