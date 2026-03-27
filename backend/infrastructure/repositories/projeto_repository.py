"""Repositório SQLAlchemy para Projeto."""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Projeto


class ProjectRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_all(self, only_active: bool = True) -> list[Projeto]:
        stmt = select(Projeto)
        if only_active:
            stmt = stmt.where(Projeto.ativo == True)  # noqa: E712
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Projeto | None:
        stmt = select(Projeto).where(Projeto.slug == slug)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, projeto_id: uuid.UUID) -> Projeto | None:
        stmt = select(Projeto).where(Projeto.id == projeto_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, projeto: Projeto) -> Projeto:
        self.session.add(projeto)
        await self.session.flush()
        await self.session.refresh(projeto)
        return projeto

    async def update(self, projeto: Projeto) -> Projeto:
        await self.session.flush()
        await self.session.refresh(projeto)
        return projeto

    async def delete(self, projeto: Projeto) -> None:
        await self.session.delete(projeto)
        await self.session.flush()
