"""Router FastAPI para /api/plantas."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.models import Planta
from backend.infrastructure.database.session import get_db
from backend.infrastructure.repositories.planta_repository import PlantaRepository
from backend.interfaces.dependencies import get_current_admin
from backend.interfaces.schemas.planta import PlantaCreate, PlantaResponse, PlantaUpdate

router = APIRouter(prefix="/api/plantas", tags=["plantas"])


@router.get("", response_model=list[PlantaResponse])
async def list_plantas(db: AsyncSession = Depends(get_db)):
    repo = PlantaRepository(db)
    return await repo.list_all(only_active=True)


@router.get("/{slug}", response_model=PlantaResponse)
async def get_planta(slug: str, db: AsyncSession = Depends(get_db)):
    repo = PlantaRepository(db)
    planta = await repo.get_by_slug(slug)
    if not planta:
        raise HTTPException(status_code=404, detail="Planta não encontrada")
    return planta


@router.post("", response_model=PlantaResponse, status_code=status.HTTP_201_CREATED)
async def create_planta(
    data: PlantaCreate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = PlantaRepository(db)
    existing = await repo.get_by_slug(data.slug)
    if existing:
        raise HTTPException(status_code=422, detail="Slug já existe")

    planta = Planta(**data.model_dump())
    try:
        return await repo.create(planta)
    except IntegrityError:
        raise HTTPException(status_code=422, detail="Slug já existe")


@router.put("/{slug}", response_model=PlantaResponse)
async def update_planta(
    slug: str,
    data: PlantaUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = PlantaRepository(db)
    planta = await repo.get_by_slug(slug)
    if not planta:
        raise HTTPException(status_code=404, detail="Planta não encontrada")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(planta, key, value)

    return await repo.update(planta)


async def delete_planta(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin),
):
    repo = PlantaRepository(db)
    planta = await repo.get_by_slug(slug)
    if not planta:
        raise HTTPException(status_code=404, detail="Planta não encontrada")

    if await repo.has_active_pedidos(planta.id):
        raise HTTPException(status_code=409, detail="Planta possui pedidos ativos")

    await repo.delete(planta)


router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)(delete_planta)
