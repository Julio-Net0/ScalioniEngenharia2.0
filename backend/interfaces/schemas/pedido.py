"""Schemas Pydantic v2 para Pedido."""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PlainSerializer

from backend.infrastructure.database.models import PedidoStatus


class PedidoCreate(BaseModel):
    planta_id: uuid.UUID
    email: EmailStr
    nome: str = Field(..., min_length=1)
    telefone: str | None = None


class PedidoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    planta_id: uuid.UUID
    email: str
    nome: str
    telefone: str | None
    valor: Annotated[Decimal, PlainSerializer(str)]
    status: PedidoStatus
    mp_payment_id: str | None
    download_token: uuid.UUID | None
    expires_at: datetime | None
    criado_em: datetime
    atualizado_em: datetime
    init_point: str | None = None
