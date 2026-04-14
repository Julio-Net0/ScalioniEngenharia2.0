"""Seed de desenvolvimento — AdminUser padrão + projetos/plantas de demo.

Revision ID: 0002_seed_dev
Revises: 0001_initial
Create Date: 2026-04-14

Esta migration só insere dados quando a variável de ambiente SEED_ENV=dev.
Em produção/CI, ela é inócua (no-op).
"""

import os
from typing import Sequence, Union

from alembic import op

revision: str = "0002_seed_dev"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Hash bcrypt de "admin123" — pré-computado para evitar import circular.
# Gerar novo hash: python -c "from passlib.context import CryptContext; print(CryptContext(['bcrypt']).hash('admin123'))"
_ADMIN_HASH = "$2b$12$yqXlT1QkJn1KjqdiDAaBMORqWMyyl/EEIOHp1nZhNsHfiZIO0hkaq"


def upgrade() -> None:
    if os.getenv("SEED_ENV") != "dev":
        return  # no-op em produção / CI

    # Admin padrão
    op.execute(
        """
        INSERT INTO admin_users (nome, email, senha_hash, ativo)
        VALUES ('Admin Scalioni', 'admin@scalioni.com', :hash, true)
        ON CONFLICT (email) DO NOTHING
        """,
        {"hash": _ADMIN_HASH},
    )

    # Projetos de demonstração
    op.execute(
        """
        INSERT INTO projetos (slug, titulo, descricao, categoria, imagem_capa, imagens, ano, ativo)
        VALUES
          ('residencia-alpha', 'Residência Alpha',
           'Projeto residencial de alto padrão em condomínio fechado.',
           'Residencial Luxo', '/uploads/demo/alpha.jpg',
           ARRAY['/uploads/demo/alpha1.jpg', '/uploads/demo/alpha2.jpg'],
           2023, true),
          ('corporativo-beta', 'Edifício Beta',
           'Projeto corporativo de 8 andares no centro.',
           'Corporativo', '/uploads/demo/beta.jpg',
           '{}', 2024, true)
        ON CONFLICT (slug) DO NOTHING
        """
    )

    # Plantas de demonstração
    op.execute(
        """
        INSERT INTO plantas (slug, titulo, descricao, preco, imagens, terreno_minimo_m2, ativo)
        VALUES
          ('casa-terrea-150m2', 'Casa Térrea 150m²',
           'Planta completa para casa térrea com 3 suítes.',
           990.00, ARRAY['/uploads/demo/planta1.jpg'], 250.0, true),
          ('sobrado-220m2', 'Sobrado 220m²',
           'Sobrado moderno com 4 suítes e área gourmet.',
           1490.00, ARRAY['/uploads/demo/planta2.jpg'], 350.0, true)
        ON CONFLICT (slug) DO NOTHING
        """
    )


def downgrade() -> None:
    if os.getenv("SEED_ENV") != "dev":
        return  # no-op em produção / CI

    op.execute(
        "DELETE FROM plantas WHERE slug IN ('casa-terrea-150m2', 'sobrado-220m2')"
    )
    op.execute(
        "DELETE FROM projetos WHERE slug IN ('residencia-alpha', 'corporativo-beta')"
    )
    op.execute(
        "DELETE FROM admin_users WHERE email = 'admin@scalioni.com'"
    )
