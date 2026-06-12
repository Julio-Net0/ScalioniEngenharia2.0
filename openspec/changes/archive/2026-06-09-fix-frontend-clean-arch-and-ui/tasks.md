## 1. Camada Arquitetural (Domain / Application / Infra HTTP)

- [x] 1.1 Criar entidades de domínio e tipos sob `frontend/core/domain/entities/` para Projetos, Contato e Pedidos.
- [x] 1.2 Criar novos repositórios HTTP concretos sob `frontend/core/infra/http/`.
- [x] 1.3 Criar os use cases na camada de aplicação para submissão de contato, login do admin, exclusão e alteração de status.
- [x] 1.4 Registrar as novas instâncias no `DependencyContext.tsx` e disponibilizá-las no `useDependencies`.

## 2. Componentes de UI (shadcn/ui)

- [x] 2.1 Criar componentes base de shadcn/ui sob `frontend/components/ui/`: `dialog.tsx`, `skeleton.tsx`, `badge.tsx`, `alert.tsx`, `alert-dialog.tsx`.
- [x] 2.2 Refatorar `CheckoutDialog.tsx` para usar o componente `<Dialog>` shadcn/ui.
- [x] 2.3 Refatorar `ContatoForm.tsx` para usar o use case injetado e exibir feedbacks de sucesso e erro com `<Alert>` inline.

## 3. Painel de Administração e Layouts

- [x] 3.1 Adicionar chamada ao use case de contatos pendentes em `Sidebar.tsx` e renderizar badge `<Badge>` numérico ao lado de "Mensagens" se houver pendências.
- [x] 3.2 Refatorar `AdminPlantasPage` e `AdminProjetosPage` para substituir loaders spinners por `<Skeleton>` shadcn/ui.
- [x] 3.3 Substituir comandos `confirm(...)` nativos por caixas de diálogo `<AlertDialog>` shadcn/ui na deleção de itens do Admin.
- [x] 3.4 Ajustar a página `/pagamento/falha` para recuperar o slug do produto da query/state e renderizar o link de retorno correspondente.

## 4. Verificação

- [x] 4.1 Iniciar o servidor de desenvolvimento do Next.js.
- [x] 4.2 Validar manualmente o fluxo de checkout e redirecionamento de falha.
- [x] 4.3 Testar o formulário de contato e verificar a renderização de erros e sucesso com o componente Alert.
- [x] 4.4 Verificar a exibição do badge no sidebar e o funcionamento do Dialog/AlertDialog no painel admin.
- [x] 4.5 Executar testes backend (para garantir compatibilidade completa) com `docker compose exec backend pytest`.
