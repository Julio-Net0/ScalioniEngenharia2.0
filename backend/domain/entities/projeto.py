"""Entidade de domínio: Projeto."""

import uuid
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Projeto:
    slug: str
    titulo: str
    descricao: str
    categoria: str
    imagem_capa: str
    ano: int
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    imagens: list[str] = field(default_factory=list)
    ativo: bool = True
    criado_em: datetime = field(default_factory=datetime.utcnow)
