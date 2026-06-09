## 1. Camada de Banco e Repositórios (Infrastructure)

- [x] 1.1 Criar `PedidoRepository` com suporte a `with_for_update` no `get_by_mp_payment_id` e transações atômicas.
- [x] 1.2 Criar `MensagemContatoRepository` para operações CRUD e marcação de lida.
- [x] 1.3 Criar `AdminUserRepository` para login e listagem de usuários.

## 2. Camada de Aplicação e Serviços (Application)

- [x] 2.1 Refatorar `webhook_service.py` para calcular o HMAC correto a partir do `body_raw_bytes` do request.
- [x] 2.2 Atualizar `email_service.py` com o link de download no formato `{FRONTEND_URL}/download/{token}` e passar o nome da planta.
- [x] 2.3 Atualizar `email_service.py` no envio de falha de pagamento para aceitar slug e motivo de recusa.
- [x] 2.4 Criar serviço de criação de pedidos na camada de aplicação para abstrair a chamada do Mercado Pago fora do router.

## 3. Camada de Interfaces e Routers (Interfaces)

- [x] 3.1 Refatorar `POST /api/contato` para usar o `MensagemContatoRepository` e retornar `id` + `criada_em`.
- [x] 3.2 Refatorar `POST /api/pedidos` para usar o novo serviço de criação de pedidos, retornar `HTTP 422` para plantas inativas, e `HTTP 502` se a criação de preferência do Mercado Pago falhar (com descarte no banco).
- [x] 3.3 Refatorar `POST /api/webhooks/mercadopago` para usar `PedidoRepository` com lock pessimista na idempotência.
- [x] 3.4 Refatorar `GET /api/download/{token}` para usar `PedidoRepository` e levantar as exceções corretas.
- [x] 3.5 Refatorar endpoints em `admin.py` para usar os repositórios em vez de chamadas diretas SQL.
- [x] 3.6 Adicionar validação de variáveis obrigatórias no startup da aplicação em `main.py`.

## 4. Testes e Verificação

- [x] 4.1 Corrigir asserções em `test_pedidos.py` (deve esperar 422 para inativa, 502 para falha do MP) e em `test_new_features.py`.
- [x] 4.2 Adicionar testes unitários para a validação HMAC sobre o body bruto.
- [x] 4.3 Adicionar testes para a validação das variáveis obrigatórias no startup.
- [x] 4.4 Executar a suíte de testes com `docker compose exec backend pytest` e obter 100% de sucesso.
