"""Migration inicial — tabelas completas com índices e constraints.

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-27

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:


    # projetos
    op.create_table(
        "projetos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("slug", sa.Text(), nullable=False),
        sa.Column("titulo", sa.Text(), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("categoria", sa.Text(), nullable=False),
        sa.Column("imagem_capa", sa.Text(), nullable=False),
        sa.Column("imagens", postgresql.ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("ano", sa.SmallInteger(), nullable=False),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("criado_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("ano >= 1900 AND ano <= 2100", name="ck_projetos_ano"),
        sa.UniqueConstraint("slug", name="uq_projetos_slug"),
    )
    op.create_index("idx_projetos_ativo", "projetos", ["ativo"])
    op.create_index("idx_projetos_slug", "projetos", ["slug"])

    # plantas
    op.create_table(
        "plantas",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("slug", sa.Text(), nullable=False),
        sa.Column("titulo", sa.Text(), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("preco", sa.Numeric(10, 2), nullable=False),
        sa.Column("imagens", postgresql.ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("terreno_minimo_m2", sa.Numeric(8, 2), nullable=True),
        sa.Column("arquivo_path", sa.Text(), nullable=True),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("criado_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("preco >= 0", name="ck_plantas_preco"),
        sa.UniqueConstraint("slug", name="uq_plantas_slug"),
    )
    op.create_index("idx_plantas_ativo", "plantas", ["ativo"])
    op.create_index("idx_plantas_slug", "plantas", ["slug"])

    # pedidos
    op.create_table(
        "pedidos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("planta_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("nome", sa.Text(), nullable=False),
        sa.Column("telefone", sa.Text(), nullable=True),
        sa.Column("valor", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.Enum("pendente", "pago", "rejected", "cancelled", "in_process", name="pedido_status"), nullable=False, server_default="pendente"),
        sa.Column("mp_payment_id", sa.Text(), nullable=True),
        sa.Column("download_token", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("expires_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("criado_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("atualizado_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["planta_id"], ["plantas.id"], ondelete="RESTRICT", name="fk_pedidos_planta_id"),
        sa.UniqueConstraint("mp_payment_id", name="uq_pedidos_mp_payment_id"),
        sa.UniqueConstraint("download_token", name="uq_pedidos_download_token"),
    )
    op.create_index("idx_pedidos_status", "pedidos", ["status"])
    op.create_index("idx_pedidos_email", "pedidos", ["email"])
    op.create_index("idx_pedidos_mp_payment_id", "pedidos", ["mp_payment_id"])
    op.create_index("idx_pedidos_download_token", "pedidos", ["download_token"])

    # admin_users
    op.create_table(
        "admin_users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("nome", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("senha_hash", sa.Text(), nullable=False),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("criado_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("email", name="uq_admin_users_email"),
    )

    # mensagens_contato
    op.create_table(
        "mensagens_contato",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("nome", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("telefone", sa.Text(), nullable=True),
        sa.Column("mensagem", sa.Text(), nullable=False),
        sa.Column("lida", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("criada_em", sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("length(mensagem) <= 2000", name="ck_mensagens_tamanho"),
    )
    op.create_index("idx_mensagens_lida", "mensagens_contato", ["lida"])

    # pgcrypto para gen_random_uuid()
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")


def downgrade() -> None:
    op.drop_table("mensagens_contato")
    op.drop_table("admin_users")
    op.drop_index("idx_pedidos_download_token", "pedidos")
    op.drop_index("idx_pedidos_mp_payment_id", "pedidos")
    op.drop_index("idx_pedidos_email", "pedidos")
    op.drop_index("idx_pedidos_status", "pedidos")
    op.drop_table("pedidos")
    op.drop_index("idx_plantas_slug", "plantas")
    op.drop_index("idx_plantas_ativo", "plantas")
    op.drop_table("plantas")
    op.drop_index("idx_projetos_slug", "projetos")
    op.drop_index("idx_projetos_ativo", "projetos")
    op.drop_table("projetos")
    sa.Enum(name="pedido_status").drop(op.get_bind())
