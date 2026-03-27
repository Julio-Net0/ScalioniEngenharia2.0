"""Entidade de domínio: MensagemContato."""

import uuid
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class MensagemContato:
    nome: str
    email: str
    mensagem: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    telefone: str | None = None
    lida: bool = False
    criada_em: datetime = field(default_factory=datetime.utcnow)
