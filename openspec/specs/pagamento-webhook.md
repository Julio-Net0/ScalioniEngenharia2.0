# Spec — Pagamento e Webhook Mercado Pago (RFC 2119)

> Palavras-chave: **MUST** (obrigatório), **SHALL** (mandatório lógico), **SHOULD** (recomendado), **MUST NOT** (proibido).

---

## 1. Máquina de Estados do Pedido

```
[pendente] ──approved──► [pago]
[pendente] ──rejected──► [rejected]
[pendente] ──cancelled──► [cancelled]
[pendente] ──in_process──► [in_process] ──approved──► [pago]
[in_process] ──rejected──► [rejected]
```

- Transições MUST seguir o diagrama acima
- Uma vez em `pago`, o status MUST NOT ser alterado por nenhum webhook subsequente
- Uma vez em `rejected` ou `cancelled`, o status MUST NOT regredir para `pendente`

---

## 2. Segurança do Webhook

**Cenário 2.1 — Validação HMAC obrigatória**
- O handler MUST extrair o header `x-signature` de cada requisição incoming
- O handler MUST calcular `HMAC-SHA256(body_raw_bytes, MP_WEBHOOK_SECRET)`
- Se a assinatura não bater: MUST retornar `HTTP 401` e MUST NOT processar o evento
- `MP_WEBHOOK_SECRET` MUST ser lido de variável de ambiente — MUST NOT estar hardcoded

**Cenário 2.2 — Double-check obrigatório**
- Mesmo com assinatura válida, o handler MUST fazer `GET https://api.mercadopago.com/v1/payments/{payment_id}`
  usando `MP_ACCESS_TOKEN` antes de tomar qualquer ação
- O `payment_id` MUST ser extraído do payload do webhook, não confiado diretamente como status final
- Se o double-check falhar (timeout/5xx da API MP): MUST retornar `HTTP 200` ao MP (evitar retry loop)
  E SHOULD registrar o evento para reprocessamento manual

---

## 3. Idempotência

**Cenário 3.1 — Duplo disparo do mesmo evento**
- O handler MUST verificar se já existe `Pedido` com `mp_payment_id = <id>` E `status = "pago"`
  antes de processar um `approved`
- Se já processado: MUST retornar `HTTP 200` imediatamente SEM reprocessar
- Essa verificação MUST acontecer dentro de transação no banco para evitar race condition

**Cenário 3.2 — Concorrência (múltiplos webhooks simultâneos)**
- A verificação de idempotência SHOULD usar `SELECT ... FOR UPDATE` ou lock otimista
  para evitar que duas threads processem o mesmo `mp_payment_id` simultaneamente

---

## 4. Geração do Download Token

- Quando `status = approved` e validações passam:
  - MUST gerar `download_token = uuid.uuid4()`
  - MUST definir `expires_at = datetime.utcnow() + timedelta(hours=72)`
  - MUST persistir ambos no `Pedido` em uma única transação com o update de status
- O token MUST ser reutilizável dentro do prazo de 72h (mesmo link funciona múltiplas vezes)
- Após `expires_at`: MUST retornar `HTTP 410 Gone` — MUST NOT gerar novo token automaticamente

---

## 5. E-mails Transacionais

**E-mail de download (approved)**
- MUST ser enviado APÓS a persistência do token no banco (ordem: banco → e-mail)
- MUST conter o link `{FRONTEND_URL}/download/{token}`
- MUST conter nome da planta comprada e prazo de expiração (72h)
- SHOULD mencionar suporte via WhatsApp como fallback

**E-mail de falha (rejected/cancelled)**
- MUST conter link para a página da planta `{FRONTEND_URL}/loja/{slug}`
- MUST conter motivo simplificado (ex: "Pagamento recusado pela operadora")

**Falha no envio de e-mail**
- Se o serviço de e-mail falhar: MUST NOT reverter a transação de banco (token continua salvo)
- SHOULD logar o erro com `pedido_id` para reenvio manual pelo admin via `/api/admin/pedidos/{id}/reenviar-email`

---

## 6. Variáveis de Ambiente Obrigatórias

| Variável | Uso | Obrigatoriedade |
|---|---|---|
| `MP_ACCESS_TOKEN` | Criar preference e double-check | MUST |
| `MP_WEBHOOK_SECRET` | Validar HMAC-SHA256 | MUST |
| `FRONTEND_URL` | Compor links no e-mail | MUST |
| `SMTP_HOST` / `SENDGRID_API_KEY` | Envio de e-mails | MUST (um dos dois) |

- Aplicação MUST falhar no startup (`startup_event`) se qualquer variável MUST acima estiver ausente
- MUST NOT logar o valor de `MP_ACCESS_TOKEN` ou `MP_WEBHOOK_SECRET` em qualquer nível de log

---

## 7. Retry e Tolerância a Falhas

- Se o handler retornar qualquer status >= 400 (exceto 401 de assinatura inválida): o Mercado Pago fará retry
- O handler MUST retornar `HTTP 200` para eventos que não requerem ação (status desconhecido, já processado)
- O handler MUST retornar `HTTP 500` apenas em caso de erro inesperado não relacionado à assinatura
