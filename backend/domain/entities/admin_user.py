import uuid
from dataclasses import dataclass, field
from datetime import datetime
from backend.core.timezone import now_utc


@dataclass
class AdminUser:
    nome: str
    email: str
    senha_hash: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    ativo: bool = True
    criado_em: datetime = field(default_factory=now_utc)
