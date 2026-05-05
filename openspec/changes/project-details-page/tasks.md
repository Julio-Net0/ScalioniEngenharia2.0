## 1. Ajustes de Navegação na Home Page

- [x] 1.1 Atualizar `frontend/components/home/PortfolioGrid.tsx` para garantir que todos os links apontem para `/portfolio/[slug]`
- [x] 1.2 Implementar slugs temporários ou redirecionamento inteligente para os placeholders da Home Page

## 2. Componentes de UI para Detalhes do Projeto

- [x] 2.1 Criar componente `frontend/components/portfolio/GaleriaProjeto.tsx` usando o padrão de grade assimétrica (5 imagens)
- [x] 2.2 Criar componente `frontend/components/portfolio/FichaTecnica.tsx` usando `Card` do shadcn/ui

## 3. Página de Detalhes do Projeto

- [x] 3.1 Refatorar `frontend/app/portfolio/[slug]/page.tsx` para usar os novos componentes e seguir o design Dark Luxury
- [x] 3.2 Integrar a busca de dados via `getProjeto` e garantir o tratamento de erro com `notFound()`
- [x] 3.3 Adicionar navegação inferior (Anterior / Todos / Próximo) na página de detalhes

## 4. Verificação e Testes

- [x] 4.1 Validar a navegação a partir da Home Page com dados reais do banco
- [x] 4.2 Verificar a responsividade da galeria em dispositivos mobile
- [x] 4.3 Garantir que o SEO (metadados) esteja sendo gerado corretamente para cada projeto
