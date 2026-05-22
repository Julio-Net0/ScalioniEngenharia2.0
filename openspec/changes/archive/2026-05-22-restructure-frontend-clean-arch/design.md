## Context

O frontend atual do Next.js utiliza uma estrutura simplificada de persistência anêmica. Os tipos de dados (como a interface `Planta`) e as chamadas de rede à API via fetch estão acoplados no arquivo `frontend/lib/api.ts`. Isso inviabiliza a execução de testes de unidade puramente lógicos sem simulação pesada de requisições de rede.

Para apoiar a apresentação técnica e demonstrar robustez arquitetural, este design propõe a implementação física das camadas desacopladas (Clean Architecture / DDD) para o contexto de `Planta`.

## Goals / Non-Goals

**Goals:**
- Implementar a Entidade Rica `Planta` e o Value Object `Preco` com autovalidação.
- Implementar a inversão de dependência através de uma interface de repositório e injeção de dependência via Contexto React.
- Isolar a chamada HTTP real em uma classe concreta de infraestrutura (`HttpPlantaRepository`).
- Criar a camada de apresentação desacoplada usando um hook customizado e um componente visual de exibição.
- Fornecer suporte no ponto de entrada do App Router (`app/plantas/[slug]/page.tsx`) para renderizar a estrutura proposta.

**Non-Goals:**
- Não remover ou alterar a integração legada em `lib/api.ts` que atende outras partes do sistema, para evitar quebras em cascata em outras telas.
- Não reescrever as outras rotas administrativas e componentes complexos que não fazem parte da apresentação.

## Decisions

### 1. Entidade Rica `Planta`
- **Decisão**: A entidade de negócio deixa de ser uma interface anêmica do TypeScript e passa a ser uma classe concreta (`class Planta`).
- **Racional**: Permite que regras e comportamentos específicos (como validar área mínima de terreno ou verificar se a planta necessita de projeto anexo) fiquem embutidos no objeto, evitando que lógica vaze para a tela.

### 2. Validação via Value Object `Preco`
- **Decisão**: Criar o objeto de valor `Preco` que valida a entrada numérica e impede a criação de preços negativos, jogando a exceção `PrecoNegativoError`.
- **Racional**: Garante a consistência dos dados do catálogo antes mesmo de qualquer gravação ou renderização.

### 3. Inversão de Controle com React Context
- **Decisão**: Criar o `DependencyContext.tsx` que agrupa os Casos de Uso.
- **Racional**: No ambiente real injetamos o `HttpPlantaRepository`. Em testes automatizados ou Storybook, podemos injetar uma versão Mock simulada sem alterar nenhuma linha de código do componente de UI.

### 4. Estrutura de Pastas Implementada
```
frontend/
├── core/
│   ├── domain/
│   │   ├── entities/Planta.ts
│   │   ├── value-objects/Preco.ts
│   │   ├── errors/PrecoNegativoError.ts
│   │   └── repositories/IPlantaRepository.ts
│   ├── application/
│   │   └── use-cases/ObterPlantaDetalhadaUseCase.ts
│   └── infra/
│       ├── http/HttpPlantaRepository.ts
│       ├── storage/LocalStorageStorage.ts
│       └── di/DependencyContext.tsx
├── hooks/
│   └── usePlantaDetalhada.ts
├── components/
│   └── PlantaDetalheView.tsx
└── app/
    └── plantas/
        └── [slug]/
            └── page.tsx
```

## Risks / Trade-offs

- **[Risk]** Duplicidade de interfaces temporária (interface Planta em `lib/api.ts` vs class Planta em `core/domain/entities/Planta.ts`). → **Mitigation**: Isso é necessário nesta etapa para não quebrar as outras páginas do admin. O novo código limpo será usado de forma isolada na nova rota `/plantas/[slug]` e demonstrado na página administrativa principal como prova de conceito.
- **[Trade-off]** Maior quantidade de arquivos criados para uma única entidade. → **Mitigation**: Embora aumente a verbosidade inicial, demonstra o padrão de arquitetura desacoplada e testabilidade que a banca examinadora exige.

## Componentes Afetados (Server vs Client)

- `frontend/core/infra/di/DependencyContext.tsx` (Client Component): Fornece os use-cases para a árvore React.
- `frontend/hooks/usePlantaDetalhada.ts` (Client Component): Consome o contexto e controla os estados locais de rede.
- `frontend/components/PlantaDetalheView.tsx` (Client Component): Exibe os detalhes visuais usando design tokens.
- `frontend/app/plantas/[slug]/page.tsx` (Client Component Wrapper): Wrapper de rota que monta o `DependencyProvider` e injeta as dependências reais.
