# Tasks — Frontend Next.js · Scalioni Engenharia 2.0

> Cada task deve ser atômica (máx. 2h). Referenciar o HTML Stitch correspondente em `docs/design_2.0/`.
> Ao implementar: ler o HTML de referência → converter para componentes Next.js/Tailwind → testar.

---

## Fase 0 — Setup e Fundação

- [x] `task-101` Scaffoldar projeto Next.js 15 com TypeScript: `npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- [x] `task-102` Configurar `tailwind.config.ts` — design tokens: cores (`primary`, `main-bg`, `card-bg`, `nav-bg`, `terracotta`), fontes (`body: Outfit`, `playfair: Playfair Display`), `borderRadius: 0px`
- [x] `task-103` Configurar fontes em `app/layout.tsx` via `next/font/google` (Outfit + Playfair Display), metadados globais e classes CSS base
- [x] `task-104` Criar `lib/api.ts` — funções fetch tipadas para todos os endpoints (projetos, plantas, pedidos, contato, admin)
- [x] `task-105` Criar `lib/auth.ts` — `getToken()`, `setToken()`, `removeToken()` via `localStorage` + cookie para SSR
- [x] `task-106` Criar `lib/utils.ts` — `cn()` (classnames), `formatCurrency()`, `formatDate()`, `formatM2()`
- [x] `task-107` Criar `middleware.ts` — protege `/admin/*` com verificação JWT (`jose`), redireciona para `/admin/login` se inválido
- [x] `task-108` Criar `Dockerfile` multi-stage (`base → dev → builder → prod`) e adicionar service `frontend` no `docker-compose.yml`
- [x] `task-109` Criar `public/logo.svg` — logotipo SCALIONIENGENHARIA em texto Playfair dourado (#C9A55A)
- [x] `task-110` Definir variáveis CSS globais em `app/globals.css`: `.gold-divider`, `.gold-border-left`, `.maximalist-pattern`, `.diagonal-gradient`

---

## Fase 1 — Componentes de Layout Global

> Referência: Navbar e Footer do `home_page_2.0/code.html`

- [x] `task-111` Criar `components/layout/Navbar.tsx` (`'use client'`) — logo à esquerda (Playfair bold dourado), links de navegação com underline hover dourado, botão "SOLICITAR ORÇAMENTO", menu mobile com Sheet/hamburger
- [x] `task-112` Criar `components/layout/Footer.tsx` — 4 colunas: brand + descrição + social icons, Links Úteis, Siga-nos, Newsletter (input + button). Border-top dourado 4px
- [x] `task-113` Criar `components/layout/BotaoWhatsApp.tsx` (`'use client'`) — botão flutuante fixo bottom-right, ícone WhatsApp, link `wa.me/{WHATSAPP}`
- [x] `task-114` Atualizar `app/layout.tsx` — incluir Navbar, Footer, BotaoWhatsApp em todas as páginas públicas via RootLayout

---

## Fase 2 — Home Page

> Referência: `home_page_2.0/code.html`

- [x] `task-121` Criar `components/home/HeroSection.tsx` — imagem full-screen, `.diagonal-gradient`, badge terracotta "Excelência em Engenharia", headline Playfair 2 cores (branco + dourado), 2 CTAs (sólido e outline dourado), scroll indicator animado
- [x] `task-122` Criar `components/home/StatsSection.tsx` — 4 colunas: 150+ projetos, 15+ anos, 12 prêmios, 30 cidades. Números em Playfair dourado gigantes, separadores verticais dourados
- [x] `task-123` Criar `components/home/PortfolioGrid.tsx` — grade masonry assimétrica com 4 cards de projetos (`.masonry-item-tall`, `.masonry-item-wide`), hover overlay dourado com badge terracotta + título Playfair
- [x] `task-124` Criar `components/home/ServicesSection.tsx` — 4 cards `gold-border-left`: Arquitetura de Luxo, Engenharia de Precisão, Gestão de Obras, Design de Interiores. Ícones Lucide dourados, hover bg-zinc-900
- [x] `task-125` Criar `components/home/StoreCTA.tsx` — card com `.maximalist-pattern`, título "Plantas Prontas", preço "A partir de R$ 990,00" em Playfair, botão CTA, imagem com frame dourado e badge terracotta decorativo
- [x] `task-126` Criar `app/page.tsx` — SSG compondo todas as seções da home

---

## Fase 3 — Portfólio

> Referência: `portf_lio_2.0/code.html`, `detalhes_do_projeto_2.0/code.html`

- [x] `task-131` Criar `components/portfolio/PortfolioCard.tsx` — card `<Card>` com imagem, badge de categoria (terracotta), título, ano + cidade, overlay hover dourado
- [x] `task-132` Criar `components/portfolio/PortfolioFilterGrid.tsx` (`'use client'`) — filtros por categoria (pills: Todos, Residencial Luxo, Corporativo, Interiores, Restauração, Urbanismo), grade masonry, filtro client-side com `useState`
- [x] `task-133` Criar `app/portfolio/page.tsx` — SSG: fetch `GET /api/projetos`, hero com imagem de fundo, estatísticas laterais, `<PortfolioFilterGrid>` com dados
- [x] `task-134` Criar `components/portfolio/GaleriaCarousel.tsx` (`'use client'`) — carousel de imagens com navegação prev/next
- [x] `task-135` Criar `app/portfolio/[slug]/page.tsx` — ISR 3600s: fetch `GET /api/projetos/{slug}`, hero full-screen, breadcrumb, layout 2 colunas (texto + ficha técnica dourada), galeria carousel, navegação entre projetos

---

## Fase 4 — Loja de Plantas

> Referência: `loja_de_plantas_arquitet_nicas_2.0/code.html`, `detalhes_da_planta_2.0/code.html`, `checkout_modal_2.0/code.html`

- [x] `task-141` Criar `components/loja/PlantaCard.tsx` — card com imagem, badge (Exclusivo/Lançamento), título, specs (m², suítes, vagas), preço formatado, botão "Ver Detalhes"
- [x] `task-142` Criar `components/loja/PlantaFilterGrid.tsx` (`'use client'`) — filtros por faixa de m² (Todos, até 150m², 150-300m², 300-500m², Mansões, Comerciais) + grade 3 colunas, filtro client-side sobre lista SSG
- [x] `task-143` Criar `app/loja/page.tsx` — SSG: fetch `GET /api/plantas`, hero, barra de 4 features (Download Imediato, Segurança, Suporte, Design), `<PlantaFilterGrid>`, seção "Garantia Scalioni"
- [x] `task-144` Criar `components/loja/CheckoutDialog.tsx` (`'use client'`) — Dialog shadcn simples: Nome, E-mail, Telefone (opcional), botão "Pagar com Mercado Pago". POST `/api/pedidos` → redirect para `init_point`. Estado: loading, erro
- [x] `task-145` Criar `app/loja/[slug]/page.tsx` — ISR 3600s: fetch `GET /api/plantas/{slug}`, galeria + painel de compra (preço, itens incluídos, `<CheckoutDialog>`), tabela specs, accordion FAQ
- [x] `task-146` Criar `app/pagamento/sucesso/page.tsx` — CSR: lê `?collection_status` da query, `<Alert>` com ícone `CheckCircle2` dourado gigante, texto de confirmação, link para home/loja
- [x] `task-147` Criar `app/pagamento/falha/page.tsx` — CSR: `<Alert variant="destructive">`, ícone `XCircle`, botão "Tentar Novamente" (volta para `/loja`)

---

## Fase 5 — Serviços e Contato

> Referência: `servi_os_2.0/code.html`, `contato_2.0/code.html`

- [x] `task-151` Criar `app/servicos/page.tsx` — SSG: hero, 3 seções alternadas (imagem+texto) para Projetos Arquitetônicos, Design de Interiores, Gestão de Obras, stepper "O Fluxo da Perfeição" (5 etapas), 3 cards de depoimentos, CTA final
- [x] `task-152` Criar `components/contato/ContatoForm.tsx` (`'use client'`) — `react-hook-form` + `zod`: campos Nome, E-mail, Select de assunto, Textarea, botão. POST `/api/contato` → toast success/error. Feedback com `<Alert>` shadcn
- [x] `task-153` Criar `app/contato/page.tsx` — SSG: layout 2 colunas (form + info de contato), cards com ícones Lucide (MapPin, Mail, Phone), card WhatsApp, Google Maps iframe, `<ContatoForm>`

---

## Fase 6 — Painel Admin

> Referências: `login_administrativo_2.0/`, `admin_dashboard_2.0/`, `admin_gerenciamento_de_projetos_2.0/`, `admin_gerenciamento_de_plantas_prontas/`, `admin_pedidos_2.0/`, `gerenciamento_de_mensagens/`, `admin_gerenciamento_de_usu_rios_2.0/`

- [x] `task-161` Criar `app/admin/login/page.tsx` — layout centralizado, campos e-mail/senha, call `adminLogin` → `setToken` → redirect
- [x] `task-162` Criar `components/admin/Sidebar.tsx` — menu lateral: Dashboard, Projetos, Plantas, Pedidos, Mensagens, Usuários + Logout
- [x] `task-163` Criar `app/admin/layout.tsx` — layout com Sidebar + Header superior (breadcrumb + info admin). Proteção via middleware
- [x] `task-164` Criar `components/admin/KpiCard.tsx` — card com valor grande, ícone e label para métricas do Dashboard
- [x] `task-165` Criar `app/admin/page.tsx` — Dashboard: fetch KPIs, lista de 5 pedidos recentes em tabela, lista de 5 mensagens recentes
- [x] `task-166` Criar `components/admin/ProjetoForm.tsx` — form com upload de imagem de capa + galeria (drag-n-drop simulated), categoria, ano, markdown editor simples
- [x] `task-167` Criar `app/admin/projetos/page.tsx` — listagem em tabela com miniaturas, filtros, botão "Novo", ações Editar/Excluir
- [x] `task-168` Criar `app/admin/projetos/[slug]/page.tsx` e `novo/page.tsx` — páginas wrapper que usam o `<ProjetoForm>`
- [x] `task-169` Criar `components/admin/PlantaForm.tsx` — form similar ao projeto + campos Preço, Área m², upload de arquivo (PDF/ZIP)
- [x] `task-170` Criar `app/admin/plantas/page.tsx` — listagem com preço e área m², ações CRUD
- [x] `task-171` Criar `app/admin/plantas/[slug]/page.tsx` e `nova/page.tsx` — páginas wrapper
- [x] `task-172` Criar `app/admin/pedidos/page.tsx` — lista de pedidos, troca de status inline (Pendente, Pago, Cancelado), detalhes do cliente
- [x] `task-173` Criar `app/admin/mensagens/page.tsx` — feed de contatos com botão "Marcar como Lida" (call `PUT /messages/{id}/read`)
- [x] `task-174` Criar `app/admin/usuarios/page.tsx` — lista de administradores cadastrados (nome, e-mail, última atividade)
- [x] `task-175` Adicionar confirmações de exclusão (`window.confirm`) em todos os botões "Excluir" do Admin
- [x] `task-176` Implementar logout funcional (limpa cookies/localStorage) e redireciona para `/admin/login`

---

## Fase 7 — Qualidade e Finalização

- [ ] `task-181` Adicionar metadados SEO em todas as pages: `<title>`, `<meta description>`, `<meta og:*>`; usar `generateMetadata()` onde dinâmico
- [ ] `task-182` Implementar `loading.tsx` para rotas com SSG/ISR (spinner dourado) e `not-found.tsx` (404 dark luxury)
- [ ] `task-183` Tornar o site responsivo: revisar Navbar mobile (Sheet), grades de portfólio/loja em mobile (1 col), admin sidebar colapsável
- [ ] `task-184` Adicionar `next.config.ts` — domínios de imagem permitidos, output `standalone` para Docker prod
- [ ] `task-185` Atualizar `README.md` — seção de setup do frontend: `npm install`, `npm run dev`, variáveis de ambiente necessárias
- [ ] `task-186` Atualizar `docker-compose.yml` — adicionar service `frontend` com `target: dev`, volume hot-reload, porta `3000:3000`, `depends_on: backend`
