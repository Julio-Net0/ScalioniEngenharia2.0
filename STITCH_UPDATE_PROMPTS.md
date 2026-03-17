# Prompts de Atualização — Stitch AI
## ScalioniEngenharia 2.0
**Data:** 2026-03-17 | **Objetivo:** Refinar as telas existentes para o projeto real

---

## 🧩 PROMPT-BASE DO SISTEMA
> **Cole este bloco NO INÍCIO de cada sessão de edição no Stitch AI, antes do prompt específico da tela.**

```
IDENTIDADE VISUAL — SCALIONIENGENHARIA 2.0

Escritório de engenharia de alto padrão. Estilo: Dark Luxury Maximalism.

PALETA OBRIGATÓRIA:
- Fundo principal: #0A0A0A (black luxury)
- Fundo cards/seções alt: #111111
- Fundo navbar/footer: #1A1A1A
- Accent principal: #C9A55A (dourado/cobre)
- Accent brilhante: #E8C675 (hovers, ícones ativos)
- Accent badge: #B5501B (terracota — badges de categoria)
- Texto principal: #F5F0E8 (off-white quente)
- Texto secundário: #A89F91

TIPOGRAFIA:
- Títulos h1/h2: Playfair Display, bold (700-900), serifada elegante
- UI, corpo, labels: Outfit, 300-600, sem serifa moderna

PRINCÍPIOS DE DESIGN:
- Maximalista — nenhum espaço vazio sem textura ou elemento
- Overlays gradient escuro sobre imagens de fundo
- Bordas e separadores dourados sutis (rgba(201,165,90,0.3))
- Ícones geométricos dourados oversized como decoração nas seções de serviço
- Efeito paralaxe nas seções hero
- Badge de categoria em terracota (#B5501B)
- Botões CTA: fundo #C9A55A, texto #0A0A0A, bold uppercase, sem border-radius exagerado
- Botões secundários: borda dourada, fundo transparente, texto dourado

CONTEXTO DO PRODUTO:
- Site institucional + e-commerce de PLANTAS ARQUITETÔNICAS (projetos de construção em PDF)
- NÃO é loja de plantas botânicas/vegetal
- Plantas = projetos arquitetônicos prontos para construção, vendidos como download digital
- Público: pessoas buscando construir casas ou empreendimentos comerciais
- Pagamento via Mercado Pago (PIX + cartão)
- Entrega: link de download por e-mail após pagamento aprovado
```

---

## TELA 1 — Home Page (`home_page`)

> **Tela atual:** Já está correta no layout. Ajustar apenas detalhes de conteúdo.

```
Mantenha o layout atual da home page. Faça os seguintes ajustes:

1. NAVBAR: Manter "SCALIONIENGENHARIA" como nome. Itens de menu: "Início", "Portfólio", "Loja", "Serviços", "Contato". Botão CTA: "SOLICITAR ORÇAMENTO" com fundo dourado #C9A55A.

2. HERO: Manter imagem de edificação de luxo no fundo. Headline: "Projetos que Transformam Espaços" — "Transformam" em dourado #C9A55A. Subtítulo: "Arquitetura de alto padrão e engenharia de precisão para criar espaços extraordinários." Dois CTAs: "VER PROJETOS" (dourado sólido) e "SOLICITAR ORÇAMENTO" (borda dourada, fundo transparente).

3. BARRA DE ESTATÍSTICAS: 4 números em dourado — "150+ Projetos Entregues", "15+ Anos de Mercado", "12 Prêmios de Design", "30 Cidades Atendidas".

4. SEÇÃO PORTFÓLIO: Título "Nosso Portfólio" + link "VER TODOS OS PROJETOS". Grade assimétrica com 4 imagens de edificações modernas (residências e edifícios comerciais de luxo) — NÃO usar logos de empresa como placeholder.

5. SEÇÃO SERVIÇOS: Título "Nossas Soluções". 4 cards com ícone geométrico dourado:
   - "Arquitetura de Luxo" — projetos residenciais e comerciais
   - "Engenharia de Precisão" — cálculos estruturais e gestão de obra
   - "Gestão de Grandes Obras" — cronogramas, fornecedores, orçamentos
   - "Design de Interiores" — curadoria de materiais e mobiliário

6. SEÇÃO LOJA: Título "Plantas Prontas" (não "Scalioni Store"). Subtítulo: "Projetos arquitetônicos de alto padrão com entrega imediata em PDF. A partir de R$ 990,00." Botão "ACESSAR A LOJA". Imagem de fundo: render 3D de residência moderna — NÃO usar imagem de planta vegetal/botânica.

7. FOOTER: Logo à esquerda. Coluna "Links Úteis": Portfólio, Loja de Plantas, Serviços, Contato, Painel Admin. Coluna "Newsletter" com campo de e-mail. Redes sociais: Instagram, Pinterest, LinkedIn.
```

---

## TELA 2 — Portfólio Listagem (`portf_lio`)

> **Tela atual:** Boa estrutura. Ajustar filtros e conteúdo dos cards.

```
Mantenha a estrutura atual da página de portfólio. Faça os seguintes ajustes:

1. HERO: Manter fundo dark com imagem de edifício. Título: "Portfólio Completo". Subtítulo em uppercase dourado letter-spaced: "EXCELÊNCIA EM ENGENHARIA DE ALTO PADRÃO".

2. FILTROS POR CATEGORIA (pills horizontais abaixo do hero):
   Botões: "TODOS" (ativo, fundo dourado), "RESIDENCIAL LUXO", "CORPORATIVO", "DESIGN DE INTERIORES", "RESTAURAÇÃO", "URBANISMO"
   Estilo inativo: borda dourada sutil, fundo transparente, texto off-white.

3. GRADE DE PROJETOS (masonry 3 colunas):
   Cada card deve ter:
   - Imagem de edificação real (não logo de empresa como placeholder)
   - Badge de categoria em terracota (#B5501B) no canto superior esquerdo
   - Título do projeto em bold branco no hover com overlay dourado
   - Ano e cidade em texto secundário
   Exemplos de projetos: "Mansão Alvorada — 2023 · São Paulo", "Edifício Platinum — 2022 · Curitiba", "Loft Industrial IV — 2024 · Rio de Janeiro", "Villa Toscana — 2021 · Gramado", "Residência Safira — 2022 · Belo Horizonte", "Centro Empresarial — 2023 · Brasília"

4. ESTATÍSTICAS LATERAIS: Manter "25+ Anos", "400 Obras", "15 Prêmios" na lateral esquerda em disposição vertical.

5. BOTÃO "CARREGAR MAIS PROJETOS": Borda dourada, fundo transparente, centralizado.

6. Remover qualquer referência a "NOSSA HISTÓRIA" como texto vertical rotacionado — substituir por linha decorativa dourada vertical.
```

---

## TELA 3 — Detalhe do Projeto (`detalhes_do_projeto`)

> **Tela atual:** Estrutura excelente. Apenas corrigir conteúdo placeholder.

```
Mantenha a estrutura atual. Faça os seguintes ajustes:

1. HERO: Imagem de residência ou edifício moderno de luxo a fundo. Overlay gradient escuro (de baixo para cima). Badge categoria em terracota. Título de exemplo: "Residência Scalioni Premium". Subtítulo com ícone pin: "São Paulo, Brasil".

2. BREADCRUMB: "INÍCIO > PROJETOS > RESIDÊNCIA SCALIONI PREMIUM" — letras menores, dourado-terracota.

3. LAYOUT 2 COLUNAS:
   Coluna esquerda:
   - Subtítulo "Sobre o Projeto" com sublinhado dourado
   - Parágrafo descritivo sobre o projeto arquitetônico (não sobre plantas botânicas)
   - 2 imagens em miniatura do interior do projeto
   
   Coluna direita — "Ficha Técnica" (card com borda dourada sutil):
   - LOCAL: São Paulo, SP
   - ÁREA CONSTRUÍDA: 850 m²
   - ANO DO PROJETO: 2023
   - TIPOLOGIA: Residencial de Luxo
   - STATUS: Concluído (em dourado)
   - Botão "BAIXAR PORTFÓLIO PDF" (dourado sólido, largura total)

4. GALERIA "Galeria de Imagens": grade assimétrica 1 grande + 4 médias. Todas imagens de interior/exterior do projeto arquitetônico.

5. NAVEGAÇÃO INFERIOR: "← ANTERIOR | ⊞ | PRÓXIMO →" com nomes de projetos reais nas setas.
```

---

## TELA 4 — Loja de Plantas (`loja_de_plantas`)

> **Tela atual:** Boa estrutura mas imagens de plantas botânicas. SUBSTITUIR por renders arquitetônicos.

```
ATENÇÃO: Esta loja vende PLANTAS ARQUITETÔNICAS (projetos de construção em PDF), não plantas vegetais/botânicas. Substituir toda a temática vegetal por renders 3D de residências e edifícios.

Faça os seguintes ajustes:

1. HERO: Fundo dark com gradiente dourado sutil. Título: "Plantas" em branco + "Prontas" em dourado (#C9A55A), fonte Playfair Display. Subtítulo: "ARQUITETURA DE LUXO E ENGENHARIA DE ALTA PERFORMANCE PARA SEU PRÓXIMO MARCO".

2. BARRA DE FEATURES (4 ícones com texto):
   - Ícone download + "DOWNLOAD IMEDIATO"
   - Ícone escudo + "SEGURANÇA TOTAL"
   - Ícone headset + "SUPORTE PREMIUM"
   - Ícone estrela + "DESIGN ASSINADO"

3. FILTROS POR ÁREA (pills horizontais):
   "TODOS" (ativo), "ATÉ 150M²", "150M²-300M²", "300M²-500M²", "MANSÕES +500M²", "COMERCIAIS"

4. GRADE 3 COLUNAS de produtos. Cada card:
   - Imagem: render 3D fotorrealístico de fachada de residência ou edifício (NÃO usar imagem de folha, planta ou vegetal)
   - Badge opcional: "EXCLUSIVO" ou "LANÇAMENTO" em terracota
   - Título: nome da planta (ex: "Residência Aurum", "Villa Concrete", "Edifício Platinum")
   - Specs em ícones pequenos dourados: m² total, número de suítes, número de vagas
   - Preço em dourado bold: "R$ 2.490,00"
   
   Produtos de exemplo:
   - "Residência Aurum" | 420m² · 4 suítes · 3 vagas | R$ 2.490,00 | badge EXCLUSIVO
   - "Villa Concrete" | 310m² · 3 suítes · 2 vagas | R$ 1.850,00 | badge LANÇAMENTO
   - "Edifício Platinum" | 860m² · Comercial | R$ 4.200,00
   - "Loft Industrial Sky" | 190m² · 2 suítes | R$ 1.200,00
   - "Mansão Horizon" | 1200m² · 6 suítes | R$ 8.900,00
   - "Forest Refuge" | 240m² · 3 suítes | R$ 1.550,00

5. SEÇÃO GARANTIA: Fundo gradiente dourado escuro. Título: "Garantia Scalioni de Engenharia". Texto de credibilidade sobre revisão técnica dos projetos.

6. FOOTER: Mesmo padrão da home.
```

---

## TELA 5 — Detalhe da Planta (`detalhes_da_planta`)

> **Tela atual:** Layout correto mas com imagens de planta vegetal/botânica. SUBSTITUIR totalmente.

```
ATENÇÃO: O produto é uma PLANTA ARQUITETÔNICA (projeto de construção em PDF), não uma planta vegetal. Substituir todas as imagens de folhas/plantas verdes por renders 3D de fachadas e interiores de residências de luxo.

Faça os seguintes ajustes:

1. LAYOUT 2 COLUNAS:

   Coluna esquerda — galeria:
   - Imagem principal grande: fachada frontal da residência (render 3D fotorrealístico diurno ou noturno)
   - 4 miniaturas abaixo: fachada lateral, planta baixa (vista técnica), sala de estar render, área externa/piscina
   
   Coluna direita — painel de compra:
   - Badge em terracota: "EDIÇÃO LIMITADA" ou "LANÇAMENTO"
   - Título: "Residência Aurum" (Playfair Display, grande)
   - Preço: "R$ 2.450,00" em dourado grande
   - Lista "INCLUÍDO NO PACOTE":
     □ Projeto Arquitetônico Completo em PDF
     □ Plantas Baixas em AutoCAD (DWG)
     □ Memorial Descritivo
     □ Compatível com habite-se (NBR)
   - Botão primário: "COMPRAR AGORA →" (dourado sólido, uppercase)
   - Botão secundário: "SOLICITAR ORÇAMENTO CORPORATIVO" (borda dourada, fundo transparente)
   - Selos de confiança: "Criptografia SSL" + estrelas de avaliação "4.9 (34 avaliações)"

2. SEÇÃO "Sobre esta Planta" (abaixo da galeria):
   Título com sublinhado dourado. Descrição do projeto arquitetônico: metragem, conceito de design, tipologia (residencial/comercial), diferenciais técnicos.

3. TABELA "Especificações Técnicas":
   | ATRIBUTO | DETALHES |
   | Área Total | 420 m² |
   | Número de Suítes | 4 suítes (1 master) |
   | Vagas na Garagem | 3 vagas cobertas |
   | Terreno Mínimo | 20m x 25m (500m²) |
   | Pavimentos | 2 pavimentos |
   | Padrão | Alto Padrão (NBR 12721) |

4. ACCORDION "Dúvidas Frequentes":
   - "Como recebo o projeto após a compra?" → "Você receberá um e-mail com o link de download válido por 72 horas."
   - "Posso adaptar o projeto?" → "Sim, recomendamos contratar um engenheiro local para adaptações."
   - "O projeto é compatível com aprovação na prefeitura?" → "Cada projeto segue as normas NBR, mas adaptações locais podem ser necessárias."
```

---

## TELA 6 — Modal de Checkout (`finalizar_compra`)

> **Tela atual:** Stepper de 3 etapas — SIMPLIFICAR para Dialog único.

```
SUBSTITUIR completamente o stepper de 3 etapas por um Dialog (modal) simples e direto.

Novas especificações:

1. MODAL OVERLAY: Fundo escuro semi-transparente. Card central com fundo #111111, borda dourada sutil.

2. HEADER DO MODAL:
   - Ícone cadeado dourado + texto "CHECKOUT SEGURO · SCALIONIENGENHARIA"
   - Botão X para fechar no canto superior direito

3. RESUMO DO PRODUTO (topo do modal):
   - Miniatura da imagem do produto (pequena, à esquerda)
   - Nome: "Residência Aurum"
   - Preço: "R$ 2.490,00" em dourado

4. FORMULÁRIO (campos simples, sem CNPJ):
   - Campo: "NOME COMPLETO" (placeholder: "Seu nome completo")
   - Campo: "E-MAIL" (placeholder: "seu@email.com") — receberá o link de download
   - Campo: "TELEFONE / WHATSAPP" (placeholder: "(11) 99999-9999") — opcional
   - Texto pequeno abaixo: "O link de download será enviado para seu e-mail em até 5 minutos após o pagamento."

5. BOTÃO PRINCIPAL: "PAGAR COM MERCADO PAGO →" — fundo dourado #C9A55A, texto escuro #0A0A0A, full-width, uppercase bold.

6. RODAPÉ DO MODAL:
   - Ícones de pagamento: PIX + bandeiras de cartão
   - Texto: "Criptografia SSL 256-bit · Pagamento processado pelo Mercado Pago"
```

---

## TELA 7 — Serviços (`servi_os`)

> **Tela atual:** Estrutura excelente. Pequenos ajustes de conteúdo.

```
Mantenha a estrutura atual. Faça os seguintes ajustes:

1. HERO: Manter imagem de interior arquitetônico. Título: "Nossos Serviços" em Playfair Display grande. Subtítulo: "EXCELÊNCIA E LUXO EM CADA DETALHE DA CONSTRUÇÃO CIVIL".

2. SEÇÕES DE SERVIÇO (alternando imagem + texto):
   
   Serviço 1 (texto esq, imagem dir):
   Ícone: régua/compasso dourado oversized
   Título: "Projetos Arquitetônicos"
   Texto: "Criamos espaços que transcendem o convencional. Projetos residenciais e comerciais que unem sofisticação estética ao máximo rigor técnico." Botão "SAIBA MAIS" borda dourada.
   
   Serviço 2 (imagem esq, texto dir):
   Ícone: sofá/interior dourado oversized
   Título: "Design de Interiores"
   Texto: "Curadoria de materiais nobres, iluminação cênica e mobiliário exclusivo. Transformamos ambientes em experiências sensoriais." Botão "SAIBA MAIS".
   
   Serviço 3 (texto esq, imagem dir):
   Ícone: capacete/engrenagem dourado oversized
   Título: "Gestão de Obras"
   Texto: "Acompanhamento integral com foco em cronogramas rigorosos e controle de qualidade absoluto." Botão "SAIBA MAIS".
   
   Serviço 4 (imagem esq, texto dir):
   Ícone: prancheta/laudo dourado oversized
   Título: "Regularização e Laudos"
   Texto: "Processos de regularização de edificações, laudos técnicos e consultoria para conformidade legal." Botão "SAIBA MAIS".

3. FLUXO "O Fluxo da Perfeição" (5 etapas com círculos numerados dourados):
   01 Briefing → 02 Conceito → 03 Projeto → 04 Planejamento → 05 Execução

4. DEPOIMENTOS (3 cards): texto em aspas, nome + cargo + empresa, estrelas douradas.

5. CTA FINAL: Título "Pronto para materializar seu legado?". 2 botões: "SOLICITAR ORÇAMENTO" (dourado sólido) + "FALAR COM CONSULTOR" (borda dourada).
```

---

## TELA 8 — Contato (`contato`)

> **Tela atual:** Muito boa. Ajustar campos do formulário.

```
Mantenha a estrutura atual. Faça os seguintes ajustes:

1. TÍTULO: "CONTATO" em Playfair Display, dourado. Subtítulo: "Agende uma consultoria exclusiva e transforme sua visão arquitetônica em realidade."

2. FORMULÁRIO (coluna esquerda):
   - Campo: "NOME COMPLETO"
   - Campo: "E-MAIL"
   - Select dropdown: "ASSUNTO DO PROJETO" com opções:
     · Residencial de Alto Padrão
     · Comercial / Corporativo
     · Consultoria Técnica
     · Regularização de Imóvel
     · Planta Pronta da Loja
   - Textarea: "MENSAGEM" (placeholder: "Descreva brevemente seu projeto ou dúvida...")
   - Botão: "ENVIAR MENSAGEM" (dourado sólido, full-width, uppercase)

3. PAINEL DIREITO — informações de contato:
   Card com título "Escritório Central" (borda dourada):
   - Ícone pin dourado + LOCALIZAÇÃO: "Rua da Engenharia, 1200 · São Paulo, SP"
   - Ícone envelope dourado + E-MAIL: "contato@scalioniengenharia.com.br"
   - Ícone telefone dourado + TELEFONE: "+55 (11) 9 9999-9999"
   Card "Canal Direto WhatsApp" (fundo verde escuro, ícone WhatsApp):
   "Atendimento em até 15 minutos" + seta →

4. MAPA: Embed de mapa com marcador "Scalioni Engenharia" — fundo dark, filtro sepia dourado.

5. NAVBAR: incluir item "LOGIN" em destaque para acesso ao admin.
```

---

## TELA 9 — Admin Dashboard (`admin_dashboard`)

> **Tela atual:** Dashboard complexo com gráficos. SIMPLIFICAR conforme decisão de projeto.

```
SIMPLIFICAR o dashboard atual. Remover gráficos de receita e dados complexos. Manter apenas o essencial.

1. SIDEBAR (coluna esquerda escura):
   - Logo "SCALIONI | ENGENHARIA" no topo
   - Itens de menu com ícones (geométricos, estilo outline):
     · Dashboard (ativo, destaque dourado)
     · Pedidos
     · Projetos
     · Plantas Prontas
     · Mensagens (badge numérico em terracota se houver não lidas)
     · Usuários
     · Configurações
   - Avatar + "Marco Scalioni / Admin" na base

2. ÁREA PRINCIPAL:
   
   Linha de 4 cards KPI (simples, sem gráficos):
   - "TOTAL PEDIDOS" | número grande ex: 47 | ícone carrinho
   - "PEDIDOS PAGOS" | número ex: 39 | ícone check dourado
   - "MENSAGENS NOVAS" | número ex: 3 | ícone envelope (badge terracota)
   - "PLANTAS ATIVAS" | número ex: 12 | ícone arquivo
   Todos os cards: fundo #111111, borda dourada sutil, número em dourado grande.

   Tabela "Últimos Pedidos" (5 linhas):
   Colunas: ID · Cliente · Planta · Valor · Status · Data
   Status com badge colorido: PAGO (verde escuro), PENDENTE (amarelo), REJEITADO (terracota)
   Exemplos: "#001 · Ana Silva · Residência Aurum · R$2.490 · PAGO · 17/03"

   Tabela "Mensagens Recentes" (3 linhas):
   Colunas: Nome · E-mail · Assunto · Data · Ação
   Badge "NOVA" em terracota para não lidas.
   Botão "VER TODAS" ao final.

3. SEM GRÁFICOS, SEM CHARTS, SEM REVENUE ANALYSIS.
```

---

## TELA 10 — Admin Listagem de Projetos (`admin_listagem_de_projetos`)

> **Tela atual:** Excelente. Apenas corrigir conteúdo de exemplo.

```
Mantenha a estrutura atual. Faça os seguintes ajustes:

1. HEADER: Título "GERENCIAMENTO DE PROJETOS" + subtítulo "Administre sua carteira de obras". Botão "+ NOVO PROJETO" em dourado.

2. FILTROS de status (pills):
   "TODOS" | "EM EXECUÇÃO" | "CONCLUÍDOS" | "PLANEJAMENTO"
   + Dropdown "Ordenar por: Mais recentes"

3. TABELA com colunas:
   PROJETO (thumb + nome + ID) | CATEGORIA | LOCALIZAÇÃO | PROGRESSO (barra) | STATUS | AÇÕES (ver/editar/excluir)
   
   Exemplos de linhas:
   - "Residência Vale do Ouro · #PE-2024-001" | Residencial | Nova Lima, MG | 85% | EM EXECUÇÃO
   - "Cobertura Belvedere · #PE-2023-089" | Interiores | Belo Horizonte, MG | 100% | CONCLUÍDO
   - "Edifício TechHub · #PE-2024-015" | Comercial | São Paulo, SP | 12% | PLANEJAMENTO

4. PAGINAÇÃO: "Mostrando 1-3 de 24 projetos" + controles de página.

5. SIDEBAR: Mesmo padrão do admin dashboard acima.
```

---

---

## 🆕 NOVAS TELAS (criar do zero no Stitch AI)

> Para criar: abra o Stitch AI → "New Design" → cole o Prompt-Base do Sistema + o prompt da tela abaixo.
> Nomear a pasta de saída conforme indicado para salvar em `docs/stitch/stitch/[pasta]/`.

---

### NOVA TELA A — Pagamento: Sucesso (`pagamento_sucesso`)

```
Crie uma página de confirmação de pagamento aprovado para o site ScalioniEngenharia 2.0.

Identidade visual: Dark Luxury Maximalism (fundo #0A0A0A, accent dourado #C9A55A, tipografia Playfair Display + Outfit).

LAYOUT (página centralizada, sem sidebar):
- Navbar simples no topo com logo "SCALIONIENGENHARIA"
- Área central (card com borda dourada sutil, fundo #111111, padding generoso):
  · Ícone grande de check-circle em dourado (#C9A55A), ~80px
  · Título: "Pagamento Confirmado!" em Playfair Display
  · Subtítulo em verde suave: "Seu pedido foi processado com sucesso."
  · Caixa info (fundo #1A1A1A, borda dourada sutil):
    - "📧 Link de download enviado para: **seu@email.com**"
    - "⏱ Válido por 72 horas"
    - "📦 Produto: Residência Aurum"
  · Instrução: "Verifique sua caixa de entrada e spam. Se não receber em 5 minutos, entre em contato."
  · Botão primário: "IR PARA A LOJA" (dourado sólido)
  · Botão secundário: "PÁGINA INICIAL" (borda dourada, fundo transparente)
- Footer simples
```

---

### NOVA TELA B — Pagamento: Falha (`pagamento_falha`)

```
Crie uma página de falha/rejeição de pagamento para o site ScalioniEngenharia 2.0.

Identidade visual: Dark Luxury Maximalism (fundo #0A0A0A, accent dourado #C9A55A, tipografia Playfair Display + Outfit).

LAYOUT (página centralizada):
- Navbar simples com logo
- Card central (fundo #111111, borda vermelha sutil #7B2D42):
  · Ícone grande X-circle em vermelho escuro (#7B2D42), ~80px
  · Título: "Pagamento não aprovado" em Playfair Display
  · Subtítulo em texto secundário: "Seu pagamento foi recusado pelo Mercado Pago."
  · Caixa de motivos comuns (fundo #1A1A1A):
    - "· Saldo insuficiente"
    - "· Dados do cartão incorretos"
    - "· Limite diário atingido"
    - "· Transação bloqueada pelo banco"
  · Instrução: "Tente novamente com outro método de pagamento ou entre em contato com seu banco."
  · Botão primário: "TENTAR NOVAMENTE" (dourado sólido)
  · Botão secundário: "FALAR NO WHATSAPP" (borda dourada, ícone WhatsApp)
- Footer simples
```

---

### NOVA TELA C — Admin: Login (`admin_login`)

```
Crie uma página de login para o painel administrativo do ScalioniEngenharia 2.0.

Identidade visual: Dark Luxury, fundo #0A0A0A, accent #C9A55A.

LAYOUT (tela cheia, sem navbar pública):
- Fundo: imagem de edificação em alto padrão com overlay gradient escuro muito denso (#0A0A0A a 85% opacidade)
- Card central (fundo #111111, borda dourada sutil, padding grande, largura ~420px):
  · Logo "SCALIONI | ENGENHARIA" no topo do card (texto tipográfico, sem emoji)
  · Subtítulo: "PAINEL ADMINISTRATIVO" em uppercase, letra-espacjado, texto secundário
  · Separador dourado horizontal
  · Campo: "E-MAIL" (label uppercase, input dark #1A1A1A, borda #C9A55A no focus)
  · Campo: "SENHA" (label uppercase, input com ícone olho para mostrar/ocultar)
  · Link: "Esqueci minha senha" (pequeno, texto dourado, alinhado à direita)
  · Botão: "ENTRAR" (dourado sólido, full-width, uppercase bold)
  · Texto rodapé do card: "Acesso restrito. Não compartilhe suas credenciais."
- Sem link de cadastro (admin é único)
```

---

### NOVA TELA D — Admin: Plantas Prontas (`admin_plantas`)

```
Crie a tela de gerenciamento de plantas arquitetônicas para o painel admin do ScalioniEngenharia 2.0.
Seguir o mesmo padrão visual do admin_listagem_de_projetos (sidebar escura, área principal dark).

SIDEBAR: igual ao admin dashboard (itens: Dashboard, Pedidos, Projetos, Plantas Prontas [ativo], Mensagens, Usuários, Configurações)

ÁREA PRINCIPAL:
1. HEADER: Título "PLANTAS PRONTAS" + subtítulo "Gerencie o catálogo de projetos para venda". Botão "+ NOVA PLANTA" em dourado.

2. FILTROS (pills):
   "TODAS" | "ATIVAS" | "INATIVAS" | "ESGOTADAS"
   + Dropdown "Ordenar por: Mais recentes"

3. TABELA com colunas:
   PLANTA (thumb + nome + slug) | CATEGORIA | PREÇO | ÁREA (m²) | ATIVO (toggle switch) | AÇÕES (ver/editar/excluir)
   
   Exemplos de linhas:
   - thumb | "Residência Aurum · /loja/residencia-aurum" | Residencial | R$ 2.490 | 420m² | switch ON | ícones
   - thumb | "Villa Concrete · /loja/villa-concrete" | Residencial | R$ 1.850 | 310m² | switch ON | ícones
   - thumb | "Edifício Platinum · /loja/edificio-platinum" | Comercial | R$ 4.200 | 860m² | switch OFF | ícones

4. Toggle switch: quando ativo → verde escuro; inativo → cinza. Representa se a planta aparece na loja pública.

5. PAGINAÇÃO: "Mostrando 1-3 de 12 plantas" + controles de página.
```

---

### NOVA TELA E — Admin: Pedidos (`admin_pedidos`)

```
Crie a tela de gerenciamento de pedidos para o painel admin do ScalioniEngenharia 2.0.
Seguir o padrão visual do admin com sidebar.

SIDEBAR: igual (Pedidos ativo)

ÁREA PRINCIPAL:
1. HEADER: Título "PEDIDOS" + subtítulo "Histórico de compras de plantas arquitetônicas".

2. FILTROS:
   "TODOS" | "PAGOS" | "PENDENTES" | "REJEITADOS"
   + campo de busca por nome/e-mail do cliente
   + Dropdown "Período: Últimos 30 dias"

3. TABELA com colunas:
   ID | CLIENTE (nome + e-mail) | PLANTA | VALOR | STATUS | DATA | AÇÕES

   Status com badge:
   - PAGO → badge fundo verde escuro, texto verde claro
   - PENDENTE → badge fundo amarelo escuro, texto amarelo
   - REJEITADO → badge fundo terracota #B5501B, texto branco
   - CANCELADO → badge fundo cinza escuro, texto cinza

   Exemplos:
   - #001 | Ana Silva · ana@email.com | Residência Aurum | R$ 2.490 | PAGO | 17/03/2026 | olho + reenviar-email
   - #002 | Carlos Mota · carlos@email.com | Villa Concrete | R$ 1.850 | PENDENTE | 17/03/2026 | olho
   - #003 | Beatriz Lima · bea@email.com | Mansão Horizon | R$ 8.900 | REJEITADO | 16/03/2026 | olho

4. Ícone de ação "reenviar e-mail" (envelope com seta) → disponível apenas para status PAGO.

5. PAGINAÇÃO padrão.
```

---

### NOVA TELA F — Admin: Mensagens (`admin_mensagens`)

```
Crie a tela de gerenciamento de mensagens do formulário de contato para o painel admin do ScalioniEngenharia 2.0.
Seguir padrão visual com sidebar.

SIDEBAR: igual (Mensagens ativo, badge com número de não lidas)

ÁREA PRINCIPAL:
1. HEADER: Título "MENSAGENS" + subtítulo "Contatos recebidos pelo formulário do site".

2. FILTROS:
   "TODAS" | "NÃO LIDAS" | "LIDAS"
   + campo busca por nome/e-mail

3. TABELA com colunas:
   STATUS | NOME | E-MAIL | ASSUNTO | PRÉVIA DA MENSAGEM | DATA | AÇÕES

   Status:
   - Badge "NOVA" em terracota (#B5501B) → não lida
   - Sem badge ou "LIDA" em cinza → lida

   Exemplos:
   - NOVA | Ricardo Alencar | ricardo@empresa.com | Residencial de Alto Padrão | "Tenho interesse em constr..." | 17/03 | olho + marcar lida + whatsapp
   - LIDA | Sofia Mendes | sofia@email.com | Comercial / Corporativo | "Precisamos de um laudo téc..." | 16/03 | olho + whatsapp
   - NOVA | Arthur Silva | arthur@construtora.com | Consultor ia Técnica | "Gostaria de agendar uma..." | 16/03 | olho + marcar lida + whatsapp

4. Ícone WhatsApp dourado → abre conversa no WhatsApp com o número do contato.
5. Linha não lida: fundo levemente diferente (#131313) para destacar visualmente.
```

---

### NOVA TELA G — Admin: Usuários (`admin_usuarios`)

```
Crie a tela de gerenciamento de usuários administradores para o painel admin do ScalioniEngenharia 2.0.
Interface simples para criar/gerenciar os poucos admins do sistema.

SIDEBAR: igual (Usuários ativo)

ÁREA PRINCIPAL:
1. HEADER: Título "USUÁRIOS ADMIN" + subtítulo "Controle de acesso ao painel". Botão "+ NOVO USUÁRIO" em dourado.

2. TABELA SIMPLES com colunas:
   NOME | E-MAIL | NÍVEL (Admin / Editor) | ATIVO (toggle switch) | CRIADO EM | AÇÕES (editar/excluir)

   Exemplos:
   - Marco Scalioni | marco@scalioniengenharia.com.br | Admin | switch ON | 01/01/2024 | editar + excluir (desabilitado para si mesmo)
   - Felipe Costa | felipe@scalioniengenharia.com.br | Editor | switch ON | 15/02/2024 | editar + excluir

3. Toggle switch ativo/inativo: bloqueia login sem excluir o usuário.

4. Aviso discreto no rodapé da tabela: "⚠ Mínimo de 1 usuário ativo é necessário."
```

---

## 📝 DICAS DE USO NO STITCH AI

1. **Abrir a tela existente** no Stitch AI
2. **Colar o Prompt-Base do Sistema primeiro** em "Edit with AI"  
3. **Colar o prompt específico da tela** logo abaixo
4. **Começar com as mudanças mais críticas** (substituição de imagens, depois texto, depois layout)
5. **Iterar**: se a IA não corrigir algo, reforçar no próximo prompt com "MANTENHA o layout mas corrija apenas: [item específico]"
6. **Exportar screen.png e code.html** após cada tela aprovada e salvar em `docs/stitch/stitch/[nome_tela]/`

### Ordem recomendada de atualização:
| Prioridade | Tela | Motivo |
|---|---|---|
| 🔴 1º | `detalhes_da_planta` | Tem imagens botânicas — mais urgente |
| 🔴 2º | `loja_de_plantas` | Imagens botânicas na grade |
| 🔴 3º | `finalizar_compra` | Stepper errado — simplificar para Dialog |
| 🟡 4º | `admin_dashboard` | Remover gráficos complexos |
| 🟢 5º | `home_page` | Pequenos ajustes |
| 🟢 6º | `portf_lio` | Ajuste de filtros e placeholder |
| 🟢 7º | `detalhes_do_projeto` | Apenas conteúdo |
| 🟢 8º | `contato` | Adicionar Select de assunto |
| 🟢 9º | `servi_os` | Adicionar serviço Regularização |
| 🟢 10º | `admin_listagem_de_projetos` | Apenas conteúdo de exemplo |
