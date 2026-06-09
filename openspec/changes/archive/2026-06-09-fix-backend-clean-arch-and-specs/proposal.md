## Why

O backend possui violações graves de Clean Architecture, como routers acessando diretamente o banco de dados via SQLAlchemy e instanciando SDKs de terceiros (Mercado Pago). Além disso, existem múltiplos desvios em relação à especificação (`api-contrato.md` e `pagamento-webhook.md`), incluindo retorno inadequado de contato, persistência de pedidos inválidos quando o Mercado Pago falha, cálculo incorreto do HMAC webhook, e-mails com links divergentes, e falta de validação de variáveis de ambiente no startup.

## What Changes

- Implementação dos repositórios em falta (`PedidoRepository`, `MensagemContatoRepository` e `AdminUserRepository`).
- Acoplamento zero de infraestrutura e banco nos routers, migrando a lógica de negócios para a camada de aplicação/serviço.
- Correção de retorno em `POST /api/contato` para incluir `criada_em` e `id` no padrão ISO8601.
- Correção de `POST /api/pedidos` para retornar `HTTP 422` em planta inativa e `HTTP 502` com descarte de pedido se o Mercado Pago falhar.
- Ajuste na validação HMAC do webhook para calcular o hash sobre os `body_raw_bytes`.
- Correção nos templates de e-mail (link correto, nome da planta, fallback WhatsApp e motivo de falha).
- Adição de verificação de ambiente no startup da aplicação.

## Capabilities

### Modified Capabilities
- `api-contrato`: Alinhamento total dos retornos, códigos de erro HTTP e fluxos de contorno.
- `pagamento-webhook`: Correção da idempotência, segurança HMAC, e-mails transacionais e validação de inicialização.

## Non-goals

- Não serão feitas alterações na interface visual (frontend) nesta proposta.
- Não serão modificadas as tabelas ou campos do banco de dados (o DDL existente é suficiente).

## Impact

- **Backend**: Afeta `backend/interfaces/routers/`, `backend/core/config.py`, `backend/application/` e `backend/infrastructure/repositories/`.
- **Testes**: Exige refatoração das asserções incorretas nos testes para coincidir com a especificação original.
