## Why

O slide deck atual (`apresentacao_frontend.html`) resume os conceitos em apenas 10 slides genéricos. Para realizar uma defesa técnica de alta qualidade perante a banca examinadora, é necessário expandir a apresentação. Cada subtópico conceitual implementado no Clean Architecture + DDD (Entidade, Value Objects, Erros, Contrato de Repositório, Caso de Uso, HTTP, DI, Repositório Concreto, Storage, Componentes, UI, Hooks, Teste Unitário, Teste de Integração, Vitest e RTL) deve ter um slide dedicado com código real e explicação técnica detalhada correspondente.

## What Changes

- Expansão do arquivo `apresentacao_frontend.html` de 10 para 22 slides.
- Reestruturação da navegação e barra de progresso no arquivo HTML para suportar a nova quantidade de slides.
- Criação de slides individuais focados para cada um dos 16 conceitos explicados.
- Atualização do banco de dados técnico (`TECH_DETAILS`) em JavaScript dentro do arquivo HTML para conter o código-fonte atualizado e explicações para os novos modais correspondentes de cada slide.

## Capabilities

### New Capabilities
- `detailed-frontend-presentation`: Capacidade de apresentar a arquitetura do frontend de forma detalhada e isolada por conceito.

## Non-goals

- Não alterar códigos-fonte de componentes, hooks ou casos de uso da aplicação Next.js.
- Não alterar a apresentação do backend (`apresentacao_backend.html`).
- Não alterar regras de estilo globais fora do próprio arquivo de apresentação HTML.

## Impact

- **Frontend**: Apenas modificação do arquivo `apresentacao_frontend.html` na raiz do projeto.
