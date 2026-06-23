"""Serviço de aplicação para gerenciamento de Pedidos."""

import logging
import uuid
import mercadopago
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.config import settings
from backend.infrastructure.database.models import Pedido, PedidoStatus
from backend.infrastructure.repositories.pedido_repository import PedidoRepository
from backend.infrastructure.repositories.planta_repository import PlantaRepository

logger = logging.getLogger(__name__)


class MercadoPagoError(Exception):
    pass


async def create_pedido(
    db: AsyncSession,
    planta_id: uuid.UUID,
    email: str,
    nome: str,
    telefone: str | None = None
) -> tuple[Pedido, str]:
    planta_repo = PlantaRepository(db)
    planta = await planta_repo.get_by_id(planta_id)
    
    if not planta:
        raise ValueError("Planta não encontrada")
    if not planta.ativo:
        raise ValueError("Planta não disponível para venda")
        
    pedido_repo = PedidoRepository(db)
    
    pedido = Pedido(
        id=uuid.uuid4(),
        planta_id=planta_id,
        email=email,
        nome=nome,
        telefone=telefone,
        valor=planta.preco,
        status=PedidoStatus.pendente,
    )
    
    try:
        logger.info(
            "MP preference: frontend_url=%r backend_url=%r pedido_id=%s",
            settings.frontend_url, settings.backend_url, pedido.id,
        )
        sdk = mercadopago.SDK(settings.mp_access_token)
        preference_data = {
            "items": [
                {
                    "id": str(planta.id),
                    "title": planta.titulo,
                    "quantity": 1,
                    "unit_price": float(planta.preco),
                }
            ],
            "payer": {"email": email, "name": nome},
            "external_reference": str(pedido.id),
            "back_urls": {
                "success": f"{settings.frontend_url}/pagamento/sucesso",
                "failure": f"{settings.frontend_url}/pagamento/falha",
                "pending": f"{settings.frontend_url}/pagamento/pendente",
            },
            "auto_return": "approved",
            "notification_url": f"{settings.backend_url}/api/webhooks/mercadopago",
        }
        preference_response = sdk.preference().create(preference_data)
        
        if "response" not in preference_response or not preference_response["response"].get("init_point"):
            raise MercadoPagoError("Resposta inválida do SDK do Mercado Pago")
            
        init_point = preference_response["response"]["init_point"]
    except Exception as exc:
        logger.error("Falha ao integrar com Mercado Pago: %s", exc)
        raise MercadoPagoError("API Mercado Pago indisponível") from exc
        
    await pedido_repo.create(pedido)
    
    return pedido, init_point
