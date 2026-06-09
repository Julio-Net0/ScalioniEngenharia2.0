## Context

O frontend estruturou em `core/` os conceitos de Clean Architecture (Entities, Repositories, Use Cases e Dependency Injection), mas a maioria dos fluxos foi implementada com imports diretos de `lib/api.ts` dentro dos componentes. Além disso, faltam componentes de interface consistentes com a especificação shadcn/ui.

## Goals / Non-Goals

**Goals:**
- Centralizar o acesso de rede através de repositórios registrados no `DependencyContext`.
- Utilizar exclusivamente componentes shadcn/ui.
- Implementar feedbacks de confirmação (AlertDialog), loading (Skeleton) e mensagens (Alert/Badge) conforme especificado.

**Non-Goals:**
- Não reescrever layouts ou alterar o design visual existente (cores e marcas devem ser mantidas).

## Decisions

### 1. Registro de novos Repositórios e Use Cases no DependencyContext
- **Decisão**: Criar e registrar `HttpContatoRepository`, `HttpPedidoRepository`, `HttpProjetoRepository` e `HttpAdminRepository`.
- **Racional**: Permitir que todas as páginas e componentes resolvam use cases através de injeção de dependência (`useDependencies`), mantendo-os desacoplados do mecanismo HTTP concreto (fetch/axios).

### 2. Componentização com shadcn/ui
- **Decisão**: Instalar e criar componentes de UI sob `frontend/components/ui/`:
  - `dialog.tsx`: Envolver o checkout.
  - `skeleton.tsx`: Exibir loadings de listagem.
  - `badge.tsx`: Exibir mensagens pendentes no sidebar.
  - `alert.tsx`: Exibir erros/sucesso no formulário de contato.
  - `alert-dialog.tsx`: Tratar deleções no painel de administração.
- **Racional**: Respeitar a regra de UI que proíbe criar componentes do zero com Tailwind puro.

### 3. Redirecionamento em Falha de Pagamento
- **Decisão**: Alterar a rota `/pagamento/falha` para aceitar opcionalmente o parâmetro query `?produto=slug` ou ler o estado da rota anterior.
- **Racional**: Garantir que o botão "Tentar novamente" redirecione o usuário exatamente para a página do produto que tentou comprar, e não para a loja genérica.

## Componentes Afetados (Server vs Client)
- `frontend/core/infra/di/DependencyContext.tsx` (Client): Registro das novas dependências.
- `frontend/components/loja/CheckoutDialog.tsx` (Client): Substituição do Radix UI puro pelo Dialog shadcn/ui.
- `frontend/components/contato/ContatoForm.tsx` (Client): Uso do use case de contato e Alert inline.
- `frontend/components/admin/Sidebar.tsx` (Client): Consumir use case para mostrar badge numérico de mensagens não lidas.
- `frontend/app/admin/plantas/page.tsx` & `projetos/page.tsx` (Client): Loader spinner -> Skeleton; confirm() -> AlertDialog.
- `frontend/app/pagamento/falha/page.tsx` (Client): Botão "Tentar novamente" dinâmico com link do produto.
