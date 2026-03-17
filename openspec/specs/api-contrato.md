# Spec — Contratos de API (RFC 2119)

> Palavras-chave: **MUST** (obrigatório), **SHALL** (mandatório por cálculo), **SHOULD** (recomendado),
> **MUST NOT** (proibido), **MAY** (opcional).

---

## 1. Validação de entrada (todos os endpoints)

**Cenário 1.1 — Campo obrigatório ausente**
- **Dado** que o payload omite um campo marcado como obrigatório no schema Pydantic
- **Quando** a requisição chega ao FastAPI
- **Então** o sistema MUST retornar `HTTP 422 Unprocessable Entity`
- **E** o corpo MUST conter `{ "detail": [ { "loc": [...], "msg": "...", "type": "..." } ] }` no formato padrão do FastAPI/Pydantic

**Cenário 1.2 — Tipo de dado inválido**
- **Dado** que o payload envia `string` num campo `integer` ou `float`
- **Quando** a requisição chega ao FastAPI
- **Então** o sistema MUST retornar `HTTP 422` com detalhe do campo

**Cenário 1.3 — Payload totalmente inválido (JSON malformado)**
- **Dado** que o body não é JSON válido
- **Quando** a requisição chega
- **Então** o sistema MUST retornar `HTTP 422` — MUST NOT retornar `500`

---

## 2. POST /api/contato

**Cenário 2.1 — Submissão válida**
- **Dado** que `nome`, `email` e `mensagem` são fornecidos (telefone é opcional)
- **Quando** `POST /api/contato` é chamado
- **Então** o sistema MUST salvar `MensagemContato` no PostgreSQL com `lida = False`
- **E** MUST enviar e-mail de confirmação ao endereço do cliente
- **E** MUST enviar e-mail de notificação ao admin
- **E** MUST retornar `HTTP 201` com `{ "id": "<uuid>", "criada_em": "<iso8601>" }`

**Cenário 2.2 — E-mail do cliente inválido**
- **Dado** que `email` não é um endereço válido (falta `@`)
- **Quando** `POST /api/contato` é chamado
- **Então** o sistema MUST retornar `HTTP 422` — MUST NOT salvar no banco

**Cenário 2.3 — Serviço de e-mail indisponível**
- **Dado** que SMTP/SendGrid está inacessível
- **Quando** dados válidos são submetidos
- **Então** o sistema MUST salvar `MensagemContato` no banco (persistência garantida)
- **E** SHOULD registrar o erro de envio no log
- **E** MUST retornar `HTTP 201` (o salvamento é o contrato primário)

**Cenário 2.4 — Mensagem excede limite**
- **Dado** que `mensagem` tem mais de 2000 caracteres
- **Quando** `POST /api/contato` é chamado
- **Então** o sistema MUST retornar `HTTP 422`

---

## 3. POST /api/pedidos

**Cenário 3.1 — Criação de pedido válido**
- **Dado** que `planta_id`, `email`, `nome` são fornecidos e `planta_id` existe no banco
- **Quando** `POST /api/pedidos` é chamado
- **Então** o sistema MUST criar `Pedido` com `status = "pendente"`
- **E** MUST criar uma preference no Mercado Pago com o valor da planta
- **E** MUST retornar `HTTP 201` com `{ "pedido_id": "<uuid>", "init_point": "<url_mp>" }`

**Cenário 3.2 — planta_id não existe**
- **Dado** que `planta_id` não corresponde a nenhuma Planta no banco
- **Então** o sistema MUST retornar `HTTP 404 Not Found`

**Cenário 3.3 — Planta inativa**
- **Dado** que `planta_id` aponta para uma Planta com `ativo = False`
- **Então** o sistema MUST retornar `HTTP 422` com mensagem `"Planta não disponível para venda"`

**Cenário 3.4 — API Mercado Pago indisponível**
- **Dado** que a criação da preference no MP falha (timeout ou erro 5xx)
- **Então** o sistema MUST NOT criar o Pedido no banco
- **E** MUST retornar `HTTP 502 Bad Gateway` com mensagem de erro descritiva

---

## 4. POST /api/webhooks/mercadopago

**Cenário 4.1 — Assinatura HMAC inválida**
- **Dado** que o header `x-signature` não corresponde ao HMAC-SHA256 calculado com `MP_WEBHOOK_SECRET`
- **Quando** o webhook chega
- **Então** o sistema MUST retornar `HTTP 401`
- **E** MUST NOT processar o evento

**Cenário 4.2 — Status `approved` — primeira vez**
- **Dado** que a assinatura é válida e o double-check via `GET /v1/payments/{id}` confirma `status=approved`
- **E** não existe `Pedido` com este `mp_payment_id` já processado
- **Quando** o webhook chega
- **Então** o sistema MUST atualizar `Pedido.status = "pago"`
- **E** MUST gerar `download_token` (UUID v4) com `expires_at = now() + 72h`
- **E** MUST enviar e-mail ao cliente com o link de download
- **E** MUST retornar `HTTP 200`

**Cenário 4.3 — Status `approved` — disparo duplicado (idempotência)**
- **Dado** que já existe um `Pedido` com o mesmo `mp_payment_id` e `status = "pago"`
- **Quando** o mesmo webhook chega novamente
- **Então** o sistema MUST retornar `HTTP 200` (sem reprocessar)
- **E** MUST NOT enviar um segundo e-mail ao cliente

**Cenário 4.4 — Status `rejected` ou `cancelled`**
- **Dado** que o double-check confirma `status=rejected` ou `status=cancelled`
- **Então** o sistema MUST atualizar `Pedido.status` correspondente
- **E** MUST enviar e-mail ao cliente com link para tentar novamente
- **E** MUST retornar `HTTP 200`

**Cenário 4.5 — Double-check retorna status diferente do webhook**
- **Dado** que o webhook diz `approved` mas a API MP retorna `pending`
- **Então** o sistema MUST confiar no retorno do double-check
- **E** MUST atualizar o status para `in_process` e aguardar próxima notificação

---

## 5. GET /api/download/{token}

**Cenário 5.1 — Token válido e dentro do prazo**
- **Dado** que `token` existe, `Pedido.status = "pago"` e `expires_at > now()`
- **Então** o sistema MUST retornar o arquivo como `FileResponse` (dev) ou signed URL MinIO (prod)
- **E** MUST retornar `HTTP 200`

**Cenário 5.2 — Token inexistente**
- **Então** o sistema MUST retornar `HTTP 404`

**Cenário 5.3 — Token expirado**
- **Dado** que `expires_at <= now()`
- **Então** o sistema MUST retornar `HTTP 410 Gone` com mensagem `"Link de download expirado"`

**Cenário 5.4 — Token válido mas status != pago**
- **Então** o sistema MUST retornar `HTTP 403 Forbidden`

---

## 6. Rotas Admin (autenticação JWT)

**Cenário 6.1 — Rota protegida sem token**
- **Dado** que nenhum header `Authorization: Bearer <token>` é enviado
- **Então** o sistema MUST retornar `HTTP 401`

**Cenário 6.2 — Token expirado**
- **Dado** que o JWT está expirado
- **Então** o sistema MUST retornar `HTTP 401` com mensagem `"Token expirado"`

**Cenário 6.3 — Token de outro sistema (assinatura inválida)**
- **Então** o sistema MUST retornar `HTTP 401`

---

## 7. Banco de dados indisponível

**Cenário 7.1 — PostgreSQL inacessível**
- **Dado** que o PostgreSQL está fora do ar
- **Quando** qualquer endpoint que precisa do banco é chamado
- **Então** o sistema MUST retornar `HTTP 503 Service Unavailable`
- **E** MUST NOT expor detalhes internos da conexão no corpo da resposta
- **E** SHOULD logar o erro com stack trace internamente
