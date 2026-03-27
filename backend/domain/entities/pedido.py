"""Entidade de domínio: Pedido com enum de status."""

import enum
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal


class PedidoStatus(str, enum.Enum):
    pendente = "pendente"
    pago = "pago"
    rejected = "rejected"
    cancelled = "cancelled"
    in_process = "in_process"


@dataclass
class Pedido:
    planta_id: uuid.UUID
    email: str
    nome: str
    valor: Decimal
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    telefone: str | None = None
    status: PedidoStatus = PedidoStatus.pendente
    mp_payment_id: str | None = None
    download_token: uuid.UUID | None = None
    expires_at: datetime | None = None
    criado_em: datetime = field(default_factory=datetime.utcnow)
    atualizado_em: datetime = field(default_factory=datetime.utcnow)
