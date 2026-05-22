## Why

O frontend atual do projeto está acoplado diretamente a chamadas de rede centralizadas em `frontend/lib/api.ts`, o que dificulta testes unitários puros e isolamento de regras de domínio. Como a apresentação técnica propõe um modelo de **Arquitetura Limpa (Clean Architecture) e DDD** para o frontend (espelhando a qualidade e o rigor do backend), precisamos reestruturar fisicamente o catálogo de plantas para criar os arquivos demonstrativos que são citados na apresentação (Slide 3 a 7). Isso garantirá que o código real esteja em perfeita sincronia com a defesa técnica do projeto.

## What Changes

- Criação da camada de **Domínio** para a entidade `Planta`:
  - Entidade rica: `core/domain/entities/Planta.ts` com comportamento encapsulado.
  - Value Object: `core/domain/value-objects/Preco.ts` para validação de valores de preço.
  - Erro de Domínio: `core/domain/errors/PrecoNegativoError.ts` para violação de regras de negócio.
  - Interface do Repositório: `core/domain/repositories/IPlantaRepository.ts` definindo assinaturas tipadas.
- Criação da camada de **Aplicação**:
  - Caso de Uso: `core/application/use-cases/ObterPlantaDetalhadaUseCase.ts` para orquestração lógica de busca de planta.
- Criação da camada de **Infraestrutura**:
  - Repositório Concreto: `core/infra/http/HttpPlantaRepository.ts` implementando chamadas HTTP para o backend.
  - Adaptador de Storage: `core/infra/storage/LocalStorageStorage.ts` para isolar persistência do navegador.
  - Injeção de Dependências: `core/infra/di/DependencyContext.tsx` via React Context para prover as instâncias.
- Criação da camada de **Apresentação**:
  - Hook customizado: `hooks/usePlantaDetalhada.ts` para encapsular estado e carregamento.
  - Componente Visual: `components/PlantaDetalheView.tsx` renderizando a tela e exibindo preço formatado via BRL.
  - Rota Dinâmica: `app/plantas/[slug]/page.tsx` integrando a visualização.
- Atualização da página de administração `app/admin/plantas/page.tsx` para demonstrar o consumo do repositório/casos de uso propostos.

## Capabilities

### New Capabilities
- `frontend-clean-architecture`: Estruturação do frontend Next.js baseada nas camadas do Clean Architecture e injeção de dependências.

### Modified Capabilities
- `frontend-plantas`: Integração do fluxo de exibição e busca de plantas usando hooks acoplados a casos de uso desacoplados.

## Non-goals
- Não refatorar todas as outras entidades do frontend (Projetos, Pedidos) de uma vez só, focando estritamente em `Planta` para a demonstração da apresentação.
- Não alterar nenhuma rota de API no backend.
- Não introduzir dependências adicionais de estado global (como Redux ou Zustand).

## Impact

- **Frontend**: Criação de arquivos dentro das novas pastas `frontend/core/` e adaptação do hook/visualizador de plantas em `frontend/hooks/` e `frontend/components/`.
