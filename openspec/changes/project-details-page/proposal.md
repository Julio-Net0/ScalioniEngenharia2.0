## Why

Atualmente, na página inicial, ao clicar em um projeto (especialmente nos placeholders quando não há dados reais), o usuário é redirecionado para a listagem geral do portfólio em vez de uma página de detalhes específica. Isso quebra a expectativa do usuário de ver mais informações sobre o projeto clicado e prejudica a experiência de navegação premium desejada para a Scalioni Engenharia.

## What Changes

- Correção dos links no componente `PortfolioGrid` da home page para sempre apontarem para a rota de detalhes do projeto (`/portfolio/[slug]`).
- Garantia de que mesmo projetos "placeholder" tenham slugs simulados que levem a uma visualização de detalhes (ou apontem para projetos reais existentes).
- Melhoria na página de detalhes do projeto (`/portfolio/[slug]`) para garantir que a descrição e a galeria de imagens secundárias sejam exibidas corretamente conforme solicitado.

## Capabilities

### New Capabilities
- `detalhes-projeto`: Definição dos requisitos comportamentais e de UI para a página de detalhes do projeto, incluindo visualização de galeria e ficha técnica.

### Modified Capabilities
- `frontend-comportamento`: Atualização dos requisitos de navegação da home page para garantir o redirecionamento correto para detalhes.

## Non-goals
- Não será implementado um novo sistema de gerenciamento de arquivos (o existente no admin será mantido).
- Não haverá mudanças no backend além da garantia de que os dados das imagens secundárias e descrição sejam retornados corretamente (o que já parece estar previsto).

## Impact

- **Frontend**: Componentes `PortfolioGrid` e a página `app/portfolio/[slug]/page.tsx`.
- **Navegação**: Ajuste nas rotas internas para consistência.
