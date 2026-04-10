"""
Testes para email_service e webhook_service via mock.
Garante cobertura sem precisar de servidor SMTP ou MP real.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch


# ─── email_service ────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_send_contact_confirmation_chama_send_email(monkeypatch):
    """send_contact_confirmation deve chamar _send_email com subject correto."""
    from backend.application import email_service

    mock_send = AsyncMock()
    monkeypatch.setattr(email_service, "_send_email", mock_send)

    await email_service.send_contact_confirmation("cliente@test.com", "João")

    mock_send.assert_called_once()
    _, args, _ = mock_send.mock_calls[0]
    assert "Recebemos sua mensagem" in mock_send.call_args.args[1]


@pytest.mark.asyncio
async def test_send_contact_admin_notification_chama_send_email(monkeypatch):
    """send_contact_admin_notification deve chamar _send_email ao admin."""
    from backend.application import email_service

    mock_send = AsyncMock()
    monkeypatch.setattr(email_service, "_send_email", mock_send)

    await email_service.send_contact_admin_notification(
        nome="Maria", email="maria@test.com", mensagem="Quero um projeto"
    )

    mock_send.assert_called_once()
    assert "Maria" in mock_send.call_args.args[2]


@pytest.mark.asyncio
async def test_send_download_email_chama_send_email(monkeypatch):
    """send_download_email deve incluir token no corpo do e-mail."""
    from backend.application import email_service

    mock_send = AsyncMock()
    monkeypatch.setattr(email_service, "_send_email", mock_send)

    await email_service.send_download_email(
        to_email="comprador@test.com",
        nome="Carlos",
        download_token="abc-token-123",
    )

    mock_send.assert_called_once()
    body = mock_send.call_args.args[2]
    assert "abc-token-123" in body


@pytest.mark.asyncio
async def test_send_payment_failed_email_chama_send_email(monkeypatch):
    """send_payment_failed_email deve chamar _send_email com mensagem de erro."""
    from backend.application import email_service

    mock_send = AsyncMock()
    monkeypatch.setattr(email_service, "_send_email", mock_send)

    await email_service.send_payment_failed_email(
        email="falhou@test.com", nome="Ana"
    )

    mock_send.assert_called_once()
    assert "Problema com seu pagamento" in mock_send.call_args.args[1]


# ─── webhook_service ──────────────────────────────────────────────────────────

def test_validate_hmac_signature_invalida():
    """Assinatura inválida retorna False."""
    from backend.application.webhook_service import validate_hmac_signature

    resultado = validate_hmac_signature(
        payload=b'{"type":"payment"}',
        signature_header="ts=1,v1=assinatura_invalida",
        request_id="req-001",
    )
    assert resultado is False


def test_validate_hmac_signature_header_vazio():
    """Header vazio retorna False."""
    from backend.application.webhook_service import validate_hmac_signature

    resultado = validate_hmac_signature(
        payload=b'{"type":"payment"}',
        signature_header="",
        request_id="",
    )
    assert resultado is False


@pytest.mark.asyncio
async def test_check_payment_status_chama_mp(monkeypatch):
    """check_payment_status retorna dict com status do MP."""
    from backend.application import webhook_service

    async def mock_get(url, **kwargs):
        class Resp:
            def json(self):
                return {"status": "approved", "external_reference": "pedido-id"}
            async def __aenter__(self): return self
            async def __aexit__(self, *a): pass
        return Resp()

    with patch("httpx.AsyncClient") as mock_client:
        mock_instance = MagicMock()
        mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
        mock_instance.__aexit__ = AsyncMock(return_value=False)
        mock_response = MagicMock()
        mock_response.json.return_value = {"status": "approved"}
        mock_instance.get = AsyncMock(return_value=mock_response)
        mock_client.return_value = mock_instance

        result = await webhook_service.check_payment_status("12345")
        assert isinstance(result, dict)
