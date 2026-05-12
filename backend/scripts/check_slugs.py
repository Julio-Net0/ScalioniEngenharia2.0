import asyncio
from backend.infrastructure.database.session import get_db
from backend.infrastructure.database.models import Projeto
from sqlalchemy import select

async def check():
    async for db in get_db():
        result = await db.execute(select(Projeto.titulo, Projeto.slug))
        projetos = result.all()
        for p in projetos:
            print(f"Titulo: {p.titulo} | Slug: {p.slug}")
        break

if __name__ == "__main__":
    asyncio.run(check())
