# Design: Fluxo de Leads e Segurança de Pagamento

**Projeto:** Scalioni Engenharia 2.0  
**Data:** 2026-03-13  
**Status:** Aprovado (Understanding Lock confirmado)

---

## Contexto

Este documento define dois fluxos complementares do sistema:

1. **Geração de leads** — captação de contatos via formulário no site público
2. **Segurança de pagamento** — integração segura com Mercado Pago para venda de plantas digitais

---

## 1. Público-Alvo

| Perfil | Descrição |
|---|---|
| **Pessoa física** | Quer construir casa própria, busca projeto residencial |
| **Pequeno empresário** | Precisa de projeto comercial para seu negócio |

Ambos os perfis interagem principalmente via:
- Formulário de contato (geração de leads)
- Loja de plantas prontas (e-commerce)

---

## 2. Fluxo de Geração de Leads

### 2.1 Campos do Formulário

```
Nome completo   (texto, obrigatório)
E-mail          (email, obrigatório)
Telefone/WhatsApp (texto, obrigatório)
Mensagem        (textarea, obrigatório)
```

### 2.2 Fluxo Completo

```
Usuário preenche formulário
        │
        ▼
POST /api/contato
        │
        ├── [1] Salva MensagemContato no banco (status: "nova")
        │
        ├── [2] SMTP/SendGrid → e-mail de confirmação ao cliente
        │       Assunto: "Sua mensagem foi recebida — Scalioni Engenharia"
        │       Conteúdo: agradecimento + prazo de resposta (1-2 dias úteis)
        │
        └── [3] SMTP/SendGrid → notificação ao admin
                Assunto: "Nova mensagem de contato — [Nome do cliente]"
                Conteúdo: todos os campos do formulário + link direto ao painel
```

### 2.3 Entidade no Banco

```
MensagemContato
├── id            (UUID)
├── nome          (str)
├── email         (str)
├── telefone      (str)
├── mensagem      (text)
├── lida          (bool, default=False)
└── criada_em     (datetime)
```

### 2.4 Painel Admin — Gestão de Leads

- Listagem de mensagens com badge "Nova" para não lidas
- Filtro por lida/não lida
- Marcar como lida ao abrir
- Link para WhatsApp pré-preenchido com nome do cliente

---

## 3. Fluxo de Pagamento — Mercado Pago

### 3.1 Fluxo de Compra

```
Cliente acessa /loja/[slug]
        │
        ▼
Clica "Comprar" → modal checkout
        │ (preenche nome, email, telefone)
        ▼
POST /api/pedidos
        │
        ├── Cria Pedido no banco (status: "pendente")
        └── Chama MP SDK → cria preferência de pagamento
                │
                ▼
        Retorna preference_id + init_point
                │
                ▼
Frontend redireciona para Checkout Mercado Pago
(PIX ou cartão com parcelamento)
```

### 3.2 Webhook — Notificação do Mercado Pago

```
POST /api/webhooks/mercadopago
        │
        ├── [SEGURANÇA 1] Validar assinatura x-signature (HMAC-SHA256)
        │       Se inválida → 400 Bad Request (não processar)
        │
        ├── Extrair payment_id do payload
        │
        ├── [SEGURANÇA 2] Consultar GET /v1/payments/{id} na API do MP
        │       (double-check de autenticidade e status real)
        │
        ├── Verificar idempotência (payment_id já processado?)
        │       Se já existe → 200 OK (ignorar, não duplicar)
        │
        └── Despachar por status:
                │
                ├── "approved" ──────────────────────────────────────────┐
                │                                                         │
                │   [1] Atualizar Pedido: status = "pago"                 │
                │       mp_payment_id = payment_id                        │
                │   [2] Gerar download_token (UUID v4)                    │
                │       expires_at = now() + 72h                         │
                │   [3] E-mail ao cliente com link de download            │
                │       GET /api/download/{token}                         │
                │   [4] Retornar 200 OK                                   │
                │                                                         ▼
                │
                ├── "rejected" / "cancelled"
                │   [1] Atualizar Pedido: status = rejected/cancelled
                │   [2] E-mail ao cliente informando a falha
                │       + link para tentar novamente (/loja/[slug])
                │   [3] Retornar 200 OK
                │
                └── outros (ex: "in_process", "pending")
                    [1] Atualizar Pedido: status = "pendente"
                    [2] Retornar 200 OK (aguardar próxima notificação)
```

### 3.3 Validação HMAC-SHA256 (Detalhe Técnico)

```python
import hmac, hashlib

def validar_assinatura_mp(request_headers, request_body, secret: str) -> bool:
    """
    Mercado Pago envia no header x-signature:
    ts=<timestamp>,v1=<hash>
    """
    signature_header = request_headers.get("x-signature", "")
    ts = extrair_campo(signature_header, "ts")
    received_hash = extrair_campo(signature_header, "v1")

    # Mensagem assinada: "id:<payment_id>;request-id:<uuid>;ts:<ts>"
    data_id = request_headers.get("x-request-id", "")
    payment_id = extrair_payment_id(request_body)

    manifest = f"id:{payment_id};request-id:{data_id};ts:{ts}"
    expected = hmac.new(
        secret.encode(), manifest.encode(), hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, received_hash)
```

### 3.4 Endpoint de Download

```
GET /api/download/{token}
        │
        ├── Buscar Pedido pelo download_token
        ├── Verificar token não expirado (expires_at > now())
        ├── Verificar pedido.status == "pago"
        └── Retornar arquivo (FileResponse / redirect para MinIO signed URL)
```

> **Nota:** Token não é invalidado após o primeiro uso — o cliente pode baixar o arquivo dentro das 72h. Se precisar de uso único, pode ser adicionado depois (YAGNI).

---

## 4. Decision Log

| Decisão | Alternativas consideradas | Motivo escolhido |
|---|---|---|
| Campos mínimos no formulário | B, C, D com campos extras | Reduz fricção de conversão; dados adicionais podem ser coletados pelo WhatsApp |
| Triple-action no envio do formulário | Apenas salvar, ou apenas email | Garante rastreabilidade no banco + boa UX para o cliente |
| HMAC + double-check via API | Apenas HMAC, apenas IP allowlist | Máxima segurança: dupla verificação previne replay attacks e webhooks falsos |
| Token 72h reutilizável | Uso único | Evita problemas se cliente perde e-mail antes de baixar; YAGNI para uso único |
| E-mail ao cliente em pagamento falho | Apenas registrar | Reduz abandono: cliente sabe o que aconteceu e tem caminho de retorno |

---

## 5. Suposições Registradas

- Idempotência do webhook garantida por verificação no `mp_payment_id` antes de processar
- O `MERCADOPAGO_WEBHOOK_SECRET` é configurado via variável de ambiente (`.env`)
- Reenvio manual do e-mail de download disponível no painel admin (caso cliente relate não ter recebido)
- Token não é invalidado após uso (YAGNI — decisão pode ser revisada)
- E-mails enviados via SMTP/SendGrid configurado em `.env.example`
