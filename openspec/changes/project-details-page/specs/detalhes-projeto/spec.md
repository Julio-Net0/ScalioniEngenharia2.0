# Spec — Detalhes do Projeto (RFC 2119)

> Palavras-chave: **MUST** (obrigatório), **SHOULD** (recomendado), **MUST NOT** (proibido).

## 1. Navegação da Home Page

**Cenário 1.1 — Clique em Projeto (Destaque)**
- **Dado** que o usuário está na Home Page (`/`)
- **Quando** clica na imagem ou título de um projeto na seção "Nosso Portfólio"
- **Então** o sistema MUST redirecionar para a página de detalhes correspondente em `/portfolio/[slug]`
- **E** MUST NOT redirecionar para a listagem geral `/portfolio` (exceto se explicitamente clicado no link "VER TODOS OS PROJETOS")

**Cenário 1.2 — Projetos Sem Dados (Placeholders)**
- **Dado** que a API não retornou projetos reais
- **Quando** o usuário clica em um card de placeholder na Home Page
- **Então** o sistema SHOULD redirecionar para uma visualização de exemplo de detalhes (slug simulado) ou, no mínimo, manter o comportamento de navegação consistente, sem causar erro 404 inesperado.

## 2. Layout da Página de Detalhes (`/portfolio/[slug]`)

**Cenário 2.1 — Visualização de Conteúdo**
- **Dado** que o usuário acessa `/portfolio/[slug]`
- **Quando** os dados do projeto são carregados
- **Então** a página MUST exibir:
  - Hero section com a `imagem_capa` como fundo
  - Título do projeto em destaque
  - Descrição completa do projeto
  - Ficha técnica contendo: Categoria, Ano, Local e Status
  - Galeria de imagens secundárias (campo `imagens`)

**Cenário 2.2 — Galeria de Imagens**
- **Dado** que o projeto possui imagens na galeria (`imagens` array > 0)
- **Quando** a página é renderizada
- **Então** as imagens MUST ser exibidas em uma grade assimétrica (estilo masonry ou bento grid) abaixo da descrição principal.
- **E** SHOULD permitir a visualização em tamanho maior (lightbox ou modal) ao clicar.

**Cenário 2.3 — Projeto Inativo**
- **Dado** que o projeto possui `ativo = false`
- **Quando** acessado diretamente via URL por um usuário comum (não admin)
- **Então** o sistema MUST retornar `404 Not Found`.

## 3. Componentes e Estilo

- O botão de navegação inferior "VER MAIS" MUST redirecionar de volta para `/portfolio`.
- As cores e tipografia MUST seguir estritamente o guia visual Dark Luxury definido no `design.md` global.
