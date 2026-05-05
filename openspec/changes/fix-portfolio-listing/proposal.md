## Why

O portfólio completo (`/portfolio`) não está carregando projetos devido a uma falha na resolução do DNS/Proxy do Next.js dentro do ambiente Docker. A variável `NEXT_PUBLIC_API_URL` está configurada como `localhost:8000`, o que impede que o servidor do Next.js (SSR) consiga se comunicar com o backend para buscar a lista de projetos, resultando em um estado vazio para o usuário.

## What Changes

- Introdução de uma variável de ambiente interna (`INTERNAL_API_URL`) para as requisições server-side e para a configuração de rewrites do Next.js.
- Atualização do `next.config.ts` para priorizar a comunicação interna entre containers (`http://backend:8000`).
- Ajuste no `docker-compose.yml` para garantir a conectividade correta entre os serviços de frontend e backend.

## Capabilities

### New Capabilities
- `comunicacao-inter-service`: Definição de padrões para comunicação segura e resiliente entre containers no ambiente de desenvolvimento e produção.

### Modified Capabilities
- `frontend-comportamento`: Atualização dos requisitos de busca de dados para suportar ambientes containerizados.

## Non-goals
- Não serão alteradas as rotas da API no backend.
- Não haverá mudanças na lógica de filtragem do portfólio.

## Impact

- **Frontend**: Arquivos `next.config.ts` e `lib/api.ts`.
- **Infra**: Arquivo `docker-compose.yml` e variáveis de ambiente.
