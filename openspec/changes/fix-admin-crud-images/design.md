# Design: Correção CRUD e Imagens

## Solução Técnica

### 1. Desembrulhar Params (Next.js 15)
No arquivo `app/admin/projetos/[slug]/page.tsx`, utilizaremos o hook `use` do React para resolver a Promise de `params` antes de acessar o slug.

```tsx
import { use } from 'react';
// ...
export default function AdminEditarProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    // ...
}
```

### 2. Servidor de Arquivos Estáticos (FastAPI)
Adicionar a montagem do diretório de uploads no `main.py` para que as imagens sejam acessíveis via HTTP.

```python
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")
```

### 3. Padronização do Upload
Alterar o retorno de `backend/interfaces/routers/upload.py` de `path` para `url` para manter compatibilidade com o frontend.

### 4. Otimização com Next/Image
Configurar o `next.config.ts` para permitir o domínio do backend e substituir tags `<img>` por `<Image />`.

## Considerações de Segurança
- Manter a verificação de token JWT no endpoint de upload.
- Garantir que o diretório de uploads tenha as permissões corretas no container.
