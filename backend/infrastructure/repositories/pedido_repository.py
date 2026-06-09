"""Repositório SQLAlchemy para Pedido."""

import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.infrastructure.database.models import Pedido


class PedidoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, pedido: Pedido) -> Pedido:
        self.session.add(pedido)
        await self.session.flush()
        await self.session.refresh(pedido)
        return pedido

    async def get_by_id(self, pedido_id: uuid.UUID) -> Pedido | None:
        stmt = select(Pedido).where(Pedido.id == pedido_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_mp_payment_id(self, mp_payment_id: str, for_update: bool = False) -> Pedido | None:
        stmt = select(Pedido).where(Pedido.mp_payment_id == mp_payment_id)
        if for_update:
            stmt = stmt.with_for_update()
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_download_token(self, download_token: uuid.UUID) -> Pedido | None:
        stmt = select(Pedido).where(Pedido.download_token == download_token)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Pedido]:
        stmt = select(Pedido).order_by(Pedido.criado_em.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, pedido: Pedido) -> Pedido:
        await self.session.flush()
        await self.session.refresh(pedido)
        return pedido
