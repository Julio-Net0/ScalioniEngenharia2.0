# Tasks — Site Scalioniengenharia 2.0

> Tasks atômicas (máx. 2h cada), agrupadas por camada: banco → backend → frontend → infra.
> Testes incluídos como task separada por feature.

---

## Fase 0 — Fundação do Projeto

- [ ] `task-001` Criar `backend/main.py` — entrypoint FastAPI com CORS, routers e healthcheck
- [ ] `task-002` Criar `backend/core/config.py` — Settings com pydantic-settings (lê `.env`)
- [ ] `task-003` Criar `backend/core/security.py` — hash de senha (bcrypt) + JWT (criar/validar)
- [ ] `task-004` Criar `README.md` — visão geral, pré-requisitos, como rodar local, como fazer deploy
- [ ] `task-005` Criar `.github/workflows/ci.yml` — lint + testes no PR, build Docker no push para main

---

## Fase 1 — Banco de Dados

- [ ] `task-006` Criar `backend/infrastructure/database/session.py` — engine SQLAlchemy + get_db dependency
- [ ] `task-007` Criar `backend/infrastructure/database/models.py` — models: Projeto, Planta, Pedido, AdminUser, MensagemContato
- [ ] `task-008` Inicializar Alembic — `alembic init` + `alembic.ini` + `env.py` configurado
- [ ] `task-009` Criar migration inicial — tabelas completas com índices e constraints
- [ ] `task-010` Teste: verificar que migration roda limpa (`alembic upgrade head`), downgrade retorna ao estado anterior (`alembic downgrade -1`) e que todas as constraints (FK, CHECK, UNIQUE) estão presentes no schema

---

## Fase 2 — Backend: Entidades de Domínio

- [ ] `task-011` Criar `backend/domain/entities/projeto.py`
- [ ] `task-012` Criar `backend/domain/entities/planta.py`
- [ ] `task-013` Criar `backend/domain/entities/pedido.py` — incluir enum de status
- [ ] `task-014` Criar `backend/domain/entities/admin_user.py`
- [ ] `task-015` Criar `backend/domain/entities/mensagem_contato.py`

---

## Fase 3 — Backend: CRUD Projetos e Plantas

- [ ] `task-016` Criar schemas Pydantic para Projeto (create, update, response)
- [ ] `task-017` Criar repositório `ProjectRepository` (SQLAlchemy)
- [ ] `task-018` Criar router `/api/projetos` — GET lista, GET slug, POST, PUT, DELETE (admin)
- [ ] `task-019` Teste (critérios): GET `/api/projetos` retorna `200` com lista; POST sem `slug` retorna `422`; GET por slug inexistente retorna `404`; DELETE sem JWT retorna `401`; POST com slug duplicado retorna `422`
- [ ] `task-020` Criar schemas Pydantic para Planta (create, update, response)
- [ ] `task-021` Criar repositório `PlantaRepository` (SQLAlchemy)
- [ ] `task-022` Criar router `/api/plantas` — GET lista, GET slug, POST, PUT, DELETE (admin)
- [ ] `task-023` Criar endpoint `POST /api/upload` — armazenar arquivo no volume/MinIO, retornar path
- [ ] `task-024` Teste (critérios): POST planta com `preco=-1` retorna `422`; GET planta inativa via `/api/plantas` não aparece na listagem pública; upload retorna path válido; DELETE planta com pedido ativo retorna `409` (RESTRICT FK)

---

## Fase 4 — Backend: Pagamento e Download

- [ ] `task-025` Configurar SDK Mercado Pago — credenciais via `config.py`
- [ ] `task-026` Criar `POST /api/pedidos` — criar Pedido (`pendente`) + preference MP + retornar `init_point`
- [ ] `task-027` Criar `POST /api/webhooks/mercadopago` — validar HMAC-SHA256 (`x-signature`)
- [ ] `task-028` Adicionar double-check: consultar `GET /v1/payments/{id}` na API MP antes de agir
- [ ] `task-029` Adicionar idempotência: verificar `mp_payment_id` antes de processar
- [ ] `task-030` Lógica `approved`: gerar `download_token` UUID (72h) + e-mail ao cliente
- [ ] `task-031` Lógica `rejected`/`cancelled`: atualizar status + e-mail ao cliente (link tentar novamente)
- [ ] `task-032` Criar `GET /api/download/{token}` — validar token + expiração + retornar arquivo
- [ ] `task-033` Teste (critérios): webhook com HMAC inválido → `401`; webhook `approved` processado 2x → apenas 1 e-mail enviado (idempotência); token expirado → `410`; token de pedido `pendente` → `403`; double-check MP retorna `pending` quando webhook diz `approved` → status atualizado para `in_process`, não `pago`

---

## Fase 5 — Backend: Contato, Admin Auth e E-mails

- [ ] `task-034` Criar `POST /api/contato` — salvar MensagemContato + enviar 2 e-mails (cliente + admin)
- [ ] `task-035` Criar serviço de e-mail `email_service.py` — abstração SMTP/SendGrid
- [ ] `task-036` Criar templates de e-mail: confirmação de lead, download aprovado, falha de pagamento
- [ ] `task-037` Criar `POST /api/admin/login` — autenticar AdminUser, retornar JWT
- [ ] `task-038` Criar dependency `get_current_admin` — validar JWT em rotas protegidas
- [ ] `task-039` Criar `GET /api/admin/mensagens` — listar com filtro lida/não lida + badge count
- [ ] `task-040` Criar `PATCH /api/admin/mensagens/{id}/lida` — marcar como lida
- [ ] `task-041` Criar `GET /api/admin/pedidos` + `GET /api/admin/pedidos/{id}` — listar e detalhar
- [ ] `task-042` Criar `POST /api/admin/pedidos/{id}/reenviar-email` — reenviar e-mail de download
- [ ] `task-043` Teste (critérios): POST `/api/contato` com e-mail inválido → `422`; com mensagem >2000 chars → `422`; válido → `201` + MensagemContato salva no banco + 2 e-mails enfileirados; SMTP offline → `201` (banco salvo, erro logado)
- [ ] `task-044` Teste (critérios): POST `/api/admin/login` com senha errada → `401`; com credenciais corretas → `200` + JWT; rota protegida sem token → `401`; com token expirado → `401 "Token expirado"`; com token de outra assinatura → `401`

---

## Fase 6 — Frontend: Setup e Site Público

- [ ] `task-045` Inicializar Next.js 15 App Router + TailwindCSS + Shadcn/UI + TypeScript strict; instalar `lucide-react`; configurar `tsconfig.json` com `"strict": true` e `"noImplicitAny": true`; adicionar `public/logo.svg` placeholder
- [ ] `task-046` Configurar `openapi-typescript` para gerar tipos a partir do OpenAPI do FastAPI
- [ ] `task-047` Criar design system — tokens de cor (`--background: #0A0A0A`, `--accent: #C9A55A`) no Tailwind config; instalar e configurar shadcn/ui (`Button`, `Card`, `Form`, `Input`, `Textarea`, `Dialog`, `AlertDialog`, `Alert`, `Badge`, `Table`, `Skeleton`, `Carousel`, `Sheet`, `Tabs`, `Progress`, `Toaster`)
- [ ] `task-048` Criar layout raiz — Navbar flutuante + footer + botão WhatsApp flutuante
- [ ] `task-049` Criar página `/` — hero full-screen, portfólio destaque, CTA loja, serviços, formulário de contato
- [ ] `task-050` Criar página `/portfolio` — grade masonry com hover overlay dourado (SSG)
- [ ] `task-051` Criar página `/portfolio/[slug]` — galeria, descrição, CTA (ISR)
- [ ] `task-052` Criar página `/loja` — grade de plantas com preço e terreno mínimo (SSG)
- [ ] `task-053` Criar página `/loja/[slug]` — renders, specs, modal checkout (ISR)
- [ ] `task-054` Integrar Mercado Pago: modal de checkout → `POST /api/pedidos` → redirect `init_point`
- [ ] `task-055` Criar página `/servicos` — Residencial, Comercial, Consultoria, Regularização (SSG)
- [ ] `task-056` Criar página `/contato` — formulário + mapa embed (SSG)
- [ ] `task-057` Criar página de sucesso/erro de pagamento (retorno do MP)
- [ ] `task-058` Teste Vitest (critérios): campo e-mail vazio → `<FormMessage>` visível antes de qualquer fetch; submit com dados válidos → botão desabilitado + `<Loader2 animate-spin>` visível; API retorna `201` → `<Alert variant=default>` com sucesso + form resetado; API retorna `500` → `<Alert variant=destructive>` + botão reabilitado + dados preservados

---

## Fase 7 — Frontend: Painel Admin

- [ ] `task-059` Criar layout `/admin` — sidebar + header com logout, protegido por JWT
- [ ] `task-060` Criar `/admin/login` — formulário de autenticação
- [ ] `task-061` Criar middleware Next.js para proteger rotas `/admin/*` (verificar JWT)
- [ ] `task-062` Criar `/admin/projetos` — listagem + criação + edição + exclusão
- [ ] `task-063` Criar `/admin/plantas` — listagem + criação + edição + upload de arquivo
- [ ] `task-064` Criar `/admin/pedidos` — listagem com status, filtros, detalhe + reenvio de e-mail
- [ ] `task-065` Criar `/admin/mensagens` — listagem com badge "nova", marcar como lida, link WhatsApp
- [ ] `task-066` Criar `/admin/usuarios` — listar e criar AdminUsers
- [ ] `task-067` Teste Vitest (critérios): acesso a `/admin/projetos` sem JWT → middleware redireciona para `/admin/login`; expiração de JWT durante listagem → intercepta `401` da API e redireciona com mensagem; clique em "Excluir" → `<AlertDialog>` abre antes de qualquer DELETE; confirmação da exclusão → `useToast` exibe confirmação

---

## Fase 8 — Infra e Deploy

- [ ] `task-068` Configurar `docker-compose.prod.yml` — Traefik + HTTPS Let's Encrypt + MinIO
- [ ] `task-069` Criar script de seed — AdminUser padrão + projetos/plantas de demonstração
- [ ] `task-070` Configurar GitHub Actions CI — lint Python (ruff) + testes Pytest + build Docker
- [ ] `task-071` Configurar GitHub Actions CD — deploy automático em push para `main`
- [ ] `task-072` Teste E2E: fluxo completo — visitar loja → comprar → receber e-mail → baixar arquivo
- [ ] `task-073` Checklist de segurança pré-deploy — HTTPS, CORS restrito, secrets em env, rate limit no webhook
