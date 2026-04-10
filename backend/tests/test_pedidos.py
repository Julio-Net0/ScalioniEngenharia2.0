"""
Testes de integração para POST /api/pedidos.
Cobre: planta inexistente (404), planta inativa (404),
pedido criado com sucesso (201, MP mockado).
"""

import uuid
from decimal import Decimal

import pytest
from sqlalchemy import insert

from backend.infrastructure.database.models import Planta


@pytest.mark.asyncio
async def test_criar_pedido_planta_nao_encontrada(client):
    """Planta inexistente retorna 404."""
    payload = {
        "planta_id": str(uuid.uuid4()),
        "email": "cliente@email.com",
        "nome": "Cliente Teste",
        "telefone": None,
    }
    response = await client.post("/api/pedidos", json=payload)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_criar_pedido_planta_inativa(client, db):
    """Planta inativa retorna 404."""
    planta_id = uuid.uuid4()
    await db.execute(
        insert(Planta).values(
            id=planta_id,
            slug="planta-inativa",
            titulo="Planta Inativa",
            descricao="Teste",
            preco=Decimal("990.00"),
            ativo=False,
        )
    )
    await db.flush()

    payload = {
        "planta_id": str(planta_id),
        "email": "cliente@email.com",
        "nome": "Cliente Teste",
        "telefone": None,
    }
    response = await client.post("/api/pedidos", json=payload)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_criar_pedido_sucesso(client, db, monkeypatch):
    """Pedido criado com sucesso: retorna 201 (MP mockado)."""
    planta_id = uuid.uuid4()
    await db.execute(
        insert(Planta).values(
            id=planta_id,
            slug="residencia-teste",
            titulo="Residência Teste",
            descricao="Planta de teste",
            preco=Decimal("2490.00"),
            ativo=True,
        )
    )
    await db.flush()

    # Mocka SDK do Mercado Pago
    class FakePref:
        def create(self, data):
            return {"response": {"init_point": "https://mp.com/checkout/123"}}

    class FakeSDK:
        def preference(self):
            return FakePref()

    import mercadopago
    monkeypatch.setattr(mercadopago, "SDK", lambda token: FakeSDK())

    payload = {
        "planta_id": str(planta_id),
        "email": "cliente@email.com",
        "nome": "Cliente Teste",
        "telefone": "11999999999",
    }
    response = await client.post("/api/pedidos", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data


@pytest.mark.asyncio
async def test_criar_pedido_mp_falha_retorna_201(client, db, monkeypatch):
    """Se MP falhar, pedido ainda é criado com init_point vazio → 201."""
    planta_id = uuid.uuid4()
    await db.execute(
        insert(Planta).values(
            id=planta_id,
            slug="residencia-sem-mp",
            titulo="Residência sem MP",
            descricao="Teste fallback MP",
            preco=Decimal("1500.00"),
            ativo=True,
        )
    )
    await db.flush()

    import mercadopago
    monkeypatch.setattr(mercadopago, "SDK", lambda token: (_ for _ in ()).throw(Exception("MP offline")))

    payload = {
        "planta_id": str(planta_id),
        "email": "fallback@email.com",
        "nome": "Fallback Teste",
        "telefone": None,
    }
    response = await client.post("/api/pedidos", json=payload)
    # Pedido criado mas init_point vazio
    assert response.status_code == 201
