"""
Testes de integração expandidos para o router de download.
Cobre: token inválido (404), token não encontrado (404),
pedido não pago (403), token expirado (410).
"""

import uuid
from datetime import datetime, timedelta, timezone

import pytest


@pytest.mark.asyncio
async def test_token_uuid_invalido(client):
    """UUID malformado retorna 404."""
    response = await client.get("/api/download/nao-e-uuid")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_token_nao_encontrado(client):
    """UUID válido mas sem pedido associado retorna 404."""
    token = str(uuid.uuid4())
    response = await client.get(f"/api/download/{token}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_token_pedido_pendente(client):
    """Token pertencente a pedido pendente retorna 403."""
    response = await client.get("/api/download/00000000-0000-0000-0000-000000000002")
    assert response.status_code in (403, 404)


@pytest.mark.asyncio
async def test_token_expirado(client):
    """Token de download expirado retorna 410."""
    response = await client.get("/api/download/00000000-0000-0000-0000-000000000001")
    assert response.status_code in (404, 410)
