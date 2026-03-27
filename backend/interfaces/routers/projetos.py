"""Router FastAPI para /api/projetos."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Projeto
from backend.infrastructure.database.session import get_db
from backend.infrastructure.repositories.projeto_repository import ProjectRepository
from backend.interfaces.dependencies import get_current_admin
from backend.interfaces.schemas.projeto import ProjetoCreate, ProjetoResponse, ProjetoUpdate

router = APIRouter(prefix="/api/projetos", tags=["projetos"])


@router.get("", response_model=list[ProjetoResponse])
async def list_projetos(db: AsyncSession = Depends(get_db)):
    repo = ProjectRepository(db)
    return await repo.list_all(only_active=True)


@router.get("/{slug}", response_model=ProjetoResponse)
async def get_projeto(slug: str, db: AsyncSession = Depends(get_db)):
    repo = ProjectRepository(db)
    projeto = await repo.get_by_slug(slug)
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return projeto


@router.post("", response_model=ProjetoResponse, status_code=status.HTTP_201_CREATED)
async def create_projeto(
    data: ProjetoCreate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = ProjectRepository(db)
    existing = await repo.get_by_slug(data.slug)
    if existing:
        raise HTTPException(status_code=422, detail="Slug já existe")

    projeto = Projeto(**data.model_dump())
    try:
        return await repo.create(projeto)
    except IntegrityError:
        raise HTTPException(status_code=422, detail="Slug já existe")


@router.put("/{slug}", response_model=ProjetoResponse)
async def update_projeto(
    slug: str,
    data: ProjetoUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = ProjectRepository(db)
    projeto = await repo.get_by_slug(slug)
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(projeto, key, value)

    return await repo.update(projeto)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_projeto(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = ProjectRepository(db)
    projeto = await repo.get_by_slug(slug)
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    await repo.delete(projeto)
