## ADDED Requirements

### Requirement: Resiliência na Busca de Dados (SSR)
O sistema MUST tratar falhas de rede ou de comunicação interna (ECONNREFUSED) durante a renderização de componentes servidor (SSR).

#### Scenario: Falha na API de Projetos
- **WHEN** `getProjetos()` lança uma exceção devido a falha de conexão ou erro 5xx
- **THEN** a página MUST renderizar sem quebrar, exibindo uma lista vazia ou estado de fallback amigável
- **E** o sistema SHOULD registrar o erro nos logs do servidor para depuração

### Requirement: Configuração Dinâmica de API
O frontend MUST suportar a distinção entre URLs de API para o servidor (interno ao Docker) e para o cliente (navegador).

#### Scenario: Build do Next.js
- **WHEN** o Next.js executa o build no ambiente Docker
- **THEN** o sistema MUST utilizar a `INTERNAL_API_URL` para prefetchar dados, garantindo que o build não falhe por falta de conectividade externa
