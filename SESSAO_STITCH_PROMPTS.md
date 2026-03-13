# Sessão — Engenharia de Prompts para Stitch AI
**Data:** 2026-03-13 13:59  
**Contexto:** Geração de prompts para criação de interfaces no Stitch AI para o projeto ScalioniEngenharia 2.0

---

## Objetivo da Sessão

O usuário solicitou que eu atuasse como **engenheiro de prompt** para auxiliar na criação de interfaces no Stitch AI. Requisitos do cliente:

- Definir **todas as telas principais** necessárias para o projeto
- Estilo visual **maximalista** (o oposto do minimalismo)
- **Identidade visual ainda não 100% definida** — proposta inicial para ser refinada futuramente

---

## Identidade Visual Proposta (Dark Luxury Maximalism)

### Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#0A0A0A` | Fundo principal (black luxury) |
| `--bg-secondary` | `#111111` | Cards, modais, seções alternadas |
| `--bg-elevated` | `#1A1A1A` | Navbars, footers, painéis |
| `--accent-gold` | `#C9A55A` | CTAs, hovers, bordas douradas |
| `--accent-gold-bright` | `#E8C675` | Highlights, ícones ativos |
| `--accent-terracotta` | `#B5501B` | Badges, categorias |
| `--accent-wine` | `#7B2D42` | Gradientes secundários |
| `--accent-silver` | `#9EA8B3` | Textos secundários, ícones neutros |
| `--text-primary` | `#F5F0E8` | Textos principais (off-white quente) |
| `--text-secondary` | `#A89F91` | Subtítulos, metadados |
| `--border-gold` | `rgba(201,165,90,0.3)` | Bordas sutis douradas |

### Tipografia

| Uso | Fonte | Peso |
|---|---|---|
| Títulos principais | **Playfair Display** | 700–900 |
| Subtítulos / UI | **Outfit** | 400–600 |
| Corpo | **Outfit** | 300–400 |
| Labels / Metadados | **Outfit** | 500 (uppercase + letter-spacing) |

### Princípios Maximalistas Definidos

- Texturas de mármore escuro, granito ou concreto nos fundos de seção
- Sobreposição de camadas: texto sobre imagem com overlay gradient
- Bordas e linhas douradas em destaques e separadores
- Efeitos de paralaxe em imagens hero e portfólio
- Animações de entrada em todos os elementos
- Ícones oversized como decoração visual nas seções de serviço
- Nenhum espaço vazio — sempre preenchido com textura ou elemento decorativo

---

## Telas Definidas

| # | Tela | Nome no Stitch |
|---|---|---|
| 1 | Home / Landing Page | `home` |
| 2 | Portfólio (Listagem) | `portfolio` |
| 3 | Projeto (Detalhe) | `portfolio-slug` |
| 4 | Loja (Listagem de Plantas) | `loja` |
| 5 | Produto (Detalhe da Planta) | `loja-slug` |
| 6 | Modal de Checkout | `checkout-modal` |
| 7 | Serviços | `servicos` |
| 8 | Contato | `contato` |
| 9 | Admin: Dashboard | `admin-dashboard` |
| 10 | Admin: Listagem (genérica) | `admin-listagem` |
| 11 | Admin: Formulário (novo/editar) | `admin-formulario` |

---

## Artefatos Gerados

- **Documento de prompts completo:**  
  `C:\Users\Victor\.gemini\antigravity\brain\f6a16ba7-6eff-4d5f-b7a7-9b37998df71b\stitch_prompts_scalioniengenharia.md`

Contém:
1. Sistema de Identidade Visual completo
2. **Prompt-Base do Sistema** — a ser colado em toda nova tela no Stitch AI para garantir consistência
3. Prompts individuais detalhados para cada uma das 11 telas
4. Dicas de iteração no Stitch AI

---

## Decisões Tomadas

| Decisão | Justificativa |
|---|---|
| Paleta dark gold + terracotta + wine | Transmite luxo, seriedade e calor — adequado para escritório de engenharia premium |
| Playfair Display como fonte de título | Tipografia serifada elegante reforça o posicionamento de alto padrão |
| Outfit como fonte de UI | Moderna, legível, equilibra o peso dramático do Playfair |
| 11 telas definidas | Cobre todo o fluxo público (home → produto → checkout) e admin completo |
| Prompt-Base único reutilizável | Garante consistência de identidade entre todas as sessões do Stitch AI |

---

## Próximos Passos

- [ ] Gerar as telas no Stitch AI usando os prompts do arquivo de referência
- [ ] Validar identidade visual com o cliente e ajustar cores se necessário
- [ ] Exportar assets do Stitch para integração com o frontend Next.js 15
- [ ] Retomar implementação com `/opsx-apply`

---

*Sessão registrada em 2026-03-13 13:59*
