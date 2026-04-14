"""
[TEST RED] task-006
Testa que as migrations do Alembic rodam e voltam corretamente.
Este teste vai FALHAR até que Alembic seja configurado (task-009) e
a migration inicial seja criada (task-010).
"""

import subprocess

import pytest
from sqlalchemy import create_engine, inspect, text


import os
TEST_DB_URL = os.getenv("DATABASE_URL", "postgresql://scalioni:scalioni@postgres:5432/scalioni").replace("+asyncpg", "")
SYNC_DB_URL = TEST_DB_URL  # psycopg2 para inspeção síncrona


def run_alembic(command: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["alembic"] + command,
        cwd="/app/backend",     # must match onde fica alembic.ini
        capture_output=True,
        text=True,
    )


@pytest.fixture(scope="module")
def engine():
    eng = create_engine(TEST_DB_URL.replace("+asyncpg", ""))
    yield eng
    eng.dispose()


def test_upgrade_head_cria_tabelas(engine):
    """Após upgrade head, todas as tabelas esperadas devem existir."""
    result = run_alembic(["upgrade", "head"])
    assert result.returncode == 0, f"alembic upgrade head falhou:\n{result.stderr}\n{result.stdout}"

    inspector = inspect(engine)
    tabelas = inspector.get_table_names()

    tabelas_esperadas = [
        "projetos",
        "plantas",
        "pedidos",
        "admin_users",
        "mensagens_contato",
    ]
    for tabela in tabelas_esperadas:
        assert tabela in tabelas, f"Tabela '{tabela}' não encontrada após migração"


def test_constraints_presentes(engine):
    """FK, CHECK e UNIQUE constraints devem estar presentes."""
    with engine.connect() as conn:
        # CHECK: preco >= 0 na tabela plantas
        result = conn.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.check_constraints "
                "WHERE constraint_schema = 'public'"
            )
        )
        count = result.scalar()
        assert count > 0, "Nenhuma CHECK constraint encontrada"

        # UNIQUE: slug em projetos
        result = conn.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.table_constraints "
                "WHERE constraint_type = 'UNIQUE' AND table_name IN ('projetos', 'plantas')"
            )
        )
        count = result.scalar()
        assert count >= 2, "UNIQUE constraints em projetos/plantas não encontradas"

        # FK: pedidos.planta_id → plantas.id
        result = conn.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.referential_constraints "
                "WHERE constraint_name LIKE '%planta%' OR constraint_name LIKE '%pedido%'"
            )
        )
        count = result.scalar()
        assert count > 0, "FK constraint pedidos → plantas não encontrada"


def test_downgrade_seed_reverte_migration_seed(engine):
    """Downgrade -1 remove a migration de seed (0002) mas mantém o schema (0001)."""
    result = run_alembic(["downgrade", "-1"])
    assert result.returncode == 0, f"alembic downgrade -1 falhou:\n{result.stderr}\n{result.stdout}"

    # Verifica que ainda estamos em 0001 (tabelas existem)
    inspector = inspect(engine)
    tabelas = inspector.get_table_names()
    assert "projetos" in tabelas, "Tabela 'projetos' removida indevidamente pelo downgrade -1"

    # Verifica a versão atual no banco
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version_num FROM alembic_version"))
        version = result.scalar()
    assert version == "0001_initial", f"Versão esperada '0001_initial', obtida: {version}"


def test_downgrade_base_remove_todas_tabelas(engine):
    """Downgrade base remove todas as tabelas do domínio."""
    result = run_alembic(["downgrade", "base"])
    assert result.returncode == 0, f"alembic downgrade base falhou:\n{result.stderr}\n{result.stdout}"

    inspector = inspect(engine)
    tabelas = inspector.get_table_names()
    tabelas_dominio = [t for t in tabelas if t not in ("alembic_version",)]
    assert len(tabelas_dominio) == 0, f"Tabelas ainda presentes após downgrade base: {tabelas_dominio}"

    # Restaurar para o estado HEAD ao fim do teste
    run_alembic(["upgrade", "head"])

