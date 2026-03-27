# Scalioni Engenharia 2.0 (Foco Backend & TDD)

Backend robusto para o escritório **Scalioni Engenharia**. Inclui portfólio, loja de plantas, webhook do Mercado Pago e painel administrativo, desenvolvido com metodologia TDD puro.

## Stack
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pytest, Slowapi (Rate Limit).
- **Banco:** PostgreSQL 16.
- **Pagamento:** Integração com Mercado Pago (Webhook + HMAC validation + double-check).

## Pré-requisitos
- Docker e Docker Compose instalados.

## Como rodar localmente (Modo TDD/Isolado)

1. **Configurar Ambiente:**
   ```bash
   cp .env.example .env
   # Edite .env (DATABASE_URL, SECRET_KEY, MP_ACCESS_TOKEN, etc.)
   ```

2. **Subir Containers:**
   ```bash
   docker compose up -d --build
   ```

3. **Migrations e Seed:**
   ```bash
   docker compose exec backend alembic upgrade head
   docker compose exec backend python -m backend.scripts.seed
   ```

## Como rodar testes (Pytest)

Os testes devem ser executados dentro do container para garantir a estrutura de módulos correta:

```bash
docker compose exec backend pytest
```

Ou especificando um teste:
```bash
docker compose exec backend pytest backend/tests/test_projetos.py
```

## Segurança Implementada
- **Rate Limit:** Proteção contra abusos no login de admin, webhook e formulário de contato via `slowapi`.
- **Validação de Webhook:** Assinatura HMAC-SHA256 em todas as notificações do Mercado Pago.
- **Idempotência:** Verificação de pagamentos processados para evitar duplicidade.
- **Double-check:** Consulta direta à API do Mercado Pago antes de liberar downloads.
- **JWT:** Tokens assinados com expiração configurável para rotas administrativas.
