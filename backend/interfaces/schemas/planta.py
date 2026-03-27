"""Schemas Pydantic v2 para Planta."""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer


class PlantaBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=200)
    titulo: str = Field(..., min_length=1)
    descricao: str = Field(..., min_length=1)
    preco: Annotated[Decimal, Field(ge=0), PlainSerializer(str)]
    imagens: list[str] = Field(default_factory=list)
    terreno_minimo_m2: Decimal | None = None
    arquivo_path: str | None = None
    ativo: bool = True


class PlantaCreate(PlantaBase):
    pass


class PlantaUpdate(BaseModel):
    slug: str | None = Field(None, min_length=1, max_length=200)
    titulo: str | None = None
    descricao: str | None = None
    preco: Annotated[Decimal, Field(ge=0), PlainSerializer(str)] | None = None
    imagens: list[str] | None = None
    terreno_minimo_m2: Decimal | None = None
    arquivo_path: str | None = None
    ativo: bool | None = None


class PlantaResponse(PlantaBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    criado_em: datetime
