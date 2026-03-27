"""Repositório SQLAlchemy para Planta."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Pedido, Planta


class PlantaRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_all(self, only_active: bool = True) -> list[Planta]:
        stmt = select(Planta)
        if only_active:
            stmt = stmt.where(Planta.ativo == True)  # noqa: E712
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Planta | None:
        stmt = select(Planta).where(Planta.slug == slug)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, planta_id: uuid.UUID) -> Planta | None:
        stmt = select(Planta).where(Planta.id == planta_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def has_active_pedidos(self, planta_id: uuid.UUID) -> bool:
        from backend.infrastructure.database.models import PedidoStatus
        stmt = select(Pedido).where(
            Pedido.planta_id == planta_id,
            Pedido.status.notin_([PedidoStatus.rejected, PedidoStatus.cancelled]),
        )
        result = await self.session.execute(stmt)
        return result.first() is not None

    async def create(self, planta: Planta) -> Planta:
        self.session.add(planta)
        await self.session.flush()
        await self.session.refresh(planta)
        return planta

    async def update(self, planta: Planta) -> Planta:
        await self.session.flush()
        await self.session.refresh(planta)
        return planta

    async def delete(self, planta: Planta) -> None:
        await self.session.delete(planta)
        await self.session.flush()
