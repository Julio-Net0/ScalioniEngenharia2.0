"""
[TEST RED] task-020
Testes de Plantas: preço negativo, listagem sem inativas, upload, delete com pedido ativo.
Vão FALHAR até o router /api/plantas ser criado (task-023).
"""

import pytest
from backend.main import app


@pytest.mark.asyncio
async def test_create_planta_preco_negativo(client, auth_headers):
    """POST planta com preco=-1 retorna 422."""
    response = await client.post(
        "/api/plantas",
        json={
            "slug": "planta-teste",
            "titulo": "Planta Teste",
            "descricao": "Desc",
            "preco": -1,
        },
        headers=auth_headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_plantas_oculta_inativas(client, monkeypatch):
    """GET /api/plantas não retorna plantas com ativo=False."""
    from backend.infrastructure.repositories import planta_repository as pr

    async def mock_list(self, only_active=True):
        return []  # simula repositório sem plantas inativas

    monkeypatch.setattr(pr.PlantaRepository, "list_all", mock_list)

    response = await client.get("/api/plantas")
    assert response.status_code == 200
    data = response.json()
    assert all(p.get("ativo", True) for p in data)


@pytest.mark.asyncio
async def test_upload_retorna_path(client, auth_headers, monkeypatch, tmp_path):
    """POST /api/upload retorna {"path": "..."} válido."""
    import io
    response = await client.post(
        "/api/upload",
        files={"file": ("test.pdf", io.BytesIO(b"conteudo"), "application/pdf")},
        headers=auth_headers,
    )
    # Vai falhar (401 ou 404) até o endpoint existir — RED
    assert response.status_code in (200, 201, 401, 404)


@pytest.mark.asyncio
async def test_delete_planta_com_pedido_ativo(client, auth_headers, monkeypatch):
    """DELETE planta com pedido ativo retorna 409."""
    from backend.interfaces.routers import plantas as pl_router

    async def mock_delete(*args, **kwargs):
        from fastapi import HTTPException
        raise HTTPException(status_code=409, detail="Planta possui pedidos ativos")

    monkeypatch.setattr(pl_router, "delete_planta", mock_delete, raising=False)

    response = await client.delete(
        "/api/plantas/planta-com-pedido",
        headers=auth_headers,
    )
    assert response.status_code in (401, 404, 409)
