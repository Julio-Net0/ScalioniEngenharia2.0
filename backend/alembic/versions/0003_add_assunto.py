"""Adiciona coluna assunto em mensagens_contato.

Revision ID: 0003_add_assunto
Revises: 0002_seed_dev
Create Date: 2026-06-22

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_add_assunto"
down_revision: Union[str, None] = "0002_seed_dev"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("mensagens_contato", sa.Column("assunto", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("mensagens_contato", "assunto")
