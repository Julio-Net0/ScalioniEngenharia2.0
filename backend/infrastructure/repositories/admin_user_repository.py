"""Repositório SQLAlchemy para AdminUser."""

import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.infrastructure.database.models import AdminUser


class AdminUserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str, only_active: bool = True) -> AdminUser | None:
        stmt = select(AdminUser).where(AdminUser.email == email)
        if only_active:
            stmt = stmt.where(AdminUser.ativo == True)  # noqa: E712
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[AdminUser]:
        stmt = select(AdminUser).order_by(AdminUser.nome)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
