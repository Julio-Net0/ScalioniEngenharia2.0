## 1. Camada de Domínio

- [x] 1.1 Criar a pasta `frontend/core/domain/errors` e o arquivo `PrecoNegativoError.ts`
- [x] 1.2 Criar a pasta `frontend/core/domain/value-objects` e o arquivo `Preco.ts`
- [x] 1.3 Criar a pasta `frontend/core/domain/entities` e o arquivo `Planta.ts`
- [x] 1.4 Criar a pasta `frontend/core/domain/repositories` e o arquivo `IPlantaRepository.ts`

## 2. Camada de Aplicação

- [x] 2.1 Criar a pasta `frontend/core/application/use-cases` e o arquivo `ObterPlantaDetalhadaUseCase.ts`

## 3. Camada de Infraestrutura

- [x] 3.1 Criar a pasta `frontend/core/infra/http` e o arquivo `HttpPlantaRepository.ts`
- [x] 3.2 Criar a pasta `frontend/core/infra/storage` e o arquivo `LocalStorageStorage.ts`
- [x] 3.3 Criar a pasta `frontend/core/infra/di` e o arquivo `DependencyContext.tsx`

## 4. Camada de Apresentação

- [x] 4.1 Criar o hook customizado `frontend/hooks/usePlantaDetalhada.ts`
- [x] 4.2 Criar o componente visual `frontend/components/PlantaDetalheView.tsx`
- [x] 4.3 Criar a pasta de rota dinâmica `frontend/app/plantas/[slug]` e o arquivo `page.tsx`

## 5. Integração e Verificação

- [x] 5.1 Adicionar suporte a caminhos de importação relativos/alias (se necessário) no `tsconfig.json`
- [x] 5.2 Testar a nova rota `/plantas/{slug-de-alguma-planta}` no navegador e confirmar se exibe os detalhes corretos
- [x] 5.3 Validar que o tratamento de erro funciona ao acessar uma planta inexistente ou inativa
