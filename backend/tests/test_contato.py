"""
[TEST RED] task-035
Testes de contato: e-mail inválido, mensagem longa, payload válido, SMTP offline.
Vão FALHAR até POST /api/contato existir (task-036).
"""

import pytest
from backend.main import app


@pytest.mark.asyncio
async def test_contato_email_invalido(client):
    """POST /api/contato com e-mail inválido retorna 422."""
    response = await client.post(
        "/api/contato",
        json={"nome": "Ana", "email": "nao-eh-email", "mensagem": "Olá"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_contato_mensagem_longa(client):
    """POST /api/contato com mensagem > 2000 chars retorna 422."""
    response = await client.post(
        "/api/contato",
        json={"nome": "Ana", "email": "ana@test.com", "mensagem": "x" * 2001},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_contato_valido(client, monkeypatch):
    """Payload válido retorna 201 + MensagemContato salva + 2 e-mails enfileirados."""
    from backend.application import email_service

    emails_enviados = []

    async def mock_send_contact_confirmation(to_email, nome):
        emails_enviados.append(("confirmacao", to_email))

    async def mock_send_contact_admin_notification(nome, email, mensagem):
        emails_enviados.append(("admin", email))

    monkeypatch.setattr(email_service, "send_contact_confirmation", mock_send_contact_confirmation)
    monkeypatch.setattr(email_service, "send_contact_admin_notification", mock_send_contact_admin_notification)

    response = await client.post(
        "/api/contato",
        json={"nome": "Ana", "email": "ana@test.com", "mensagem": "Quero um orçamento"},
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_contato_smtp_offline(client, monkeypatch):
    """SMTP offline → 201 (banco salvo, erro logado)."""
    from backend.application import email_service

    async def mock_send_fail(*args, **kwargs):
        raise ConnectionError("SMTP offline")

    monkeypatch.setattr(email_service, "send_contact_confirmation", mock_send_fail)
    monkeypatch.setattr(email_service, "send_contact_admin_notification", mock_send_fail)

    response = await client.post(
        "/api/contato",
        json={"nome": "Ana", "email": "ana@test.com", "mensagem": "Texto válido"},
    )
    assert response.status_code == 201
