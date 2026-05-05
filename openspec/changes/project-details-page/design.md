## Context

O sistema atual possui uma página de detalhes de projeto em `/portfolio/[slug]`, mas a navegação a partir da Home Page (`/`) redireciona o usuário para a listagem geral (`/portfolio`) em casos de placeholders, e o layout da página de detalhes ainda pode ser refinado para exibir a galeria e descrição de forma mais impactante, seguindo o padrão "Dark Luxury".

## Goals / Non-Goals

**Goals:**
- Garantir que todos os links de projetos na Home Page levem à página de detalhes correta.
- Implementar o layout completo de detalhes do projeto: Hero, Descrição, Ficha Técnica e Galeria Assimétrica.
- Manter a consistência visual com o tema Dark Luxury (fundo `#0A0A0A`, accent `#C9A55A`).

**Non-Goals:**
- Não alterar o esquema do banco de dados (o campo `imagens` e `descricao` já existem).
- Não implementar animações complexas que fujam do padrão shadcn/ui.

## Decisions

### 1. Rota de Detalhes
**Decisão:** Manter a rota `/portfolio/[slug]`.
**Racional:** É a rota já definida na arquitetura original e nas specs de comportamento. Renomear causaria quebra em outros links e redundância.

### 2. Componentes de UI
**Decisão:** Usar `Carousel` e `Card` do shadcn/ui para a galeria e ficha técnica.
**Racional:** Segue a regra de ouro de não criar componentes do zero e usar a biblioteca padrão do projeto.

### 3. Server vs Client Components
- `app/portfolio/[slug]/page.tsx`: **Server Component** (busca dados via `getProjeto`).
- `components/portfolio/GaleriaProjeto.tsx`: **Client Component** (se houver interatividade como lightbox ou carousel manual).

## Risks / Trade-offs

- **[Risco] Slugs Inválidos** → Mitigação: Uso de `notFound()` do Next.js e validação no `generateStaticParams`.
- **[Risco] Imagens Faltantes** → Mitigação: Fallback para placeholders do Unsplash consistentes com o tema.

## Migration Plan

1. Atualizar `PortfolioGrid.tsx` na Home.
2. Refatorar `app/portfolio/[slug]/page.tsx`.
3. Validar a renderização com os dados do seed (admin).
