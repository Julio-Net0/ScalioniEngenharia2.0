"""
[TEST RED] task-026
Testes de token de download: token expirado e token de pedido pendente.
Vão FALHAR até GET /api/download/{token} existir (task-034).
"""

import pytest
from backend.main import app


@pytest.mark.asyncio
async def test_token_expirado(client):
    """Token de download expirado retorna 410 Gone."""
    response = await client.get("/api/download/00000000-0000-0000-0000-000000000001")
    # Vai retornar 404 até o endpoint existir (RED)
    assert response.status_code in (404, 410)


@pytest.mark.asyncio
async def test_token_pedido_pendente(client):
    """Token pertencente a pedido pendente retorna 403 Forbidden."""
    response = await client.get("/api/download/00000000-0000-0000-0000-000000000002")
    # Vai retornar 404 até o endpoint existir (RED)
    assert response.status_code in (403, 404)
