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

## Modelo de Dados — DDL PostgreSQL

```sql
-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum
CREATE TYPE pedido_status AS ENUM (
  'pendente', 'pago', 'rejected', 'cancelled', 'in_process'
);

-- Projetos
CREATE TABLE projetos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  titulo        TEXT NOT NULL,
  descricao     TEXT NOT NULL,
  categoria     TEXT NOT NULL,
  imagem_capa   TEXT NOT NULL,
  imagens       TEXT[] NOT NULL DEFAULT '{}',
  ano           SMALLINT NOT NULL CHECK (ano >= 1900 AND ano <= 2100),
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projetos_ativo ON projetos (ativo);
CREATE INDEX idx_projetos_slug  ON projetos (slug);

-- Plantas
CREATE TABLE plantas (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  titulo              TEXT NOT NULL,
  descricao           TEXT NOT NULL,
  preco               NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
  imagens             TEXT[] NOT NULL DEFAULT '{}',
  terreno_minimo_m2   NUMERIC(8, 2),
  arquivo_path        TEXT,
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_plantas_ativo ON plantas (ativo);
CREATE INDEX idx_plantas_slug  ON plantas (slug);

-- Pedidos
CREATE TABLE pedidos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planta_id         UUID NOT NULL REFERENCES plantas(id) ON DELETE RESTRICT,
  email             TEXT NOT NULL,
  nome              TEXT NOT NULL,
  telefone          TEXT,
  valor             NUMERIC(10, 2) NOT NULL,
  status            pedido_status NOT NULL DEFAULT 'pendente',
  mp_payment_id     TEXT UNIQUE,          -- idempotência
  download_token    UUID UNIQUE,
  expires_at        TIMESTAMPTZ,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pedidos_status         ON pedidos (status);
CREATE INDEX idx_pedidos_email          ON pedidos (email);
CREATE INDEX idx_pedidos_mp_payment_id  ON pedidos (mp_payment_id);
CREATE INDEX idx_pedidos_download_token ON pedidos (download_token);

-- Admin Users
CREATE TABLE admin_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  senha_hash  TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mensagens de Contato
CREATE TABLE mensagens_contato (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  telefone   TEXT,
  mensagem   TEXT NOT NULL CHECK (length(mensagem) <= 2000),
  lida       BOOLEAN NOT NULL DEFAULT FALSE,
  criada_em  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_mensagens_lida ON mensagens_contato (lida);
```

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

---

## Contratos TypeSafe (SQLAlchemy → Pydantic)

Cada entidade expõe **três schemas Pydantic v2** derivados do modelo SQLAlchemy, seguindo o padrão `Base / Create / Response`.

### Mapeamento por entidade

#### `Projeto`

| SQLAlchemy (model) | Tipo Python | Pydantic `ProjetoCreate` | Pydantic `ProjetoResponse` |
|---|---|---|---|
| `id` | `UUID` | ❌ gerado no backend | ✅ |
| `slug` | `str` | ✅ obrigatório | ✅ |
| `titulo` | `str` | ✅ obrigatório | ✅ |
| `descricao` | `str` | ✅ obrigatório | ✅ |
| `categoria` | `str` | ✅ obrigatório | ✅ |
| `imagem_capa` | `str` | ✅ obrigatório | ✅ |
| `imagens` | `list[str]` | ✅ default `[]` | ✅ |
| `ano` | `int` | ✅ obrigatório | ✅ |
| `ativo` | `bool` | ✅ default `True` | ✅ |
| `criado_em` | `datetime` | ❌ auto | ✅ |

#### `Planta`

| SQLAlchemy (model) | Tipo Python | Pydantic `PlantaCreate` | Pydantic `PlantaResponse` |
|---|---|---|---|
| `id` | `UUID` | ❌ gerado no backend | ✅ |
| `slug` | `str` | ✅ | ✅ |
| `titulo` | `str` | ✅ | ✅ |
| `descricao` | `str` | ✅ | ✅ |
| `preco` | `Decimal` | ✅ `ge=0` | ✅ serializável como `str` |
| `imagens` | `list[str]` | ✅ default `[]` | ✅ |
| `terreno_minimo_m2` | `float \| None` | ✅ opcional | ✅ |
| `arquivo_path` | `str \| None` | ✅ opcional | ✅ |
| `ativo` | `bool` | ✅ default `True` | ✅ |

#### `Pedido`

| SQLAlchemy (model) | Tipo Python | Pydantic `PedidoCreate` | Pydantic `PedidoResponse` |
|---|---|---|---|
| `id` | `UUID` | ❌ gerado no backend | ✅ |
| `planta_id` | `UUID` | ✅ FK obrigatória | ✅ |
| `email` | `EmailStr` | ✅ | ✅ |
| `nome` | `str` | ✅ | ✅ |
| `telefone` | `str \| None` | ✅ opcional | ✅ |
| `valor` | `Decimal` | ❌ copiado da Planta | ✅ |
| `status` | `PedidoStatus` (Enum) | ❌ default `pendente` | ✅ |
| `mp_payment_id` | `str \| None` | ❌ via webhook | ✅ |
| `download_token` | `UUID \| None` | ❌ gerado após `approved` | ✅ |
| `expires_at` | `datetime \| None` | ❌ gerado após `approved` | ✅ |

#### `MensagemContato`

| SQLAlchemy (model) | Tipo Python | Pydantic `ContatoCreate` | Pydantic `ContatoResponse` |
|---|---|---|---|
| `id` | `UUID` | ❌ gerado | ✅ |
| `nome` | `str` | ✅ | ✅ |
| `email` | `EmailStr` | ✅ | ✅ |
| `telefone` | `str \| None` | ✅ opcional | ✅ |
| `mensagem` | `str` | ✅ `max_length=2000` | ✅ |
| `lida` | `bool` | ❌ default `False` | ✅ |
| `criada_em` | `datetime` | ❌ auto | ✅ |

### Convenções obrigatórias

```python
# Todos os schemas herdam de BaseModel com from_attributes=True
class ProjetoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# Decimal sempre serializado como string no JSON
preco: Annotated[Decimal, Field(ge=0), PlainSerializer(str)]

# Enum de status do Pedido
class PedidoStatus(str, Enum):
    pendente   = "pendente"
    pago       = "pago"
    rejected   = "rejected"
    cancelled  = "cancelled"
    in_process = "in_process"
```

---

## Topologia Docker

### Serviços (`docker-compose.yml` — desenvolvimento)

```yaml
services:

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB:       ${POSTGRES_DB}
      POSTGRES_USER:     ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"          # acessível pelo host em dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      target: dev             # multi-stage: instala dev-deps
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    environment:
      DATABASE_URL:          postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      SECRET_KEY:            ${SECRET_KEY}
      MP_ACCESS_TOKEN:       ${MP_ACCESS_TOKEN}
      MP_WEBHOOK_SECRET:     ${MP_WEBHOOK_SECRET}
      SMTP_HOST:             ${SMTP_HOST}
      SMTP_PORT:             ${SMTP_PORT}
      SMTP_USER:             ${SMTP_USER}
      SMTP_PASSWORD:         ${SMTP_PASSWORD}
      FRONTEND_URL:          http://localhost:3000
    volumes:
      - ./backend:/app        # hot-reload
      - uploads_data:/app/uploads
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      target: dev
    command: npm run dev
    environment:
      NEXT_PUBLIC_API_URL:  http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules   # evita override do volume
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  uploads_data:
```

### Rede interna

```
┌─────────────────────────────────────┐
│           docker network (bridge)   │
│                                     │
│  [frontend :3000] ──► [backend :8000] ──► [postgres :5432] │
│                                     │
│  Host acessa: localhost:3000        │
│               localhost:8000/docs   │
│               localhost:5432 (pg)   │
└─────────────────────────────────────┘
```

### Regras de ouro para o `docker-compose.yml`

| Regra | Motivo |
|---|---|
| Usar `depends_on: condition: service_healthy` para `backend → postgres` | Evita `Connection refused` na inicialização |
| Volume nomeado para `postgres_data` e `uploads_data` | Dados persistem entre `down/up` |
| Variáveis via `.env` (nunca hardcoded) | Segurança + flexibilidade |
| `target: dev` no `build` para hot-reload | Diferencia do stage de produção |
| Backend usa `asyncpg` como driver | Compatível com SQLAlchemy 2.0 async |
| Network default (bridge) é suficiente em dev | Simplifica configuração |

### Para produção (`docker-compose.prod.yml`)

Adicionar:
- `traefik` como reverse proxy + TLS automático (Let's Encrypt)
- `backend target: prod` (sem dev-deps, sem `--reload`)
- `frontend` rodando `next build && next start`
- `postgres` sem `ports` expostas (acesso apenas interno)
- `minio` substituindo volume local para `uploads_data`

```yaml
# Exemplo do serviço traefik (prod)
  traefik:
    image: traefik:v3
    command:
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
```

---

## Mapa de Componentes shadcn/ui

> **Regra:** NUNCA criar componentes de UI do zero com Tailwind puro.
> Sempre usar shadcn/ui como base. Ícones sempre via **Lucide React**.

### Site Público

| Página / Feature | Componentes shadcn/ui | Ícones Lucide |
|---|---|---|
| Layout global (Navbar + Footer) | `NavigationMenu`, `Sheet` (mobile menu) | `Menu`, `X`, `Phone` |
| Botão WhatsApp flutuante | `Button` (variant=ghost, rounded-full) | `MessageCircle` |
| `/` — Hero | `Button` (CTA principal) | `ArrowRight`, `ChevronDown` |
| `/portfolio` — Grade | `Card`, `CardContent` | `Eye` (hover) |
| `/portfolio/[slug]` — Galeria | `Carousel`, `CarouselContent`, `CarouselItem` | `ChevronLeft`, `ChevronRight` |
| `/loja` — Grade plantas | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Badge` (preço) | `Home`, `Maximize2` |
| `/loja/[slug]` — Detalhe | `Carousel`, `Tabs`, `TabsContent`, `Button` | `Download`, `ShoppingCart` |
| `Dialog` de checkout | `Dialog`, `DialogContent`, `DialogHeader`, `Form`, `FormField`, `Input`, `Label`, `Button` | `CreditCard`, `Loader2` |
| `/contato` — Formulário | `Form`, `FormField`, `FormMessage`, `Input`, `Textarea`, `Label`, `Button`, `Alert` | `Send`, `Loader2`, `CheckCircle`, `AlertCircle` |
| `/pagamento/sucesso` | `Alert` (variant=default) | `CheckCircle2` |
| `/pagamento/falha` | `Alert` (variant=destructive), `Button` | `XCircle`, `RefreshCw` |
| Feedback de submissão | `Alert` (success/destructive), `useToast` + `Toaster` | — |

### Painel Admin

| Página / Feature | Componentes shadcn/ui | Ícones Lucide |
|---|---|---|
| Layout admin (sidebar) | `Sheet` (mobile), `Separator`, `ScrollArea` | `LayoutDashboard`, `Package`, `FileText`, `MessageSquare`, `ShoppingBag`, `Users`, `LogOut` |
| `/admin/login` | `Card`, `CardContent`, `Form`, `Input`, `Label`, `Button` | `Lock`, `Loader2` |
| Badge mensagens não lidas | `Badge` (variant=destructive) | — |
| Listagens (todos os CRUDs) | `Table`, `TableHeader`, `TableRow`, `TableCell`, `TableBody`, `Skeleton` (loading) | `MoreHorizontal`, `Eye`, `Pencil`, `Trash2` |
| Formulários CRUD | `Form`, `FormField`, `FormMessage`, `Input`, `Textarea`, `Switch`, `Label`, `Button` | `Save`, `Loader2` |
| Exclusão (confirmação) | `AlertDialog`, `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel` | `AlertTriangle` |
| Upload de arquivo | `Input` (type=file), `Button`, `Progress` | `Upload`, `Loader2` |
| Detalhe de pedido | `Card`, `CardContent`, `Badge` (status), `Button` (reenviar e-mail) | `Mail`, `ExternalLink` |
| Notificações de ação | `useToast` + `Toaster` | `CheckCircle`, `AlertCircle` |

---

## Server vs Client Components (Next.js App Router)

> **Regra:** Por padrão, todos os componentes são **Server Components**.
> Adicionar `'use client'` SOMENTE quando necessário (interatividade, hooks, browser APIs).

### Server Components (sem `'use client'`)

| Arquivo | Motivo |
|---|---|
| `app/page.tsx` | SSG — sem interatividade, dados estáticos |
| `app/portfolio/page.tsx` | SSG — grade estática |
| `app/portfolio/[slug]/page.tsx` | ISR — page fetches data server-side |
| `app/loja/page.tsx` | SSG — lista plantas |
| `app/loja/[slug]/page.tsx` | ISR — dados da planta server-side |
| `app/servicos/page.tsx` | SSG — sem interatividade |
| `app/contato/page.tsx` | SSG — layout da página, só o form é client |
| `app/admin/layout.tsx` | Layout — sidebar estático + slot |
| `app/admin/projetos/page.tsx` | Busca lista server-side |
| `app/admin/plantas/page.tsx` | Busca lista server-side |
| `app/admin/pedidos/page.tsx` | Busca lista server-side |
| `app/admin/mensagens/page.tsx` | Busca lista server-side |
| `components/ui/*` (shadcn primitivos) | Shadcn pode ser server quando sem estado |

### Client Components (`'use client'` obrigatório)

| Arquivo | Motivo |
|---|---|
| `components/contato/ContatoForm.tsx` | `react-hook-form`, `useState`, `useToast` |
| `components/loja/CheckoutDialog.tsx` | `Dialog` com estado, form, `window.location` |
| `components/layout/Navbar.tsx` | `useState` para menu mobile, `usePathname` |
| `components/layout/BotaoWhatsApp.tsx` | `useState` para animação hover |
| `components/portfolio/GaleriaCarousel.tsx` | `Carousel` com estado de scroll |
| `app/admin/login/page.tsx` | Form de login com estado, JWT storage |
| `app/admin/projetos/ProjetoForm.tsx` | Form controlado, upload de imagem |
| `app/admin/plantas/PlantaForm.tsx` | Form controlado, upload de arquivo/imagem |
| `app/admin/mensagens/MensagemItem.tsx` | `useState` (marcar lida) |
| `components/shared/DataTable.tsx` | Sorting/filtering client-side com estado |
| `middleware.ts` | Executa em Edge Runtime — verifica JWT |

---

## Ícones — Biblioteca Oficial

- **Biblioteca:** [`lucide-react`](https://lucide.dev/) — instalada via `npm install lucide-react`
- **NUNCA usar emojis como ícones**
- **NUNCA usar `react-icons` ou `heroicons`** — somente Lucide
- Uso: `import { NomeDoIcone } from 'lucide-react'`
- Tamanho padrão: `size={16}` inline, `size={20}` em botões, `size={24}` em headings
- Logo da empresa: `public/logo.svg` — importada como `<Image>` Next.js — NUNCA substituir por texto ou emoji

---

## Design Visual — Telas de Referência (Stitch)

> Cada rota tem uma tela de referência visual em `docs/stitch/stitch/`.
> A IA MUST usar estas telas como guia visual exclusivo — MUST NOT inventar layouts não presentes aqui.
> Estilo global: fundo `#0A0A0A`, accent dourado `#C9A55A`, tipografia bold sans-serif.

### Site Público

#### `/` — Home Page
![Home Page](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/home_page/screen.png)

**O que implementar (conforme tela):**
- Navbar flutuante com logo à esquerda + links + botão "Fale Conosco" dourado
- Hero full-screen com imagem de fundo, badge "Excelência em Engenharia", headline em 2 cores (branco + dourado), 2 CTAs ("Ver Projetos" e "Solicitar Orçamento")
- Barra de estatísticas: 4 números com labels (150+ projetos, 15+ anos, etc.)
- Seção portfólio com grade assimétrica (destaque grande à esquerda + 3 miniaturas)
- Seção "Nossas Soluções" com 4 cards de serviço com ícone Lucide + título + descrição + "Saiba mais →"
- Seção CTA da loja com texto + preço "A partir de R$ 990,00" + botão "Acessar a Loja"
- Footer com logo, descrição, links úteis e newsletter

---

#### `/portfolio` — Portfólio Completo
![Portfólio](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/portf_lio/screen.png)

**O que implementar (conforme tela):**
- Hero com imagem de fundo dark + título "Portfólio Completo" centralizado
- **Filtros por categoria** (pills/chips): Todos, Residencial Luxo, Corporativo, Interiores, Restauração, Urbanismo
  - Componente: `<Button variant="outline">` para inativo, `<Button>` para ativo (shadcn)
  - Filtro acontece **client-side** com `useState` — não requer nova requisição API
- Grade masonry 3 colunas com `<Card>` — mostra: imagem, badge de categoria, título, ano + cidade
- Contador de projetos e estatísticas na lateral esquerda (25+ anos, 400 obras, 15 prêmios)
- Botão "Carregar Mais Projetos" (paginação)

**⚠️ Feature adicional identificada na tela:** filtros por categoria — adicionar campo `categoria` ao filtro da listagem pública `/api/projetos?categoria=residencial`

---

#### `/portfolio/[slug]` — Detalhe do Projeto
![Detalhe do Projeto](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/detalhes_do_projeto/screen.png)

**O que implementar (conforme tela):**
- Hero full-screen com imagem de capa + overlay dark + badge de categoria + título + localização
- Breadcrumb: Início > Projetos > Nome do Projeto
- Layout 2 colunas: texto descritivo (esq.) + "Ficha Técnica" card dourado (dir.)
  - Ficha Técnica: Local, Área Construída, Ano do Projeto, Arquitetura, Interiores, Status
  - Botão "Baixar Portfólio PDF" (dourado, fora do escopo — pode omitir ou ligar ao `arquivo_path`)
- Galeria de 5 imagens em grade assimétrica (1 grande + 2 médias + 2 pequenas)
- Navegação inferior: ← Projeto Anterior | Grade | Próximo Projeto →

---

#### `/loja` — Loja de Plantas Prontas
![Loja](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/loja_de_plantas/screen.png)

**O que implementar (conforme tela):**
- Hero com título "Plantas Prontas" + subtítulo + gradiente dark
- Barra de features: 4 ícones com texto ("Download Imediato", "Segurança Total", "Suporte Premium", "Design Assinado")
- **Filtros por faixa de área**: Todos, Até 150m², 150m²-300m², 300m²-500m², Mansões, Comerciais
  - Filtro client-side com `useState` — baseado em `terreno_minimo_m2` da Planta
- Grade 3 colunas de `<Card>`: imagem, badge (Exclusivo/Lançamento), título, specs (m², suítes, vagas), preço
- Seção "Garantia Scalioni" com texto de credibilidade

**⚠️ Feature adicional identificada:** filtros por faixa de m² — nenhuma API necessária, filtro client-side sobre lista SSG

---

#### `/loja/[slug]` — Detalhe da Planta + Checkout
![Detalhe da Planta](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/detalhes_da_planta/screen.png)

**O que implementar (conforme tela — adaptado para arquitetura):**
- Layout 2 colunas: galeria de imagens à esquerda + painel de compra à direita
- Galeria: imagem principal grande + 4 miniaturas clicáveis (`<Carousel>`)
- Painel direito: badge "Edição Limitada", preço em destaque, lista de itens incluídos, botão "Comprar Agora" (dourado), botão secundário "Solicitar Orçamento Corporativo"
- Seção "Sobre esta Planta" com descrição
- Tabela "Especificações Técnicas" (`<Table>` shadcn) com atributos da planta
- Accordion "Perguntas Frequentes" (`<Accordion>` shadcn)

**Checkout — `<Dialog>` simples (DECISÃO CONFIRMADA — NÃO usar stepper multi-etapas):**

![Finalizar Compra](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/finalizar_compra/screen.png)

> A tela Stitch mostra um stepper de 3 etapas — esta abordagem foi **descartada**.
> Implementar `<Dialog>` simples com: Nome Completo + E-mail + Telefone (opcional) + botão "Pagar com Mercado Pago".
> MUST NOT adicionar campo CNPJ/CPF — compra é anônima (apenas e-mail para entrega do link).

---

#### `/servicos` — Serviços
![Serviços](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/servi_os/screen.png)

**O que implementar (conforme tela):**
- Hero com imagem de corredor + título "Nossos Serviços"
- Seções alternadas imagem + texto para cada serviço (Projetos Arquitetônicos, Design de Interiores, Gestão de Obras)
- Stepper visual "O Fluxo da Perfeição": 5 etapas com círculos numerados
- Seção de depoimentos com `<Card>` de testimonial (3 colunas)
- CTA final com 2 botões: "Solicitar Orçamento" + "Falar com Consultor"

---

#### `/contato` — Contato
![Contato](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/contato/screen.png)

**O que implementar (conforme tela):**
- Layout 2 colunas: formulário (esq.) + informações de contato (dir.)
- Formulário: Nome Completo, E-mail, Assunto (dropdown/Select), Mensagem (Textarea), botão "Enviar Mensagem"
  - `<Select>` shadcn com opções: Residencial de Alto Padrão, Comercial, Consultoria, Regularização
- Painel direito: cards de Localização, E-mail, Telefone (ícones Lucide), + card "Canal Direto WhatsApp" com link
- Mapa embed (Google Maps iframe) abaixo do formulário

---

### Painel Admin

#### `/admin` — Dashboard
![Admin Dashboard](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/admin_dashboard/screen.png)

> A tela Stitch mostra gráfico de receita e cards KPI avançados — esta abordagem foi **descartada**.
> **Implementar dashboard simples (DECISÃO CONFIRMADA):**

**O que implementar (versão simplificada):**
- Sidebar com links: Dashboard, Projetos, Plantas, Pedidos, Mensagens, Usuários
- 4 cards de contagem simples: Total Pedidos, Pedidos Pagos, Mensagens Não Lidas, Plantas Ativas
  - Componente: `<Card>` shadcn com número grande e label
  - MUST NOT usar biblioteca de gráficos (recharts, chart.js, etc.)
- Tabela "Últimos Pedidos" com 5 linhas mais recentes (shadcn `<Table>`)
- Tabela "Mensagens Recentes" com badge "NOVA" (`<Badge variant="destructive">`) para não lidas

---

#### `/admin/projetos` — Listagem de Projetos
![Admin Projetos](file:///home/alunos/ScalioniEngenharia2.0/docs/stitch/stitch/admin_listagem_de_projetos/screen.png)

**O que implementar (conforme tela):**
- Header: título "Gerenciamento de Projetos" + botão "+ Novo Projeto" (dourado)
- Filtros por status: Todos, Em Execução, Concluídos, Planejamento (`<Button>` pill groups)
- `<Table>` shadcn com colunas: imagem thumb, nome + ID, cliente (pode ser categoria), localização, barra de progresso (`<Progress>`), status badge, ações (👁 editar 🗑)
- Paginação com shadcn `<Pagination>`

---

### Telas sem referência Stitch (implementar seguindo o padrão visual)

| Rota | Guia |
|---|---|
| `/pagamento/sucesso` | `<Alert variant="default">` centralizado + ícone `CheckCircle2` dourado grande + texto + link para home |
| `/pagamento/falha` | `<Alert variant="destructive">` + ícone `XCircle` + botão "Tentar novamente" |
| `/admin/login` | Card centralizado no centro da tela dark + logo + Form com Input email/senha |
| `/admin/plantas` | Mesmo padrão de `/admin/projetos` — tabela com colunas: thumb, título, preço, ativo (Switch), ações |
| `/admin/pedidos` | Tabela com colunas: ID, cliente, planta, valor, status badge colorido, data, ações (reenviar e-mail) |
| `/admin/mensagens` | Tabela com badge "NOVA", nome, e-mail, data, prévia da mensagem, link WhatsApp, marcar lida |
| `/admin/usuarios` | Tabela simples: nome, e-mail, ativo (Switch), botão criar novo |


