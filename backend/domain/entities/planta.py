"""Entidade de domínio: Planta."""

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from backend.core.timezone import now_utc
from decimal import Decimal


@dataclass
class Planta:
    slug: str
    titulo: str
    descricao: str
    preco: Decimal
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    imagens: list[str] = field(default_factory=list)
    terreno_minimo_m2: Decimal | None = None
    arquivo_path: str | None = None
    ativo: bool = True
    criado_em: datetime = field(default_factory=now_utc)
