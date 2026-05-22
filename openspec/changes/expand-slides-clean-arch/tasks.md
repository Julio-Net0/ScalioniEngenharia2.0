## 1. Reorganização dos Slides em apresentacao_frontend.html

- [x] 1.1 Atualizar o total de slides na contagem do cabeçalho de cada slide (ex: `01 / 24`, `02 / 24`, ..., `24 / 24`)
- [x] 1.2 Atualizar os dots de navegação e as setas para refletirem a nova contagem de 24 slides

## 2. Divisão por Camadas e Subtópicos

### Domínio
- [x] 2.1 Criar Slide 3: Introdução à Camada de Domínio (O Coração do Sistema)
- [x] 2.2 Criar Slide 4: Entidade (`Planta.ts` com regras de negócio e terreno mínimo)
- [x] 2.3 Criar Slide 5: Value Object (`Preco.ts` com autovalidação de preço negativo e formatação)
- [x] 2.4 Criar Slide 6: Erros de Domínio (`PrecoNegativoError.ts` com linguagem ubíqua)
- [x] 2.5 Criar Slide 7: Contrato de Repositório (`IPlantaRepository.ts` com assinaturas puras)

### Aplicação
- [x] 2.6 Criar Slide 8: Introdução à Camada de Aplicação (Orquestração e Casos de Uso)
- [x] 2.7 Criar Slide 9: Caso de Uso (`ObterPlantaDetalhadaUseCase.ts` com validação de planta ativa)

### Infraestrutura
- [x] 2.8 Criar Slide 10: Introdução à Camada de Infraestrutura (Tecnologia e DIP)
- [x] 2.9 Criar Slide 11: Repositório HTTP (`HttpPlantaRepository.ts` mapeando JSON para Entidades)
- [x] 2.10 Criar Slide 12: Injeção de Dependências (`DependencyContext.tsx` via React Context)
- [x] 2.11 Criar Slide 13: Adaptador de Storage (`LocalStorageStorage.ts` encapsulando APIs globais)

### Apresentação
- [x] 2.12 Criar Slide 14: Introdução à Camada de Apresentação (Interface e Reatividade)
- [x] 2.13 Criar Slide 15: Custom Hooks (`usePlantaDetalhada.ts` encapsulando estados e Caso de Uso)
- [x] 2.14 Criar Slide 16: Componentes de UI (`PlantaDetalheView.tsx` focado no layout visual e Design Tokens)
- [x] 2.15 Criar Slide 17: Roteamento no Next.js (`app/plantas/[slug]/page.tsx` extraindo parâmetros dinâmicos)

### Testes
- [x] 2.16 Criar Slide 18: Estratégia de Garantia de Qualidade (Pirâmide de Testes)
- [x] 2.17 Criar Slide 19: Testes Unitários (`ObterPlantaDetalhadaUseCase.spec.ts` em Node.js com mocks rápidos)
- [x] 2.18 Criar Slide 20: Testes de Integração (`PlantaDetalheView.spec.tsx` usando RTL)
- [x] 2.19 Criar Slide 21: Ferramentas de Teste (Diferenças e papéis de Vitest e React Testing Library)

### Fluxo, Estrutura e Fechamento
- [x] 2.20 Criar Slide 22: Fluxo Unidirecional de Dados na Prática (Interaction → Hook → Use Case → Repository → API)
- [x] 2.21 Criar Slide 23: Mapeamento Físico de Arquivos (Diretórios de Domínio, Aplicação, Infraestrutura e UI)
- [x] 2.22 Criar Slide 24: Conclusão e Fechamento

## 3. Atualização do Banco de Dados Técnico (TECH_DETAILS)

- [x] 3.1 Expandir o objeto `TECH_DETAILS` em Javascript no final do arquivo HTML com 24 chaves correspondentes aos novos slides, garantindo que o botão "Ver Código" carregue os códigos reais do projeto
- [x] 3.2 Corrigir o modal de detalhes para que o fechamento via 'Esc' ou clique fora funcione perfeitamente

## 4. Verificação

- [x] 4.1 Abrir `apresentacao_frontend.html` localmente em um navegador
- [x] 4.2 Validar que todos os slides carregam e as setas transitam corretamente entre os 24 slides
- [x] 4.3 Testar o botão "Ver Código" em cada slide que possui modal técnico
