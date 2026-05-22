# Proposal: Clean Up Legacy Frontend Plantas

Remoção de rotas e funções legadas de leitura de plantas do frontend, consolidando o uso da nova estrutura de Clean Architecture e DDD em todo o projeto.

## Context

Com a introdução da rota `/plantas/[slug]` e do repositório `HttpPlantaRepository`, o código possui agora caminhos paralelos para leitura de plantas (o modelo anêmico legado em `/loja/[slug]` e o modelo rico). Esta proposta visa unificar a leitura de plantas na nova arquitetura, reduzindo a dívida técnica e eliminando código redundante.

## What Changes

- **Remoção da rota legada**: Exclusão da pasta `frontend/app/loja/[slug]` e seu respectivo `page.tsx`.
- **Atualização do PlantaCard**: Alteração dos links em `PlantaCard.tsx` para redirecionar para `/plantas/[slug]` em vez de `/loja/[slug]`.
- **Migração do Catálogo de Plantas**: Atualização da página `/loja` (`frontend/app/loja/page.tsx`) para obter os dados usando o `HttpPlantaRepository`.
- **Migração do Dashboard e Edição do Admin**: Atualização de `frontend/app/admin/page.tsx` e `frontend/app/admin/plantas/[slug]/page.tsx` para utilizarem o `HttpPlantaRepository`.
- **Limpeza do `api.ts`**: Remoção das funções obsoletas `getPlanta` e `getPlantas` de `frontend/lib/api.ts`.

## Non-goals

- Não migrar as mutações administrativas (criação, edição e deleção de plantas) para casos de uso de Clean Architecture nesta fase, mantendo as funções `adminCreatePlanta`, `adminUpdatePlanta` e `adminDeletePlanta` em `frontend/lib/api.ts` para evitar escopo excessivo.
- Não reestruturar outros contextos (como projetos, mensagens ou pedidos) para Clean Architecture nesta mudança.
