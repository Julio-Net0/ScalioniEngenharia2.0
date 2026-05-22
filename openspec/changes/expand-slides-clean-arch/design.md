## Context

O arquivo de apresentação `apresentacao_frontend.html` é um documento estático contendo HTML, CSS e JavaScript para renderizar uma apresentação de slides interativa em tela cheia com modais de "Detalhes Técnicos". Precisamos expandir este arquivo para abranger todos os 16 tópicos e subtópicos explicados da Arquitetura Limpa e Testes.

## Goals / Non-Goals

**Goals:**
- Dividir a apresentação em pelo menos 20 slides, cobrindo cada subtópico do Clean Architecture, DDD e infraestrutura.
- Inserir exemplos de código real criados na reestruturação física do catálogo nas seções técnicas.
- Manter o tema visual luxuoso Gold/Black da Scalioni Engenharia no slide deck.

**Non-Goals:**
- Não reescrever códigos da aplicação frontend Next.js.
- Não introduzir frameworks de apresentação baseados em React (como MDX ou Reveal.js).

## Decisions

### 1. Novo fluxo de slides
O deck será reorganizado para a seguinte sequência linear:
- Capa (01) & Agenda (02)
- Bloco de Domínio (03 a 08): Visão Geral, Entidade (Planta.ts), Value Objects (Preco.ts), Erros (PrecoNegativoError.ts), Contratos (IPlantaRepository.ts).
- Bloco de Aplicação (09 a 10): Visão Geral, Casos de Uso (ObterPlantaDetalhadaUseCase.ts).
- Bloco de Infraestrutura (11 a 15): Visão Geral, Comunicação HTTP (HttpPlantaRepository.ts), Injeção de Dependências (DependencyContext.tsx), Storage (LocalStorageStorage.ts).
- Bloco de Apresentação (16 a 18): Componentes (PlantaDetalheView.tsx), User Interface (CSS/Layout), Hooks (usePlantaDetalhada.ts).
- Bloco de Testes (19 a 22): Pirâmide, Testes Unitários (Use Cases), Testes de Integração (View), Ferramentas (Vitest + RTL).
- Conclusão (23)

### 2. Mapeamento de Modais Técnicos
O objeto `TECH_DETAILS` no JavaScript do HTML será expandido para mapear os dados e códigos correspondentes a cada um dos novos slides, mantendo o botão "Ver Código" ativo e reativo para as chaves criadas.

### 3. Sem Alterações de Banco de Dados ou Componentes React
- **DDL Banco de Dados**: N/A (Sem alteração no banco de dados).
- **Componentes shadcn/ui**: N/A (A apresentação usa HTML/CSS puro com ícones via CDN).
- **Server/Client Components**: N/A (Apenas HTML estático executado no cliente).
- **Docker**: N/A (A apresentação pode ser aberta localmente por dois cliques no arquivo ou servida no host).
