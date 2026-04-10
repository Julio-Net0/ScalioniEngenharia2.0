import pytest
import uuid
from decimal import Decimal
from unittest.mock import AsyncMock
from sqlalchemy import insert
from backend.application import webhook_service
from backend.infrastructure.database.models import Planta, Pedido, PedidoStatus

@pytest.fixture
def webhook_headers():
    return {"x-signature": "sig", "x-request-id": "req-double-check"}

@pytest.mark.asyncio
async def test_webhook_double_check_approved(client, db, monkeypatch, webhook_headers):
    """Testa o fluxo completo quando o double-check retorna 'approved'."""
    monkeypatch.setattr(webhook_service, "validate_hmac_signature", lambda *a: True)
    monkeypatch.setattr(webhook_service, "handle_approved", AsyncMock())
    
    # Setup
    planta_id = uuid.uuid4()
    pedido_id = uuid.uuid4()
    await db.execute(insert(Planta).values(
        id=planta_id, slug="p-dc-app", titulo="T", descricao="D", preco=Decimal("10"), ativo=True
    ))
    await db.execute(insert(Pedido).values(
        id=pedido_id, planta_id=planta_id, email="a@a.com", nome="A", valor=Decimal("10"),
        status=PedidoStatus.pendente
    ))
    await db.flush()
    
    # Mock Double-Check
    monkeypatch.setattr(webhook_service, "check_payment_status", AsyncMock(return_value={
        "status": "approved",
        "external_reference": str(pedido_id)
    }))
    
    payload = {"data": {"id": "pay_app_123"}, "type": "payment"}
    response = await client.post("/api/webhooks/mercadopago", json=payload, headers=webhook_headers)
    
    assert response.status_code == 200
    assert response.json()["status"] == "processed"
    assert webhook_service.handle_approved.called

@pytest.mark.asyncio
async def test_webhook_double_check_rejected(client, db, monkeypatch, webhook_headers):
    """Testa o fluxo quando o double-check retorna 'rejected'."""
    monkeypatch.setattr(webhook_service, "validate_hmac_signature", lambda *a: True)
    monkeypatch.setattr("backend.application.email_service.send_payment_failed_email", AsyncMock())
    
    # Setup
    planta_id = uuid.uuid4()
    pedido_id = uuid.uuid4()
    await db.execute(insert(Planta).values(
        id=planta_id, slug="p-dc-rej", titulo="T", descricao="D", preco=Decimal("10"), ativo=True
    ))
    await db.execute(insert(Pedido).values(
        id=pedido_id, planta_id=planta_id, email="a@a.com", nome="A", valor=Decimal("10"),
        status=PedidoStatus.pendente
    ))
    await db.flush()
    
    # Mock Double-Check
    monkeypatch.setattr(webhook_service, "check_payment_status", AsyncMock(return_value={
        "status": "rejected",
        "external_reference": str(pedido_id)
    }))
    
    payload = {"data": {"id": "pay_rej_123"}, "type": "payment"}
    response = await client.post("/api/webhooks/mercadopago", json=payload, headers=webhook_headers)
    
    assert response.status_code == 200
    from backend.application.email_service import send_payment_failed_email
    assert send_payment_failed_email.called

@pytest.mark.asyncio
async def test_webhook_double_check_api_error(client, monkeypatch, webhook_headers):
    """Testa o comportamento quando a API do Mercado Pago falha (exceção)."""
    monkeypatch.setattr(webhook_service, "validate_hmac_signature", lambda *a: True)
    
    # Mock Double-Check levantando exceção
    monkeypatch.setattr(webhook_service, "check_payment_status", AsyncMock(side_effect=Exception("Timeout")))
    
    payload = {"data": {"id": "pay_err_123"}, "type": "payment"}
    response = await client.post("/api/webhooks/mercadopago", json=payload, headers=webhook_headers)
    
    assert response.status_code == 200 # Webhook deve retornar 200 para a MP não re-enviar infinitamente se o erro for nosso
    assert response.json()["status"] == "error"
