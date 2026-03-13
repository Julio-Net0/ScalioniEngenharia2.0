# Design — Site Scalioniengenharia 2.0

## Arquitetura Geral

Monorepo com separação clara entre backend (Python/FastAPI) e frontend (Next.js 15).

```
ScalioniEngenharia2.0/
├── backend/       ← FastAPI + Clean Architecture (domain / application / infrastructure / interfaces)
├── frontend/      ← Next.js 15 App Router (site público SSG/ISR + /admin CSR)
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, Uvicorn, SQLAlchemy 2.0, Alembic, Pydantic v2, Pytest |
| Frontend | TypeScript, Next.js 15 App Router, React, TailwindCSS, Shadcn/UI, Vitest |
| Banco | PostgreSQL 16 |
| Storage | Volume Docker (dev) / MinIO (prod) |
| Pagamento | Mercado Pago SDK Python |
| Email | SMTP / SendGrid |
| Infra | Docker Compose + GitHub Actions |

## Modelo de Dados

| Entidade | Campos principais |
|---|---|
| `Projeto` | id (UUID), slug, titulo, descricao, categoria, imagem_capa, imagens[], ano, ativo |
| `Planta` | id (UUID), slug, titulo, descricao, preco (Decimal), imagens[], terreno_minimo_m2, arquivo_path, ativo |
| `Pedido` | id (UUID), planta_id, email, nome, telefone, valor, status, mp_payment_id, download_token, expires_at |
| `AdminUser` | id (UUID), nome, email, senha_hash, ativo |
| `MensagemContato` | id (UUID), nome, email, telefone, mensagem, lida (bool), criada_em |

**Status do Pedido:** `pendente` → `pago` / `rejected` / `cancelled` / `in_process`

## Páginas Next.js

| Rota | Estratégia | Descrição |
|---|---|---|
| `/` | SSG | Hero, portfólio destaque, CTA loja, serviços, contato |
| `/portfolio` | SSG | Grade masonry — hover overlay dourado |
| `/portfolio/[slug]` | ISR | Galeria, descrição, CTA |
| `/loja` | SSG | Grade de plantas |
| `/loja/[slug]` | ISR | Renders, specs, modal checkout → MP |
| `/servicos` | SSG | Residencial, Comercial, Consultoria, Regularização |
| `/contato` | SSG | Formulário + mapa |
| `/admin/*` | CSR | Painel admin protegido por JWT |

## Fluxo de Leads

```
POST /api/contato (nome, email, telefone, mensagem)
  ├── Salva MensagemContato no banco
  ├── E-mail de confirmação ao cliente (SMTP/SendGrid)
  └── Notificação ao admin (SMTP/SendGrid) com link ao painel
```

## Fluxo de Pagamento

```
Checkout /loja/[slug]
  └── POST /api/pedidos → cria Pedido (pendente) + preferência MP → init_point
          │
          └── Redirecionamento para Checkout Mercado Pago

POST /api/webhooks/mercadopago
  ├── [1] Validar HMAC-SHA256 (x-signature)
  ├── [2] GET /v1/payments/{id} na API MP (double-check)
  ├── [3] Verificar idempotência por mp_payment_id
  └── Despachar por status:
        ├── approved  → gerar token UUID (72h) + e-mail download ao cliente + status "pago"
        ├── rejected/cancelled → e-mail ao cliente (link tentar novamente) + atualizar status
        └── outros    → atualizar status, aguardar próxima notificação

GET /api/download/{token}
  └── Validar token (existência + expiração + status "pago") → FileResponse / MinIO signed URL
```

## Segurança

- **Webhook:** HMAC-SHA256 no header `x-signature` + double-check via API MP
- **Idempotência:** verificação por `mp_payment_id` antes de processar
- **Admin:** JWT com expiração + refresh token
- **Download token:** UUID v4, 72h, reutilizável dentro do prazo
- **Segredos:** variáveis de ambiente (`.env`) — nunca commitadas

## Visual

- Fundo: `#0A0A0A` (dark luxury)
- Accent: `#C9A55A` (dourado/cobre)
- Tipografia bold, imagens full-screen, hover overlay dourado
