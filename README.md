# Scalioni Engenharia 2.0

Site institucional + e-commerce para a **Scalioni Engenharia** — portfólio de projetos, loja de plantas prontas e geração de leads para projetos personalizados.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic, Pydantic v2 |
| Frontend | Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn/UI |
| Banco | PostgreSQL 16 |
| Pagamento | Mercado Pago |
| Infra | Docker + Docker Compose + GitHub Actions |

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Git](https://git-scm.com/)

## Setup rápido (desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ScalioniEngenharia2.0.git
cd ScalioniEngenharia2.0

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (Mercado Pago, SMTP, etc.)

# 3. Suba os containers
docker compose up --build

# 4. Execute as migrações do banco
docker compose exec backend alembic upgrade head

# 5. Crie o primeiro admin
docker compose exec backend python -m scripts.create_admin
```

- **Backend:** http://localhost:8000
- **Docs API:** http://localhost:8000/docs
- **Frontend:** http://localhost:3000

## Estrutura do projeto

```
├── backend/            # FastAPI com Clean Architecture
│   ├── domain/         # Entidades e regras de negócio
│   ├── application/    # Use cases
│   ├── infrastructure/ # Banco, storage, APIs externas
│   ├── interfaces/     # Routers FastAPI e schemas Pydantic
│   └── tests/
├── frontend/           # Next.js 15 (site público + /admin)
├── docker-compose.yml
└── .github/workflows/  # CI/CD
```

## Comandos úteis

```bash
# Backend: rodar testes
docker compose exec backend pytest

# Backend: criar nova migração
docker compose exec backend alembic revision --autogenerate -m "descricao"

# Frontend: instalar dependências
docker compose exec frontend npm install

# Frontend: rodar testes
docker compose exec frontend npm run test

# Reconstruir containers após mudanças no Dockerfile
docker compose up --build
```

## Variáveis de ambiente

Veja `.env.example` para a lista completa. As principais:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL |
| `SECRET_KEY` | Chave JWT (gere com `openssl rand -hex 32`) |
| `MERCADOPAGO_ACCESS_TOKEN` | Token da sua conta MP |
| `SMTP_*` | Credenciais de e-mail |
| `WHATSAPP_NUMBER` | Número no formato DDI+DDD+número |
