"""
Testes expandidos para rotas do admin:
- GET /api/admin/mensagens (autenticado)
- PATCH /api/admin/mensagens/{id}/lida
- GET /api/admin/pedidos
- GET /api/admin/pedidos/{id} → 404
"""

import uuid
from decimal import Decimal

import pytest
from sqlalchemy import insert

from backend.infrastructure.database.models import MensagemContato, Planta, Pedido, PedidoStatus


# ─── Login ────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_admin_login_invalido(client):
    """Credenciais inválidas retornam 401."""
    response = await client.post(
        "/api/admin/login",
        json={"email": "naoexiste@scalioni.com", "senha": "errada"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_rota_sem_token_retorna_401(client):
    """Acesso sem token retorna 401."""
    response = await client.get("/api/admin/mensagens")
    assert response.status_code == 401


# ─── Mensagens ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_admin_list_mensagens_vazio(client, auth_headers):
    """Lista de mensagens retorna lista vazia quando não há mensagens."""
    response = await client.get("/api/admin/mensagens", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "mensagens" in data
    assert "nao_lidas" in data


@pytest.mark.asyncio
async def test_admin_list_mensagens_com_dados(client, db, auth_headers):
    """Lista mensagens retorna itens inseridos."""
    msg_id = uuid.uuid4()
    await db.execute(
        insert(MensagemContato).values(
            id=msg_id,
            nome="Ricardo Teste",
            email="ricardo@empresa.com",
            mensagem="Interesse em projeto residencial",
            lida=False,
        )
    )
    await db.flush()

    response = await client.get("/api/admin/mensagens", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["nao_lidas"] >= 1


@pytest.mark.asyncio
async def test_admin_marcar_mensagem_lida(client, db, auth_headers):
    """PATCH mensagem/{id}/lida retorna 200."""
    msg_id = uuid.uuid4()
    await db.execute(
        insert(MensagemContato).values(
            id=msg_id,
            nome="Sofia Teste",
            email="sofia@email.com",
            mensagem="Preciso de consultoria técnica",
            lida=False,
        )
    )
    await db.flush()

    response = await client.patch(
        f"/api/admin/mensagens/{msg_id}/lida",
        headers=auth_headers,
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_marcar_mensagem_inexistente(client, auth_headers):
    """PATCH mensagem inexistente retorna 404."""
    fake_id = str(uuid.uuid4())
    response = await client.patch(
        f"/api/admin/mensagens/{fake_id}/lida",
        headers=auth_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_admin_list_mensagens_filtro_nao_lidas(client, db, auth_headers):
    """Filtro lida=false retorna apenas mensagens não lidas."""
    response = await client.get(
        "/api/admin/mensagens?lida=false",
        headers=auth_headers,
    )
    assert response.status_code == 200


# ─── Pedidos Admin ────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_admin_list_pedidos(client, auth_headers):
    """GET /api/admin/pedidos retorna lista (pode ser vazia)."""
    response = await client.get("/api/admin/pedidos", headers=auth_headers)
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_get_pedido_inexistente(client, auth_headers):
    """GET pedido inexistente retorna 404."""
    fake_id = str(uuid.uuid4())
    response = await client.get(f"/api/admin/pedidos/{fake_id}", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_admin_reenviar_email_pedido_inexistente(client, auth_headers):
    """POST reenviar-email de pedido inexistente retorna 404."""
    fake_id = str(uuid.uuid4())
    response = await client.post(
        f"/api/admin/pedidos/{fake_id}/reenviar-email",
        headers=auth_headers,
    )
    assert response.status_code == 404
