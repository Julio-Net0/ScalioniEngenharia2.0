import pytest
import asyncio
import subprocess
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.main import app
from backend.infrastructure.database.session import get_db
from backend.core.config import settings


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
    """Aplica as migrations antes de todos os testes e reverte ao final."""
    # Desabilita o limiter para todos os testes
    from backend.core.security import limiter
    limiter.enabled = False
    
    subprocess.run(["alembic", "upgrade", "head"], check=True, cwd="/app/backend")
    yield
    subprocess.run(["alembic", "downgrade", "base"], check=True, cwd="/app/backend")


@pytest.fixture
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def engine():
    engine = create_async_engine(settings.database_url, echo=False)
    yield engine
    await engine.dispose()

@pytest.fixture
async def db(engine):
    TestingSessionLocal = async_sessionmaker(
        autocommit=False, autoflush=False, bind=engine, expire_on_commit=False
    )
    async with TestingSessionLocal() as session:
        # Iniciamos uma transação para cada teste
        async with session.begin():
            yield session
            # O rollback é automático ao sair do context manager se não houver commit explícito em alguns casos,
            # mas aqui estamos usando await session.rollback() abaixo se não usarmos engine.begin()
        await session.rollback()

@pytest.fixture
async def client(db):
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture
def admin_token():
    from backend.core.security import create_access_token
    from datetime import timedelta
    return create_access_token(data={"sub": "admin"}, expires_delta=timedelta(minutes=10))

@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
