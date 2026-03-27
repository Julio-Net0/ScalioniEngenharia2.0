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


def validate_hmac_signature(payload: bytes, signature_header: str, request_id: str) -> bool:
    """Valida a assinatura HMAC-SHA256 do Mercado Pago."""
    try:
        parts = dict(item.split("=", 1) for item in signature_header.split(","))
        ts = parts.get("ts", "")
        v1 = parts.get("v1", "")
        manifest = f"id:{request_id};request-id:{request_id};ts:{ts};"
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

    pedido.status = PedidoStatus.pago
    pedido.download_token = uuid.uuid4()
    pedido.expires_at = datetime.now(timezone.utc) + timedelta(hours=72)
    pedido.atualizado_em = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(pedido)

    try:
        await send_download_email(
            to_email=pedido.email,
            nome=pedido.nome,
            download_token=str(pedido.download_token),
        )
    except Exception as exc:
        logger.error("Falha ao enviar e-mail de download: %s", exc)
