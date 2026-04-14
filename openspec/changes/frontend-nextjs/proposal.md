# Proposal — Frontend Next.js · Scalioni Engenharia 2.0

## O que estamos construindo

Frontend completo do site institucional e e-commerce da **Scalioni Engenharia**, construído em **Next.js 15 App Router** com TailwindCSS, consumindo a API FastAPI já existente (backend rodando em `:8000`).

O frontend cobre dois domínios:

1. **Site Público** — portfólio, loja de plantas, serviços, contato e páginas de pagamento
2. **Painel Admin** — autenticação JWT, CRUD de projetos/plantas/pedidos/mensagens e dashboard

## Por que estamos construindo

O backend está 100% completo (89/89 tasks, testes passando, Prometheus + Docker prod). O frontend é a única peça ausente para o produto ser usável pelo cliente e pelos visitantes.

## Público-alvo

- **Visitante** — pessoa física ou empresário que descobre a Scalioni via busca/indicação; quer ver o portfólio e comprar uma planta pronta
- **Administrador** — equipe da Scalioni que gerencia projetos, acompanha pedidos e responde mensagens

## Solução

### Site Público (`/`)
- Navbar fixa com logo, links e botão CTA dourado
- Hero full-screen com gradiente diagonal escuro e 2 CTAs
- Barra de estatísticas (150+ projetos, 15+ anos, 12 prêmios, 30 cidades)
- Grade de portfólio com hover overlay dourado
- Seção de serviços com 4 cards gold-border-left
- CTA da loja com preço em destaque
- Footer com newsletter

### Portfólio (`/portfolio`, `/portfolio/[slug]`)
- Grade masonry com filtros por categoria (client-side)
- Página de detalhe: galeria, ficha técnica dourada, navegação entre projetos

### Loja (`/loja`, `/loja/[slug]`)
- Grade de plantas com filtros por faixa de m² (client-side)
- Página de detalhe com galeria, specs, accordion FAQ
- Dialog de checkout simples: Nome, E-mail, Telefone → POST `/api/pedidos` → redirect Mercado Pago

### Servicos, Contato, Pagamento
- `/servicos` — seções alternadas imagem/texto + stepper + depoimentos
- `/contato` — formulário com Select de assunto + mapa embed
- `/pagamento/sucesso` — confirmação com ícone dourado
- `/pagamento/falha` — erro com botão retry

### Painel Admin (`/admin/*`)
- Login com JWT persistido em `localStorage`
- `middleware.ts` protege rotas `/admin/*`
- Dashboard com 4 cards KPI + tabelas de últimos pedidos/mensagens
- CRUD de Projetos, Plantas, Pedidos, Mensagens com forms, upload e toasts

## Non-goals

- App mobile (React Native)
- Internacionalização
- Sistema de cupons/descontos
- Chat em tempo real
- Gráficos avançados (recharts/chart.js)
