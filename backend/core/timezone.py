"""Utilitários de timezone para o projeto ScalioniEngenharia.

Estratégia:
- Internamente (banco de dados, lógica de negócio): sempre UTC.
- Exibição (logs, e-mails, painel admin): BRT (America/Sao_Paulo, UTC-3).
- A API retorna datetimes em ISO 8601 com offset UTC — conversão é responsabilidade do frontend.
"""

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

BRT = ZoneInfo("America/Sao_Paulo")


def now_utc() -> datetime:
    """Retorna o datetime atual em UTC (aware). Substitui o deprecated datetime.utcnow()."""
    return datetime.now(timezone.utc)


def now_brt() -> datetime:
    """Retorna o datetime atual no fuso de Brasília (BRT, UTC-3)."""
    return datetime.now(BRT)


def to_brt(dt: datetime) -> datetime:
    """Converte qualquer datetime aware para o fuso de Brasília."""
    return dt.astimezone(BRT)
