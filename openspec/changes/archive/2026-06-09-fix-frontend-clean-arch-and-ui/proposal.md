## Why

O frontend possui violações de Clean Architecture, pois a maioria das páginas (com exceção do detalhe da planta) ignora as camadas de Use Cases e Repositórios estruturadas sob `frontend/core`, realizando fetchs diretos a partir de um utilitário central. Além disso, há várias quebras em relação à especificação de comportamento (`frontend-comportamento.md`): falta de componentes shadcn/ui oficiais (Toaster customizado, Dialog Radix bruto, ausência de Badge, Skeleton, Alert, AlertDialog), confirmações de deleção com `confirm(...)` nativo, spinners genéricos em loaders, falta de badge de mensagens no sidebar, ausência de Alerts integrados nos formulários, e redirecionamento de falha de checkout incorreto.

## What Changes

- Migração das operações de API (Contato, Checkout, Admin CRUD, Login) para use-cases e repositórios da camada `frontend/core`.
- Instalação e substituição de componentes Radix/Tailwind puros pelos componentes oficiais shadcn/ui (`Dialog`, `Skeleton`, `Badge`, `Alert`, `AlertDialog`).
- Substituição do `confirm()` nativo por um componente `<AlertDialog>` no Admin contendo o aviso obrigatório de ação irreversível.
- Substituição de loaders de spinner por skeletons UI nas listagens do admin.
- Substituição de popups de Toast por `<Alert>` de sucesso ou erro inline no Formulário de Contato.
- Integração de badge de mensagens pendentes no sidebar consultando a API via use-case.
- Ajuste do botão de retentativa da página de falha de pagamento para retornar ao produto específico.

## Capabilities

### Modified Capabilities
- `frontend-comportamento`: Alinhamento total do comportamento de loadings, validações client-side, checkout, painel admin e acessibilidade.

## Non-goals

- Não serão feitas alterações de lógica ou rotas no Backend nesta proposta.
- Não haverá alteração no layout visual principal além da adequação às regras especificadas (shadcn/ui e lucide).

## Impact

- **Frontend**: Afeta componentes sob `frontend/components/`, roteamento em `frontend/app/` e as definições arquiteturais em `frontend/core/`.
