# Contexto da Sessão — Scalioniengenharia 2.0
**Última atualização:** 2026-03-13 13:44

---

## ⏸️ Estado atual (2026-03-13)

- **Fase:** Design 100% completo — pronto para `/opsx-apply`
- **Todos os specs OpenSpec criados:**

| Arquivo | Status |
|---|---|
| `openspec/changes/site-scalioniengenharia/.openspec.yaml` | ✅ Criado |
| `openspec/changes/site-scalioniengenharia/proposal.md` | ✅ Criado |
| `openspec/changes/site-scalioniengenharia/design.md` | ✅ Criado |
| `openspec/changes/site-scalioniengenharia/tasks.md` | ✅ 73 tasks em 8 fases |
| `openspec/changes/site-scalioniengenharia/design-leads-pagamento.md` | ✅ Design detalhado |

- **⚠️ Nota infra:** `openspec` CLI não instalado (npm indisponível no ambiente). O `/opsx-apply` funciona sem o CLI — lê os arquivos diretamente.
- **Próximo passo:** dizer `/opsx-apply` para iniciar a implementação

---

## O que foi decidido (Brainstorming + Design)

### Produto

- **Site institucional + e-commerce** para escritório de engenharia
- **Portfólio**: grid de projetos, hover revela título, clique → página do projeto
- **Loja de plantas prontas**: produtos digitais com galeria de renders (imagens estáticas), especificação de terreno mínimo, compra sem cadastro, entrega por link de download por e-mail (token UUID com 72h de expiração)
- **CTA principal**: formulário de contato + botão flutuante WhatsApp
- **Pagamento**: Mercado Pago (PIX + cartão com parcelamento)
- **Painel Admin completo**: CRUD de projetos, plantas, pedidos, mensagens e usuários admin
- **Visual**: dark luxury — fundo `#0A0A0A`, accent dourado/cobre `#C9A55A`, tipografia bold, imagens full-screen

### Arquitetura (Abordagem A — Monorepo)

```
ScalioniEngenharia2.0/
├── backend/       ← FastAPI + Clean Architecture
├── frontend/      ← Next.js 15 (site público + /admin integrado)
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/
```

### Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, Uvicorn, SQLAlchemy, Alembic, Pydantic v2, Pytest |
| Frontend | Node.js, TypeScript, Next.js 15 (App Router), React, TailwindCSS, Shadcn/UI, Vitest |
| Banco | PostgreSQL 16 |
| Storage | Volume Docker (dev) / MinIO (prod) |
| Pagamento | Mercado Pago SDK Python |
| Email | SMTP / SendGrid |
| Infra | Docker + Docker Compose + GitHub Actions |

### Modelo de Dados

| Entidade | Campos chave |
|---|---|
| Projeto | id, slug, titulo, descricao, categoria, imagem_capa, imagens[], ano, ativo |
| Planta | id, slug, titulo, descricao, preco, imagens[], terreno_minimo_m2, arquivo_path, ativo |
| Pedido | id, planta_id, email, nome, telefone, valor, status, mp_payment_id, download_token, expires_at |
| AdminUser | id, nome, email, senha_hash, ativo |
| MensagemContato | id, nome, email, telefone, mensagem, lida, criada_em |

### Páginas Next.js

| Rota | Render |
|---|---|
| `/` | SSG — hero, portfólio destaque, CTA loja, serviços, contato |
| `/portfolio` | SSG — grade masonry com hover overlay dourado |
| `/portfolio/[slug]` | ISR — galeria, descrição, CTA |
| `/loja` | SSG — grade plantas |
| `/loja/[slug]` | ISR — renders, specs, modal checkout → MP |
| `/servicos` | SSG — Residencial, Comercial, Consultoria, Regularização |
| `/contato` | SSG — formulário + mapa |
| `/admin/*` | CSR — painel admin protegido por JWT |

---

### Fluxo de Leads (Formulário de Contato)

- **Público-alvo:** Pessoa física (residencial) + pequeno empresário (comercial)
- **Campos:** Nome completo, E-mail, Telefone/WhatsApp, Mensagem
- **Ação ao enviar:** (1) Salva `MensagemContato` no banco → (2) E-mail de confirmação ao cliente → (3) Notificação ao admin
- **Painel admin:** listagem com badge "nova", marcar como lida, link WhatsApp pré-preenchido

### Segurança de Pagamento — Mercado Pago

- **Webhook `approved`:** Validar HMAC-SHA256 (`x-signature`) → double-check via `GET /v1/payments/{id}` → idempotência por `mp_payment_id` → gerar token UUID (72h) → e-mail com link → `status = "pago"`
- **Webhook `rejected`/`cancelled`:** Marcar status + e-mail ao cliente com link para tentar novamente
- **Outros status** (`in_process`, `pending`): apenas atualizar status, aguardar próxima notificação
- **Download token:** UUID v4, 72h, reutilizável dentro do prazo (YAGNI para uso único)
- **Design doc:** `openspec/changes/site-scalioniengenharia/design-leads-pagamento.md`

---

## O que já foi criado

### Arquivos do projeto (Fase 0 — parcial)

- [x] `.gitignore`
- [x] `.env.example` — todas as variáveis necessárias documentadas
- [ ] `README.md` — foi limpo pelo usuário (aguarda escrita final)
- [x] `docker-compose.yml` — dev (postgres + backend + frontend)
- [x] `docker-compose.prod.yml` — produção com Traefik + HTTPS Let's Encrypt
- [ ] `.github/workflows/ci.yml` — foi limpo pelo usuário (aguarda escrita final)

### Backend (Fase 1 — parcial)

- [x] `backend/pyproject.toml` — dependências completas com uv
- [x] `backend/Dockerfile` — multi-stage (dev + prod)

### OpenSpec

- [x] `openspec/config.yaml` — contexto do projeto configurado
- [x] `openspec/changes/site-scalioniengenharia/proposal.md`
- [x] `openspec/changes/site-scalioniengenharia/design.md`
- [x] `openspec/changes/site-scalioniengenharia/tasks.md` — 40+ tasks em 8 fases

---

## O que falta implementar

### Fase 1 — Backend: Fundação (continuar)
- `backend/main.py` — entrypoint FastAPI
- `backend/core/config.py` — settings com pydantic-settings
- `backend/domain/entities/` — entidades de domínio
- `backend/infrastructure/database/` — models SQLAlchemy + session + Alembic
- `backend/interfaces/` — routers + schemas
- `backend/tests/conftest.py`

### Fases 2–4 — Backend: Features (CRUD, pagamento, contato)
### Fases 5–7 — Frontend: Setup, site público, painel admin
### Fase 8 — Infra e deploy final

---

## Como retomar

Para continuar a implementação, basta dizer:
```
/opsx-apply
```

O arquivo `openspec/changes/site-scalioniengenharia/tasks.md` contém todas as tasks com status atualizado.
