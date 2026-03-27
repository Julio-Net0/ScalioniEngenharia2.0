"""
[TEST RED] task-039
Testes de autenticação admin: login errado, correto, token ausente, expirado, assinatura errada.
Vão FALHAR até POST /api/admin/login existir (task-040).
"""

import pytest
from backend.main import app


@pytest.mark.asyncio
async def test_login_senha_errada(client):
    """POST /api/admin/login com senha errada retorna 401."""
    response = await client.post(
        "/api/admin/login",
        json={"email": "admin@scalioni.com", "senha": "errada"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_rota_protegida_sem_token(client):
    """Rota protegida sem token retorna 401."""
    response = await client.get("/api/admin/mensagens")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_token_assinatura_errada(client):
    """Token de outra assinatura retorna 401."""
    from jose import jwt as pyjwt
    token = pyjwt.encode({"sub": "admin"}, "outra-chave", algorithm="HS256")
    response = await client.get(
        "/api/admin/mensagens",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401
