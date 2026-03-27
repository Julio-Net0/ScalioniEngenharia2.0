"""Router FastAPI para POST /api/pedidos."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Pedido, PedidoStatus
from backend.infrastructure.database.session import get_db
from backend.infrastructure.repositories.planta_repository import PlantaRepository
from backend.interfaces.schemas.pedido import PedidoCreate, PedidoResponse

router = APIRouter(prefix="/api/pedidos", tags=["pedidos"])


@router.post("", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
async def create_pedido(
    data: PedidoCreate,
    db: AsyncSession = Depends(get_db),
):
    planta_repo = PlantaRepository(db)
    planta = await planta_repo.get_by_id(data.planta_id)
    if not planta or not planta.ativo:
        raise HTTPException(status_code=404, detail="Planta não encontrada")

    pedido = Pedido(
        planta_id=data.planta_id,
        email=data.email,
        nome=data.nome,
        telefone=data.telefone,
        valor=planta.preco,
        status=PedidoStatus.pendente,
    )
    db.add(pedido)
    await db.flush()
    await db.refresh(pedido)

    # Integração Mercado Pago — gera preference e retorna init_point
    try:
        import mercadopago
        from backend.core.config import settings
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
            "payer": {"email": data.email, "name": data.nome},
            "external_reference": str(pedido.id),
            "back_urls": {
                "success": f"{settings.frontend_url}/pagamento/sucesso",
                "failure": f"{settings.frontend_url}/pagamento/falha",
                "pending": f"{settings.frontend_url}/pagamento/pendente",
            },
            "auto_return": "approved",
            "notification_url": f"{settings.frontend_url.replace('3000', '8000')}/api/webhooks/mercadopago",
        }
        preference_response = sdk.preference().create(preference_data)
        init_point = preference_response["response"].get("init_point", "")
    except Exception:
        init_point = ""

    return {**pedido.__dict__, "init_point": init_point}
