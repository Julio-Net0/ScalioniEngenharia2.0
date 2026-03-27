"""
[TEST RED] task-016
Testes de Projetos: GET lista, POST validação, GET slug, DELETE auth.
Vão FALHAR até o router /api/projetos ser criado (task-019).
"""

import pytest
from backend.main import app


@pytest.mark.asyncio
async def test_list_projetos(client):
    """GET /api/projetos retorna 200 com lista."""
    response = await client.get("/api/projetos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_projeto_sem_slug(client, auth_headers):
    """POST sem slug retorna 422."""
    response = await client.post(
        "/api/projetos",
        json={
            "titulo": "Projeto Teste",
            "descricao": "Desc",
            "categoria": "Residencial",
            "imagem_capa": "img.jpg",
            "ano": 2024,
        },
        headers=auth_headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_projeto_slug_inexistente(client):
    """GET por slug inexistente retorna 404."""
    response = await client.get("/api/projetos/nao-existe-xyz")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_projeto_sem_jwt(client):
    """DELETE sem JWT retorna 401."""
    response = await client.delete("/api/projetos/qualquer-slug")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_projeto_slug_duplicado(client, auth_headers, monkeypatch):
    """POST com slug duplicado retorna 422."""
    from backend.infrastructure.repositories.projeto_repository import ProjectRepository
    from backend.infrastructure.database.models import Projeto
    import uuid

    async def mock_get_by_slug(self, slug):
        # Retorna um objeto que avalia como True (existente)
        return Projeto(id=uuid.uuid4(), slug=slug, titulo="Existe", descricao="D", categoria="C", imagem_capa="img.jpg", ano=2024)

    monkeypatch.setattr(ProjectRepository, "get_by_slug", mock_get_by_slug)

    response = await client.post(
        "/api/projetos",
        json={
            "slug": "slug-duplicado",
            "titulo": "T",
            "descricao": "D",
            "categoria": "C",
            "imagem_capa": "i.jpg",
            "ano": 2024,
        },
        headers=auth_headers,
    )
    assert response.status_code == 422
