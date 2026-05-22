# Tasks: Clean Up Legacy Frontend Plantas

Checklist de tarefas atômicas agrupadas por camadas para a remoção e unificação arquitetural.

## 1. Banco de Dados / Backend
- Nenhuma alteração necessária nesta camada.

## 2. Camada do Frontend

### Rota e Componentes Públicos
- [x] task-1: Atualizar o link de visualização em `frontend/components/loja/PlantaCard.tsx` para apontar para `/plantas/[slug]` em vez de `/loja/[slug]`.
- [x] task-2: Atualizar a página `frontend/app/loja/page.tsx` para usar o `HttpPlantaRepository` para recuperar a lista de plantas e passá-las para o `PlantaFilterGrid`.
- [x] task-3: Ajustar o componente `frontend/components/loja/PlantaFilterGrid.tsx` e seus subcomponentes para utilizarem o tipo `Planta` da Clean Architecture (propriedades `terrenoMinimoM2` e `preco.valor`).
- [x] task-4: Remover o diretório legado `frontend/app/loja/[slug]/` por completo.

### Admin e Dashboard
- [x] task-5: Atualizar a página de edição de planta `frontend/app/admin/plantas/[slug]/page.tsx` para usar `HttpPlantaRepository` para buscar os dados iniciais do formulário.
- [x] task-6: Atualizar a página inicial do admin `frontend/app/admin/page.tsx` para carregar a contagem de plantas usando `HttpPlantaRepository`.
- [x] task-7: Adaptar o componente `frontend/components/admin/PlantaForm.tsx` para converter a entidade `Planta` rica no estado do formulário esperado pelo `react-hook-form`.

### Limpeza da API Legada
- [x] task-8: Remover as funções obsoletas `getPlanta` e `getPlantas` do arquivo `frontend/lib/api.ts`.
- [x] task-9: Remover a interface legada `Planta` de `frontend/lib/api.ts`.

## 3. Testes e Verificação
- [x] task-10: Teste de integração manual da Loja: Navegar em `/loja`, garantir que o filtro por m² funciona e que ao clicar em "Ver Detalhes" o usuário é levado à rota `/plantas/[slug]`.
  - *Critério de aceitação*: O site carrega as plantas corretamente e navega sem erros para o novo layout de detalhes.
- [x] task-11: Teste de integração manual do Admin: Acessar `/admin` e `/admin/plantas`, e garantir que a listagem, contagem e edição de planta carregam os dados via repositório HTTP da Clean Architecture.
  - *Critério de aceitação*: A edição e a listagem de plantas continuam funcionando perfeitamente sem referências às funções antigas de leitura de `api.ts`.

