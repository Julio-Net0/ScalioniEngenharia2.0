## 1. Ajustes de Infraestrutura e Variáveis

- [x] 1.1 Adicionar a variável `INTERNAL_API_URL: http://backend:8000` no serviço `frontend` do `docker-compose.yml`
- [x] 1.2 Atualizar o arquivo `.env.example` para incluir a nova variável como referência

## 2. Configuração do Frontend

- [x] 2.1 Modificar `frontend/next.config.ts` para usar `process.env.INTERNAL_API_URL` na configuração de rewrites
- [x] 2.2 Atualizar `frontend/lib/api.ts` para suportar URLs diferentes baseadas no ambiente (server vs client)

## 3. Melhoria de Resiliência

- [x] 3.1 Adicionar logs de erro detalhados no `catch` de `getProjetos` na `frontend/app/portfolio/page.tsx`
- [x] 3.2 Garantir que o estado vazio seja acompanhado de uma mensagem de erro clara se a API falhar (além do "Nenhum projeto")

## 4. Verificação

- [x] 4.1 Reiniciar os containers com `docker compose up -d`
- [x] 4.2 Validar que a página `/portfolio` carrega os projetos reais do banco de dados
- [x] 4.3 Verificar se as chamadas client-side (se houver) continuam funcionando via proxy `/api/*`
