# Tasks — Site Scalioniengenharia 2.0

> TDD puro: cada task de teste (RED) vem ANTES do código que a faz passar (GREEN).
> Máx. 2h por task. Testes atômicos por feature/endpoint.

---

## Fase 0 — Fundação do Projeto

- [x] `task-001` Criar `backend/main.py` — entrypoint FastAPI com CORS, routers e healthcheck
- [x] `task-002` Criar `backend/core/config.py` — Settings com pydantic-settings (lê `.env`)
- [x] `task-003` Criar `backend/core/security.py` — hash de senha (bcrypt) + JWT (criar/validar)
- [x] `task-004` Criar `README.md` — visão geral, pré-requisitos, como rodar local, como fazer deploy
- [x] `task-005` Criar `.github/workflows/ci.yml` — lint + testes no PR, build Docker no push para main

---

## Fase 1 — Banco de Dados

- [x] `task-006` **[TEST RED]** `tests/test_migrations.py::test_upgrade_downgrade`
- [x] `task-007` Criar `backend/infrastructure/database/session.py` — engine SQLAlchemy + get_db dependency
- [x] `task-008` Criar `backend/infrastructure/database/models.py` — models: Projeto, Planta, Pedido, AdminUser, MensagemContato
- [x] `task-009` Inicializar Alembic — `alembic init` + `alembic.ini` + `env.py` configurado
- [x] `task-010` Criar migration inicial — tabelas completas com índices e constraints

---

## Fase 2 — Backend: Entidades de Domínio

- [x] `task-011` Criar `backend/domain/entities/projeto.py`
- [x] `task-012` Criar `backend/domain/entities/planta.py`
- [x] `task-013` Criar `backend/domain/entities/pedido.py` — incluir enum de status
- [x] `task-014` Criar `backend/domain/entities/admin_user.py`
- [x] `task-015` Criar `backend/domain/entities/mensagem_contato.py`

---

## Fase 3 — Backend: CRUD Projetos e Plantas

- [x] `task-016` **[TEST RED]** `tests/test_projetos.py`
- [x] `task-017` Criar schemas Pydantic para Projeto
- [x] `task-018` Criar repositório `ProjectRepository`
- [x] `task-019` Criar router `/api/projetos`
- [x] `task-020` **[TEST RED]** `tests/test_plantas.py`
- [x] `task-021` Criar schemas Pydantic para Planta
- [x] `task-022` Criar repositório `PlantaRepository`
- [x] `task-023` Criar router `/api/plantas`
- [x] `task-024` Criar endpoint `POST /api/upload`

---

## Fase 4 — Backend: Pagamento e Download

- [x] `task-025` **[TEST RED]** `tests/test_webhook.py`
- [x] `task-026` **[TEST RED]** `tests/test_download.py`
- [x] `task-027` Configurar SDK Mercado Pago
- [x] `task-028` Criar `POST /api/pedidos`
- [x] `task-029` Criar `POST /api/webhooks/mercadopago`
- [x] `task-030` Adicionar double-check (API MP)
- [x] `task-031` Adicionar idempotência
- [x] `task-032` Lógica `approved`: token + e-mail
- [x] `task-033` Lógica `rejected`/`cancelled`: status + e-mail
- [x] `task-034` Criar `GET /api/download/{token}`

---

## Fase 5 — Backend: Contato, Admin Auth e E-mails

- [x] `task-035` **[TEST RED]** `tests/test_contato.py`
- [x] `task-036` Criar `POST /api/contato`
- [x] `task-037` Criar serviço de e-mail `email_service.py`
- [x] `task-038` Criar templates de e-mail
- [x] `task-039` **[TEST RED]** `tests/test_admin_auth.py`
- [x] `task-040` Criar `POST /api/admin/login`
- [x] `task-041` Criar dependency `get_current_admin`
- [x] `task-042` Criar `GET /api/admin/mensagens`
- [x] `task-043` Criar `PATCH /api/admin/mensagens/{id}/lida`
- [x] `task-044` Criar `GET /api/admin/pedidos`
- [x] `task-045` Criar `POST /api/admin/pedidos/{id}/reenviar-email`

---

## Fase Final: Validação e Segurança Backend

- [x] `task-069` Configurar `docker-compose.yml` simplificado — Sem Traefik/Prod/Frontend.
- [x] `task-070` Criar script de seed — AdminUser padrão + dados de demo.
- [x] `task-071` Revisar segurança do backend — Rate limit e validação de tokens.
- [x] `task-072` Finalização do README focado nos testes de backend.
