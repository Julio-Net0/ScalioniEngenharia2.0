"""Repositório SQLAlchemy para MensagemContato."""

import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.infrastructure.database.models import MensagemContato


class MensagemContatoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, mensagem: MensagemContato) -> MensagemContato:
        self.session.add(mensagem)
        await self.session.flush()
        await self.session.refresh(mensagem)
        return mensagem

    async def get_by_id(self, mensagem_id: uuid.UUID) -> MensagemContato | None:
        stmt = select(MensagemContato).where(MensagemContato.id == mensagem_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self, lida: bool | None = None) -> list[MensagemContato]:
        stmt = select(MensagemContato).order_by(MensagemContato.criada_em.desc())
        if lida is not None:
            stmt = stmt.where(MensagemContato.lida == lida)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, mensagem: MensagemContato) -> MensagemContato:
        await self.session.flush()
        await self.session.refresh(mensagem)
        return mensagem
