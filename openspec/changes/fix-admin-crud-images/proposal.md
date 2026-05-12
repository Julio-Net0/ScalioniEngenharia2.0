## Why

Atualmente, o CRUD de projetos e a gestão de imagens apresentam falhas críticas:
1. **Next.js 15 Warning**: O acesso direto a `params.slug` em componentes cliente gera avisos de depreciação, pois `params` agora é uma Promise.
2. **Imagens 404**: O backend FastAPI não está configurado para servir arquivos estáticos do diretório de uploads, impossibilitando a visualização das imagens enviadas.
3. **Erro de API no Upload**: Existe uma divergência onde o backend retorna a chave `path` e o frontend espera `url`, quebrando o fluxo de feedback imediato após o upload.
4. **Performance Visual**: O uso de tags `<img>` nativas não aproveita a otimização de imagens do Next.js.

## What Changes

- **Frontend**: Atualização do componente de página para tratar `params` como Promise usando `React.use()`.
- **Backend**: Configuração do `app.mount` para arquivos estáticos em `main.py`.
- **API**: Harmonização do retorno do endpoint de upload para incluir a chave `url`.
- **UI**: Refatoração do `ProjetoForm` para utilizar o componente `<Image />` do Next.js e lidar corretamente com o retorno do upload.

## Capabilities

### Modified Capabilities
- `admin-projeto-crud`: Atualização para suportar Next.js 15 e gestão resiliente de mídia.
- `api-upload-sistema`: Padronização do contrato de resposta de upload.

## Impact

- `backend/main.py`
- `backend/interfaces/routers/upload.py`
- `frontend/app/admin/projetos/[slug]/page.tsx`
- `frontend/components/admin/ProjetoForm.tsx`
- `frontend/lib/api.ts`
- `frontend/next.config.ts`
