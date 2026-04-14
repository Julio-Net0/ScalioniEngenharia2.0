# Scalioni Engenharia 2.0 (Foco Backend & TDD)

Backend robusto para o escritório **Scalioni Engenharia**. Inclui portfólio, loja de plantas, webhook do Mercado Pago e painel administrativo, desenvolvido com metodologia TDD puro.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pytest |
| Banco | PostgreSQL 16 |
| Rate Limit | SlowAPI |
| Métricas | prometheus-fastapi-instrumentator |
| Pagamento | Mercado Pago SDK + HMAC-SHA256 + double-check |

## Pré-requisitos

- Docker e Docker Compose instalados

## Setup de Desenvolvimento

### 1. Configurar Ambiente

```bash
cp .env.example .env
# Edite .env: DATABASE_URL, SECRET_KEY, MP_ACCESS_TOKEN, SMTP_*, etc.
```

### 2. Subir Containers

```bash
docker compose up -d --build
```

### 3. Migrations

```bash
# Aplica schema (tabelas, índices, constraints)
docker compose exec backend alembic upgrade head
```

### 4. Seed de Desenvolvimento

A migration `0002_seed_dev` insere dados iniciais quando `SEED_ENV=dev`:

```bash
# Opção A — seed via Alembic (idempotente, ON CONFLICT DO NOTHING)
SEED_ENV=dev docker compose exec -e SEED_ENV=dev backend alembic upgrade head

# Opção B — script standalone (mesmos dados)
docker compose exec backend python -m backend.scripts.seed
```

**Dados inseridos:**
- Admin: `admin@scalioni.com` / senha `admin123` *(trocar em produção!)*
- 2 projetos de demonstração
- 2 plantas de demonstração

## Testes do Backend (Pytest + TDD)

Os testes usam banco real (migrations aplicadas no `conftest.py`) e devem rodar dentro do container:

```bash
# Todos os testes
docker compose exec backend pytest /app/backend/tests -v --tb=short

# Arquivo específico
docker compose exec backend pytest /app/backend/tests/test_projetos.py -v

# Com cobertura
docker compose exec backend pytest /app/backend/tests --cov=backend --cov-report=term-missing
```

**Suite de testes atual (15 arquivos):**

| Arquivo | Foco |
|---|---|
| `test_migrations.py` | upgrade/downgrade Alembic |
| `test_projetos.py` | CRUD projetos via API |
| `test_plantas.py` | CRUD plantas via API |
| `test_pedidos.py` | criação de pedidos |
| `test_webhook.py` | recebimento e validação HMAC |
| `test_webhook_double_check.py` | verificação na API do MP |
| `test_download.py` | endpoint de download por token |
| `test_contato.py` | formulário de contato |
| `test_admin_auth.py` | login JWT admin |
| `test_admin_expanded.py` | rotas admin expandidas |
| `test_services.py` | serviços de e-mail |
| `test_entities_e_timezone.py` | entidades e timezone handling |
| `test_coverage_bonus.py` | edge cases e cobertura extra |

## Métricas (Prometheus)

O endpoint `/metrics` está disponível após subir o backend:

```bash
curl http://localhost:8000/metrics
```

Para integrar com Grafana, configure o `prometheus.yml` apontando para `http://backend:8000/metrics`.

## Docker — Builds

| Target | Uso | Comando |
|---|---|---|
| `dev` (padrão) | Desenvolvimento com hot-reload | `docker compose up` |
| `prod` | Produção: sem dev-deps, usuário não-root, 2 workers | `docker build --target prod -t scalioni-prod ./backend` |

## Segurança Implementada

| Mecanismo | Detalhes |
|---|---|
| Rate Limit | `/api/contato` 3/min · `/api/admin/login` 5/min · `/api/pedidos` 10/min |
| Webhook HMAC | Assinatura SHA256 obrigatória em notificações do MP |
| Idempotência | Verificação por `mp_payment_id` antes de processar pagamento |
| Double-check | Consulta à API do MP antes de liberar link de download |
| JWT Admin | Token assinado, expiração 24h, validado em `/api/admin/*` |
| Download Token | UUID v4, expira em 72h, vinculado ao pedido `pago` |

