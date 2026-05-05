## ADDED Requirements

### Requirement: Resolução de DNS Interno no Docker
O sistema SHALL utilizar nomes de serviços do Docker Compose (ex: `http://backend:8000`) para todas as comunicações server-to-server entre o Frontend e o Backend dentro do ambiente de desenvolvimento.

#### Scenario: SSR solicita projetos
- **WHEN** o servidor do Next.js executa `getProjetos()` durante a renderização da página `/portfolio`
- **THEN** o sistema deve resolver o host `backend` e receber a lista de projetos com status 200

### Requirement: Proxy de API Unificado
O frontend SHALL expor um endpoint relativo `/api/*` que atua como proxy para o backend, garantindo que requisições client-side funcionem sem problemas de CORS ou resolução de host no navegador do usuário.

#### Scenario: Cliente solicita detalhes
- **WHEN** o navegador do usuário acessa uma rota de API via proxy (ex: `/api/projetos/slug`)
- **THEN** o servidor Next.js deve encaminhar a requisição para a `INTERNAL_API_URL` e retornar o resultado de forma transparente
