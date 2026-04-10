# Como Rodar e Testar — Scalioni Engenharia 2.0

## Pré-requisitos

- Docker e Docker Compose instalados

---

## 1. Primeira vez (setup completo)

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Subir todos os containers
docker compose up -d --build

# 3. Aplicar migrations (criar tabelas)
docker compose exec -w /app/backend backend alembic upgrade head

# 4. Popular banco com dados de demonstração
docker compose exec -w /app/backend backend python -m backend.scripts.seed
```

---

## 2. Uso diário (Docker já configurado)

```bash
# Subir tudo
docker compose up -d

# Parar tudo
docker compose down
```

---

## 3. Rodar os testes unitários

```bash
# Todos os testes com cobertura (padrão — relatório no terminal + htmlcov/)
docker compose exec backend pytest backend/tests/ -v

# Um arquivo específico
docker compose exec backend pytest backend/tests/test_contato.py -v
```

> ✅ Os testes aplicam migrations automaticamente via fixture `apply_migrations` no `conftest.py`.

---

## 4. Relatório de cobertura de código

Ao rodar `pytest`, a cobertura é gerada automaticamente via `pytest-cov`.

```bash
# Rodar testes + ver cobertura no terminal (padrão)
docker compose exec backend pytest backend/tests/ -v

# Apenas relatório resumido (sem detalhes de linhas)
docker compose exec backend pytest --cov-report=term

# Gerar relatório HTML interativo em htmlcov/
docker compose exec backend pytest --cov-report=html:htmlcov

# Rodar sem cobertura (mais rápido, para debug pontual)
docker compose exec backend pytest backend/tests/ -v --no-cov
```

O relatório HTML fica em `backend/htmlcov/index.html` — abra no navegador para ver quais linhas estão sem cobertura.

> ⚠️ A suíte falha automaticamente se a cobertura cair abaixo de **80%** (configurado em `pytest.ini`).

---

## 4. Testar via Swagger (API)

Acesse: **http://localhost:8000/docs**

### Para rotas públicas
Basta usar direto no Swagger (GET /api/projetos, POST /api/contato, etc.)

### Para rotas protegidas (`/api/admin/*`)

1. Chame `POST /api/admin/login`:
```json
{ "email": "admin@scalioni.com", "senha": "admin123" }
```
2. Copie o `access_token` da resposta
3. Clique em **Authorize** 🔒 (canto superior direito)
4. Cole: `Bearer <token>`

---

## 5. Ver o banco no pgAdmin

Acesse: **http://localhost:5050**

**Login pgAdmin:**
- Email: `admin@scalioni.com`
- Senha: `admin`

**Adicionar servidor** (botão direito em Servers → Register → Server):

| Aba | Campo | Valor |
|---|---|---|
| General | Name | Scalioni |
| Connection | Host | `postgres` |
| Connection | Port | `5432` |
| Connection | Database | `scalioni` |
| Connection | Username | `scalioni` |
| Connection | Password | `senha-segura` |

**Navegar nas tabelas:**
```
Servers → Scalioni → Databases → scalioni → Schemas → public → Tables
```

---

## 6. Credenciais de referência

| Serviço | URL | Usuário | Senha |
|---|---|---|---|
| Swagger API | http://localhost:8000/docs | — | — |
| pgAdmin | http://localhost:5050 | admin@scalioni.com | admin |
| Admin API | POST /api/admin/login | admin@scalioni.com | admin123 |
| PostgreSQL | localhost:5432 | scalioni | senha-segura |

---

## 7. Comandos úteis

```bash
# Ver logs do backend
docker compose logs -f backend

# Recriar banco do zero (CUIDADO: apaga tudo)
docker compose down -v
docker compose up -d --build
docker compose exec -w /app/backend backend alembic upgrade head
docker compose exec -w /app/backend backend python -m backend.scripts.seed

# Acessar shell do container
docker compose exec backend bash

# Rodar migration manualmente
docker compose exec -w /app/backend backend alembic upgrade head

# Reverter migrations
docker compose exec -w /app/backend backend alembic downgrade base
```
