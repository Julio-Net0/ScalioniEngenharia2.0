"""Script de seed — AdminUser padrão + projetos/plantas de demonstração."""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.core.config import settings
from backend.core.security import hash_password
from backend.infrastructure.database.models import AdminUser, Planta, Projeto


async def seed():
    engine = create_async_engine(settings.database_url)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async with SessionLocal() as db:
        # Admin padrão
        admin = AdminUser(
            nome="Admin Scalioni",
            email="admin@scalioni.com",
            senha_hash=hash_password("admin123"),  # trocar em prod!
        )
        db.add(admin)

        # Projetos de demonstração
        projetos = [
            Projeto(
                slug="residencia-alpha",
                titulo="Residência Alpha",
                descricao="Projeto residencial de alto padrão em condomínio fechado.",
                categoria="Residencial Luxo",
                imagem_capa="/uploads/demo/alpha.jpg",
                imagens=["/uploads/demo/alpha1.jpg", "/uploads/demo/alpha2.jpg"],
                ano=2023,
                ativo=True,
            ),
            Projeto(
                slug="corporativo-beta",
                titulo="Edifício Beta",
                descricao="Projeto corporativo de 8 andares no centro.",
                categoria="Corporativo",
                imagem_capa="/uploads/demo/beta.jpg",
                ano=2024,
                ativo=True,
            ),
        ]
        for p in projetos:
            db.add(p)

        # Plantas de demonstração
        plantas = [
            Planta(
                slug="casa-terrea-150m2",
                titulo="Casa Térrea 150m²",
                descricao="Planta completa para casa térrea com 3 suítes.",
                preco=990.00,
                imagens=["/uploads/demo/planta1.jpg"],
                terreno_minimo_m2=250.0,
                ativo=True,
            ),
            Planta(
                slug="sobrado-220m2",
                titulo="Sobrado 220m²",
                descricao="Sobrado moderno com 4 suítes e área gourmet.",
                preco=1490.00,
                imagens=["/uploads/demo/planta2.jpg"],
                terreno_minimo_m2=350.0,
                ativo=True,
            ),
        ]
        for p in plantas:
            db.add(p)

        await db.commit()
        print("✅ Seed concluído com sucesso!")


if __name__ == "__main__":
    asyncio.run(seed())
