# Spec — Comportamento do Frontend (RFC 2119)

> Palavras-chave: **MUST** (obrigatório), **SHOULD** (recomendado), **MUST NOT** (proibido), **MAY** (opcional).
> Tecnologia: Next.js 15 App Router, TypeScript, TailwindCSS, shadcn/ui, Lucide Icons.

---

## 1. Regras Gerais de UI

- A UI MUST utilizar exclusivamente componentes do **shadcn/ui** — MUST NOT criar componentes de UI do zero com Tailwind puro
- Ícones MUST utilizar exclusivamente a biblioteca **Lucide React** — MUST NOT usar emojis como ícones
- TypeScript MUST ser usado em todos os arquivos `.tsx` e `.ts` — MUST NOT criar arquivos `.jsx` ou `.js`
- Cores MUST seguir os tokens: `--color-bg: #0A0A0A`, `--color-accent: #C9A55A`
- O logo da empresa MUST ser importado de `public/logo.svg` — MUST NOT ser um texto ou emoji

---

## 2. Estados de Loading

**Cenário 2.1 — Submit de formulário**
- **Dado** que o usuário clica em qualquer botão de envio (`Enviar`, `Comprar`, `Salvar`)
- **Quando** a requisição está em andamento
- **Então** a UI MUST exibir o componente `<Loader2 className="animate-spin" />` (Lucide) dentro do botão
- **E** MUST desabilitar o botão (`disabled`) durante o loading
- **E** MUST NOT fechar ou resetar o formulário enquanto loading

**Cenário 2.2 — Carregamento de listagens (admin)**
- **Dado** que dados estão sendo buscados da API
- **Quando** a resposta ainda não chegou
- **Então** a UI MUST exibir o componente `<Skeleton />` do shadcn/ui no lugar dos itens

**Cenário 2.3 — Página com ISR revalidando**
- **Dado** que a página `/portfolio/[slug]` ou `/loja/[slug]` está revalidando
- **Quando** o usuário acessa
- **Então** MUST exibir o conteúdo em cache enquanto revalida em background (ISR padrão Next.js)

---

## 3. Formulário de Contato (`/contato`)

**Cenário 3.1 — Validação client-side**
- **Dado** que o usuário tenta submeter o formulário com campo vazio
- **Quando** o botão "Enviar" é clicado
- **Então** a UI MUST exibir a mensagem de erro do **react-hook-form** abaixo do campo inválido
- **E** MUST NOT enviar a requisição à API
- **E** MUST manter o foco no primeiro campo com erro

**Cenário 3.2 — Submissão bem-sucedida**
- **Dado** que todos os campos são válidos
- **Quando** a API retorna `201`
- **Então** a UI MUST exibir o componente `<Alert variant="default">` (shadcn) com mensagem de sucesso
- **E** MUST resetar o formulário para o estado inicial
- **E** MUST NOT redirecionar para outra página

**Cenário 3.3 — Erro da API (5xx ou timeout)**
- **Dado** que a API retorna erro ou não responde
- **Quando** o timeout de 10s é atingido ou o status >= 500 é recebido
- **Então** a UI MUST exibir `<Alert variant="destructive">` (shadcn) com "Ocorreu um erro. Tente novamente."
- **E** MUST reabilitar o botão para nova tentativa
- **E** MUST NOT perder os dados já preenchidos

**Cenário 3.4 — E-mail inválido (client-side)**
- **Dado** que o campo e-mail contém valor sem `@`
- **Então** MUST exibir erro "E-mail inválido" inline antes de qualquer requisição

---

## 4. Fluxo de Checkout (`/loja/[slug]`)

**Cenário 4.1 — Abertura do modal de checkout**
- **Dado** que o usuário clica em "Comprar"
- **Então** MUST abrir o componente `<Dialog>` (shadcn) com formulário: nome, e-mail, telefone (opcional)
- **E** MUST NOT redirecionar antes do preenchimento

**Cenário 4.2 — Submissão do checkout**
- **Dado** que o usuário preenche nome e e-mail e clica em "Pagar com Mercado Pago"
- **Quando** a API retorna `init_point`
- **Então** MUST redirecionar para `init_point` via `window.location.href`
- **E** MUST manter o loading ativo até o redirecionamento ocorrer

**Cenário 4.3 — Retorno do Mercado Pago (sucesso)**
- **Dado** que o usuário retorna à URL de sucesso definida no MP
- **Então** MUST exibir página `/pagamento/sucesso` com mensagem "Pagamento aprovado! Verifique seu e-mail."
- **E** MUST NOT exibir informações sensíveis como token de download na URL ou na página

**Cenário 4.4 — Retorno do Mercado Pago (falha)**
- **Dado** que o usuário retorna à URL de falha
- **Então** MUST exibir página `/pagamento/falha` com link para tentar novamente
- **E** MUST exibir o botão "Tentar novamente" que retorna à página do produto

---

## 5. Painel Admin

**Cenário 5.1 — Acesso sem autenticação**
- **Dado** que o usuário acessa qualquer rota `/admin/*` sem JWT válido no cookie/localStorage
- **Então** o middleware Next.js MUST redirecionar para `/admin/login`
- **E** MUST NOT expor dados da página protegida mesmo que parcialmente

**Cenário 5.2 — Expiração de sessão durante uso**
- **Dado** que o JWT expira enquanto o admin está na sessão
- **Quando** qualquer request autenticado é feito
- **Então** a UI MUST interceptar o `401` da API
- **E** MUST redirecionar para `/admin/login` com mensagem "Sessão expirada, faça login novamente"

**Cenário 5.3 — Ação destrutiva (exclusão)**
- **Dado** que o admin clica em "Excluir" (projeto, planta, usuário)
- **Então** MUST abrir `<AlertDialog>` (shadcn) de confirmação
- **E** MUST exibir "Esta ação não pode ser desfeita."
- **E** MUST NOT executar a exclusão sem confirmação explícita

**Cenário 5.4 — Badge de mensagens não lidas**
- **Dado** que existem `MensagemContato` com `lida = False`
- **Então** o sidebar MUST exibir um badge numérico (componente `<Badge>` shadcn) ao lado de "Mensagens"

**Cenário 5.5 — Feedback de ações CRUD**
- **Dado** que qualquer ação de salvar/criar/excluir é concluída com sucesso
- **Então** MUST exibir componente `<Toast>` (shadcn/ui `useToast`) com mensagem de confirmação

---

## 6. Responsividade

- Todas as páginas MUST ser responsivas (mobile-first)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px` (Tailwind padrão)
- A grade de portfólio e loja MUST adaptar colunas: 1 col (mobile) → 2 col (md) → 3 col (lg)
- O painel admin MUST colapsar o sidebar em mobile e exibir hamburger menu

---

## 7. Acessibilidade

- Formulários MUST ter `<label>` associado a cada `<input>` via `htmlFor`
- Imagens MUST ter atributo `alt` descritivo — MUST NOT usar `alt=""`  exceto para imagens decorativas
- Botões de ação MUST ter texto visível ou `aria-label` — MUST NOT ser apenas ícone sem label
- A navegação MUST ser operável por teclado (Tab, Enter, Escape para fechar modais)
