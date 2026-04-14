# Design — Frontend Next.js · Scalioni Engenharia 2.0

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 App Router (TypeScript) |
| Estilo | TailwindCSS (config customizado) |
| Fontes | Outfit (body) + Playfair Display (headings) via `next/font/google` |
| Ícones | `lucide-react` — nunca emojis, nunca heroicons |
| Forms | `react-hook-form` + `zod` |
| HTTP | `fetch` nativo (server components) / `axios` (client components) |
| Auth | JWT via `localStorage` + `middleware.ts` (Edge Runtime) |
| Testes | Vitest + React Testing Library |
| Container | Dockerfile multi-stage (`dev` / `prod`) |

## Design Tokens (TailwindCSS)

```ts
// tailwind.config.ts
colors: {
  primary:       '#C9A55A',   // dourado — accent principal
  'primary-hover': '#E8C675',
  terracotta:    '#B5501B',   // vermelho-cobre — badges de categoria
  'main-bg':     '#0A0A0A',   // fundo principal
  'card-bg':     '#111111',   // cards e seções alternadas
  'nav-bg':      '#1A1A1A',   // navbar e footer
},
fontFamily: {
  body:     ['Outfit', 'sans-serif'],
  playfair: ['Playfair Display', 'serif'],
},
borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '9999px' },
```

**Padrões de classe reutilizáveis:**

| Classe CSS | Uso |
|---|---|
| `.gold-divider` | `height:1px; background: linear-gradient(90deg, transparent, #C9A55A, transparent)` |
| `.gold-border-left` | `border-left: 3px solid #C9A55A` |
| `.maximalist-pattern` | SVG pattern de cruz dourada com `fill-opacity: 0.03` |
| `.diagonal-gradient` | `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 100%)` |

## Estrutura de Arquivos

```
frontend/
├── app/
│   ├── layout.tsx                  ← RootLayout: fontes, metadados globais, Toaster
│   ├── page.tsx                    ← Home (SSG)
│   ├── portfolio/
│   │   ├── page.tsx                ← Portfólio completo (SSG)
│   │   └── [slug]/page.tsx         ← Detalhe do projeto (ISR 3600s)
│   ├── loja/
│   │   ├── page.tsx                ← Loja de plantas (SSG)
│   │   └── [slug]/page.tsx         ← Detalhe da planta (ISR 3600s)
│   ├── servicos/page.tsx           ← Serviços (SSG)
│   ├── contato/page.tsx            ← Contato (SSG + form client)
│   ├── pagamento/
│   │   ├── sucesso/page.tsx        ← Checkout aprovado
│   │   └── falha/page.tsx          ← Checkout reprovado
│   └── admin/
│       ├── layout.tsx              ← Layout admin: sidebar + auth guard
│       ├── login/page.tsx          ← Login (CSR)
│       ├── page.tsx                ← Dashboard (CSR)
│       ├── projetos/
│       │   ├── page.tsx            ← Lista projetos
│       │   ├── novo/page.tsx       ← Criar projeto
│       │   └── [slug]/page.tsx     ← Editar projeto
│       ├── plantas/
│       │   ├── page.tsx
│       │   ├── nova/page.tsx
│       │   └── [slug]/page.tsx
│       ├── pedidos/page.tsx
│       ├── mensagens/page.tsx
│       └── usuarios/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              ← 'use client' (menu mobile state)
│   │   ├── Footer.tsx
│   │   └── BotaoWhatsApp.tsx       ← 'use client' (float button)
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── PortfolioGrid.tsx
│   │   ├── ServicesSection.tsx
│   │   └── StoreCTA.tsx
│   ├── portfolio/
│   │   ├── PortfolioCard.tsx
│   │   ├── PortfolioFilterGrid.tsx ← 'use client' (filtros)
│   │   └── GaleriaCarousel.tsx     ← 'use client' (carousel)
│   ├── loja/
│   │   ├── PlantaCard.tsx
│   │   ├── PlantaFilterGrid.tsx    ← 'use client' (filtros m²)
│   │   └── CheckoutDialog.tsx      ← 'use client' (dialog + form)
│   ├── contato/
│   │   └── ContatoForm.tsx         ← 'use client' (form + toast)
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── KpiCard.tsx
│   │   ├── ProjetoForm.tsx         ← 'use client'
│   │   ├── PlantaForm.tsx          ← 'use client'
│   │   ├── MensagemItem.tsx        ← 'use client' (marcar lida)
│   │   └── DataTable.tsx           ← 'use client' (sort/filter)
│   └── ui/                         ← Shadcn primitivos (Button, Card, etc.)
├── lib/
│   ├── api.ts                      ← Funções fetch para cada endpoint
│   ├── auth.ts                     ← getToken / setToken / removeToken
│   └── utils.ts                    ← cn(), formatCurrency(), formatDate()
├── middleware.ts                   ← Protege /admin/* (Edge Runtime JWT)
├── public/
│   ├── logo.svg
│   └── og-image.jpg
├── Dockerfile
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## API Contracts (Backend → Frontend)

### Endpoints Públicos

| Método | Rota | Uso no Frontend |
|---|---|---|
| `GET` | `/api/projetos` | Lista todos projetos ativos |
| `GET` | `/api/projetos/{slug}` | Detalhe do projeto |
| `GET` | `/api/plantas` | Lista todas plantas ativas |
| `GET` | `/api/plantas/{slug}` | Detalhe da planta |
| `POST` | `/api/pedidos` | Criar pedido → init_point MP |
| `POST` | `/api/contato` | Enviar mensagem de contato |
| `GET` | `/health` | Healthcheck (não usado no frontend) |

### Endpoints Admin (requerem Bearer token)

| Método | Rota | Uso no Frontend |
|---|---|---|
| `POST` | `/api/admin/login` | Login → recebe access_token |
| `GET` | `/api/admin/mensagens` | Lista mensagens (+ nao_lidas) |
| `PATCH` | `/api/admin/mensagens/{id}/lida` | Marcar mensagem como lida |
| `GET` | `/api/admin/pedidos` | Lista todos pedidos |
| `POST` | `/api/admin/pedidos/{id}/reenviar-email` | Reenviar e-mail de download |
| `GET` | `/api/projetos` | Lista projetos (admin usa mesmo endpoint) |
| `POST` | `/api/projetos` | Criar projeto |
| `PUT` | `/api/projetos/{slug}` | Atualizar projeto |
| `DELETE` | `/api/projetos/{slug}` | Deletar projeto |
| `GET` | `/api/plantas` | Lista plantas |
| `POST` | `/api/plantas` | Criar planta |
| `PUT` | `/api/plantas/{slug}` | Atualizar planta |
| `DELETE` | `/api/plantas/{slug}` | Deletar planta |
| `POST` | `/api/upload` | Upload de imagem/arquivo |

## Estratégias de Renderização

| Rota | Estratégia | Motivo |
|---|---|---|
| `/` | SSG | Conteúdo estático, máxima performance |
| `/portfolio` | SSG | Lista pode ser gerada no build |
| `/portfolio/[slug]` | ISR 3600s | Projetos atualizam raramente |
| `/loja` | SSG | Lista de plantas estática |
| `/loja/[slug]` | ISR 3600s | Plantas raramente mudam |
| `/servicos` | SSG | Conteúdo estático |
| `/contato` | SSG | Form é client-component embutido |
| `/pagamento/*` | CSR | Dinâmico por query params |
| `/admin/*` | CSR | Dados em tempo real + auth |

## Fluxo de Checkout

```
/loja/[slug]
  └── <CheckoutDialog> → POST /api/pedidos
                          ↓ { init_point: "https://mp.com/..." }
                          └── window.location.href = init_point
                              ↓ (redirect Mercado Pago)
                              └── success → /pagamento/sucesso?collection_status=approved
                              └── failure → /pagamento/falha
```

## Fluxo de Autenticação Admin

```
/admin/login
  └── POST /api/admin/login → { access_token }
        └── localStorage.setItem('token', access_token)
            └── router.push('/admin')

middleware.ts (Edge Runtime)
  └── Verifica cookie/header Authorization
      ├── Token ausente → redirect /admin/login
      └── Token presente → next()
```

## Rules: Server vs Client Components

**Server Components (padrão):**
- Todas as pages de rota pública (`/`, `/portfolio`, `/loja`, etc.)
- `app/admin/*/page.tsx` (fetch server-side com `Bearer token` do cookie)

**Client Components (`'use client'`):**
- `Navbar.tsx` — `useState` para menu mobile
- `PortfolioFilterGrid.tsx` — filtro por categoria com `useState`
- `PlantaFilterGrid.tsx` — filtro por faixa de m²
- `CheckoutDialog.tsx` — `Dialog` com form e submit
- `ContatoForm.tsx` — `react-hook-form`, `useToast`
- `GaleriaCarousel.tsx` — Carousel com estado
- `app/admin/login/page.tsx` — localStorage
- `ProjetoForm.tsx`, `PlantaForm.tsx` — forms controlados
- `MensagemItem.tsx` — toggle lida
- `BotaoWhatsApp.tsx` — hover animation

## Middleware (Edge Runtime)

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()
  
  const token = request.cookies.get('token')?.value
    ?? request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url))
  
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET ?? 'dev'))
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = { matcher: ['/admin/:path*'] }
```

## Docker

```dockerfile
# ── base ──────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── dev ───────────────────────────────────────────────
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# ── build ─────────────────────────────────────────────
FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── prod ──────────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WHATSAPP=5511999999999
NEXT_PUBLIC_MAPS_EMBED_URL=https://maps.google.com/...
NEXT_PUBLIC_JWT_SECRET=dev-secret-key   # mesmo valor de SECRET_KEY no backend
```

## Referências Visuais

Todos os HTMLs de referência estão em `docs/design_2.0/*/code.html`.

| HTML | Rota |
|---|---|
| `home_page_2.0/code.html` | `/` |
| `portf_lio_2.0/code.html` | `/portfolio` |
| `detalhes_do_projeto_2.0/code.html` | `/portfolio/[slug]` |
| `loja_de_plantas_arquitet_nicas_2.0/code.html` | `/loja` |
| `detalhes_da_planta_2.0/code.html` | `/loja/[slug]` |
| `checkout_modal_2.0/code.html` | Dialog em `/loja/[slug]` |
| `servi_os_2.0/code.html` | `/servicos` |
| `contato_2.0/code.html` | `/contato` |
| `payment_ok_2.0/code.html` | `/pagamento/sucesso` |
| `pagamento_n_o_aprovado/code.html` | `/pagamento/falha` |
| `login_administrativo_2.0/code.html` | `/admin/login` |
| `admin_dashboard_2.0/code.html` | `/admin` |
| `admin_gerenciamento_de_projetos_2.0/code.html` | `/admin/projetos` |
| `admin_gerenciamento_de_plantas_prontas/code.html` | `/admin/plantas` |
| `admin_pedidos_2.0/code.html` | `/admin/pedidos` |
| `gerenciamento_de_mensagens/code.html` | `/admin/mensagens` |
| `admin_gerenciamento_de_usu_rios_2.0/code.html` | `/admin/usuarios` |
