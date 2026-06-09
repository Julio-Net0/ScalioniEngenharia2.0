"""Router FastAPI para POST /api/pedidos."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import limiter
from backend.infrastructure.database.session import get_db
from backend.interfaces.schemas.pedido import PedidoCreate, PedidoResponse

from backend.application import pedido_service


router = APIRouter(prefix="/api/pedidos", tags=["pedidos"])


@router.post("", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_pedido(
    request: Request,
    data: PedidoCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        pedido, init_point = await pedido_service.create_pedido(
            db=db,
            planta_id=data.planta_id,
            email=data.email,
            nome=data.nome,
            telefone=data.telefone,
        )
    except ValueError as exc:
        msg = str(exc)
        if "não encontrada" in msg:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=msg)
        else:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=msg)
    except pedido_service.MercadoPagoError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))

    pedido.init_point = init_point
    return pedido
