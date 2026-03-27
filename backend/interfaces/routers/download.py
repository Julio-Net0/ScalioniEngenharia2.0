"""Router FastAPI para GET /api/download/{token}."""

import uuid as uuid_mod

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Pedido, PedidoStatus
from backend.infrastructure.database.session import get_db
from datetime import datetime, timezone

router_download = APIRouter(prefix="/api/download", tags=["download"])


@router_download.get("/{token}")
async def download_file(token: str, db: AsyncSession = Depends(get_db)):
    try:
        token_uuid = uuid_mod.UUID(token)
    except ValueError:
        raise HTTPException(status_code=404, detail="Token inválido")

    stmt = select(Pedido).where(Pedido.download_token == token_uuid)
    result = await db.execute(stmt)
    pedido = result.scalar_one_or_none()

    if not pedido:
        raise HTTPException(status_code=404, detail="Token não encontrado")

    if pedido.status != PedidoStatus.pago:
        raise HTTPException(status_code=403, detail="Pagamento não confirmado")

    if pedido.expires_at and pedido.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="Token expirado")

    # Retorna o arquivo da planta
    from backend.infrastructure.repositories.planta_repository import PlantaRepository
    planta_repo = PlantaRepository(db)
    planta = await planta_repo.get_by_id(pedido.planta_id)
    if not planta or not planta.arquivo_path:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return FileResponse(
        path=planta.arquivo_path,
        filename=f"{planta.slug}.zip",
        media_type="application/octet-stream",
    )
