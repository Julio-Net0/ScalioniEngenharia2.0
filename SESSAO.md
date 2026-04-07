# Contexto da Sessão — Scalioniengenharia 2.0
**Última atualização:** 2026-04-07 17:52

---

## ⏸️ Estado atual

- **Fase:** Backend 100% funcional e testado — Docker rodando, migrations aplicadas, banco populado com seed, testes passando 24/24
- **Próximo passo:** Frontend (Next.js 15) ou continuar com `/opsx-apply` quando telas Stitch estiverem prontas

---

## ✅ O que foi feito nesta sessão (2026-04-07)

| O que | Resultado |
|---|---|
| `docker compose up -d --build` | Subiu PostgreSQL + Backend |
| Testes unitários via Docker | 21/24 passando inicialmente |
| Corrigido `conftest.py` | Adicionada fixture `apply_migrations` (scope=session) que roda `alembic upgrade head` antes de todos os testes e `downgrade base` ao final |
| Todos os testes | **24/24 passando** ✅ |
| Adicionado pgAdmin ao `docker-compose.yml` | Acessível em http://localhost:5050 |
| `alembic upgrade head` | Tabelas criadas no banco |
| `python -m backend.scripts.seed` | Banco populado com admin + 2 projetos + 2 plantas |
| Corrigido `requirements.txt` | Adicionado `bcrypt<4.0` (incompatibilidade com passlib) |

### Credenciais do sistema

| Serviço | URL | Usuário | Senha |
|---|---|---|---|
| Swagger API | http://localhost:8000/docs | — | — |
| pgAdmin | http://localhost:5050 | admin@scalioni.com | admin |
| Admin API | POST /api/admin/login | admin@scalioni.com | admin123 |
| PostgreSQL | localhost:5432 | scalioni | senha-segura |

---


## O que foi decidido (Brainstorming + Design)

### Produto

- **Site institucional + e-commerce** para escritório de engenharia
- **Portfólio**: grid de projetos, hover revela título, clique → página do projeto
- **Loja de plantas prontas**: produtos digitais com galeria de renders, specs técnicas (m², suítes, vagas, NBR), compra sem cadastro, entrega por link de download por e-mail (token UUID com 72h)
- **CTA principal**: formulário de contato + botão flutuante WhatsApp
- **Pagamento**: Mercado Pago (PIX + cartão com parcelamento)
- **Painel Admin completo**: CRUD de projetos, plantas, pedidos, mensagens e usuários admin
- **Visual**: dark luxury — fundo `#0A0A0A`, accent dourado/cobre `#C9A55A`, tipografia Playfair Display + Outfit

### Arquitetura (Monorepo)

```
ScalioniEngenharia2.0/
├── backend/       ← FastAPI + Clean Architecture
├── frontend/      ← Next.js 15 App Router (site público SSG/ISR + /admin CSR)
├── docs/stitch/   ← Telas de referência visual (screen.png + code.html)
├── openspec/      ← Specs anti-alucinação
├── docker-compose.yml
└── docker-compose.prod.yml
```

### Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0 async (asyncpg), Alembic, Pydantic v2, Pytest |
| Frontend | TypeScript, Next.js 15 (App Router), TailwindCSS, shadcn/ui, Lucide React, Vitest |
| Banco | PostgreSQL 16 |
| Storage | Volume Docker (dev) / MinIO (prod) |
| Pagamento | Mercado Pago SDK Python |
| Email | SMTP / SendGrid |
| Infra | Docker + Docker Compose + Traefik + GitHub Actions |

### Páginas Next.js

| Rota | Tipo | Stitch ref |
|---|---|---|
| `/` | SSG | `home_page/` |
| `/portfolio` | SSG | `portf_lio/` |
| `/portfolio/[slug]` | ISR | `detalhes_do_projeto/` |
| `/loja` | SSG | `loja_de_plantas/` |
| `/loja/[slug]` | ISR | `detalhes_da_planta/` |
| `/servicos` | SSG | `servi_os/` |
| `/contato` | SSG | `contato/` |
| `/pagamento/sucesso` | SSG | `pagamento_sucesso/` ← **criar no Stitch** |
| `/pagamento/falha` | SSG | `pagamento_falha/` ← **criar no Stitch** |
| `/admin` (login) | CSR | `admin_login/` ← **criar no Stitch** |
| `/admin` (dashboard) | CSR | `admin_dashboard/` |
| `/admin/projetos` | CSR | `admin_listagem_de_projetos/` |
| `/admin/plantas` | CSR | `admin_plantas/` ← **criar no Stitch** |
| `/admin/pedidos` | CSR | `admin_pedidos/` ← **criar no Stitch** |
| `/admin/mensagens` | CSR | `admin_mensagens/` ← **criar no Stitch** |
| `/admin/usuarios` | CSR | `admin_usuarios/` ← **criar no Stitch** |

### Decisões de Design Confirmadas

| Decisão | Escolha |
|---|---|
| Checkout | `<Dialog>` simples — nome + e-mail + telefone. **NÃO** usar stepper de 3 etapas |
| Dashboard admin | Simples — 4 cards KPI + 2 tabelas. **SEM** gráficos (recharts, chart.js) |
| Filtros portfólio | Client-side com `useState` — sem nova rota de API |
| Filtros loja | Client-side por faixa de m² — sem nova rota de API |
| CNPJ no checkout | ❌ Não usar — compra é anônima |
| Biblioteca de ícones | Lucide React — exclusivo. NUNCA emojis, react-icons, heroicons |
| Componentes UI | shadcn/ui — exclusivo. NUNCA criar do zero com Tailwind puro |

### Fluxo de Pagamento

- **Webhook `approved`:** Validar HMAC-SHA256 (`x-signature`) → double-check `GET /v1/payments/{id}` → idempotência por `mp_payment_id` → gerar token UUID (72h) → e-mail com link
- **Webhook `rejected`/`cancelled`:** Marcar status + e-mail com link para tentar novamente
- **Download token:** UUID v4, 72h de validade

---

## Arquivos criados nesta sessão (2026-03-17)

| Arquivo | Conteúdo |
|---|---|
| `openspec/specs/api-contrato.md` | RFC 2119 + 21 cenários Dado/Quando/Então para todos os endpoints |
| `openspec/specs/frontend-comportamento.md` | Comportamento de UI com RFC 2119 e cenários detalhados |
| `openspec/specs/pagamento-webhook.md` | Máquina de estados, HMAC, double-check, idempotência, e-mails |
| `openspec/config.yaml` | Restrições negativas absolutas + versionamento de libs |
| `openspec/changes/site-scalioniengenharia/design.md` | DDL completo + mapa shadcn/ui + Server/Client + Telas Stitch |
| `openspec/changes/site-scalioniengenharia/tasks.md` | 73 tasks + critérios de aceitação específicos |
| `STITCH_UPDATE_PROMPTS.md` | Prompts para corrigir 10 telas + criar 7 novas no Stitch AI |

---

## O que está faltando implementar

### Antes de `/opsx-apply` (depende do usuário)

1. Atualizar 10 telas existentes no Stitch AI (usar `STITCH_UPDATE_PROMPTS.md`)
2. Criar 7 telas novas no Stitch AI (Telas A–G no mesmo arquivo)
3. Exportar `screen.png` + `code.html` para `docs/stitch/stitch/[pasta]/`
4. Atualizar referências no `design.md` com as novas imagens

### Implementação (fases 0–8 do tasks.md)

- **Fase 0** — Infra base: README, CI, docker-compose
- **Fase 1** — Backend fundação: FastAPI, SQLAlchemy, Alembic, models, config
- **Fase 2** — Backend CRUD: projetos, plantas, mensagens, admin auth
- **Fase 3** — Backend pagamento: Mercado Pago, webhook, download
- **Fase 4** — Backend testes: Pytest completo
- **Fase 5** — Frontend setup: Next.js 15, shadcn/ui, design system
- **Fase 6** — Frontend site público: 8 páginas
- **Fase 7** — Frontend admin: login, dashboard, 5 CRUDs
- **Fase 8** — Deploy: Docker prod, GitHub Actions, Traefik

---

## Como retomar

```bash
# Para implementar (quando telas Stitch estiverem prontas):
/opsx-apply

# Para continuar hardening/refinamento de specs:
# Abrir openspec/changes/site-scalioniengenharia/tasks.md
```

**Arquivo de prompts Stitch:** `STITCH_UPDATE_PROMPTS.md`  
**Referência visual:** `docs/stitch/stitch/` (10 telas existentes, 7 a criar)  
**Specs anti-alucinação:** `openspec/specs/` (3 arquivos) + `openspec/config.yaml`
