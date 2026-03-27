"""Schemas Pydantic v2 para Projeto."""

import uuid
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class ProjetoBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=200)
    titulo: str = Field(..., min_length=1)
    descricao: str = Field(..., min_length=1)
    categoria: str = Field(..., min_length=1)
    imagem_capa: str = Field(..., min_length=1)
    imagens: list[str] = Field(default_factory=list)
    ano: Annotated[int, Field(ge=1900, le=2100)]
    ativo: bool = True


class ProjetoCreate(ProjetoBase):
    pass


class ProjetoUpdate(BaseModel):
    slug: str | None = Field(None, min_length=1, max_length=200)
    titulo: str | None = None
    descricao: str | None = None
    categoria: str | None = None
    imagem_capa: str | None = None
    imagens: list[str] | None = None
    ano: int | None = Field(None, ge=1900, le=2100)
    ativo: bool | None = None


class ProjetoResponse(ProjetoBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    criado_em: datetime
