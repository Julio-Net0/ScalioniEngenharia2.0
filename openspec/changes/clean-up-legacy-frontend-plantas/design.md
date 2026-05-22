# Design: Clean Up Legacy Frontend Plantas

Detalhes técnicos da unificação da leitura de plantas utilizando a nova estrutura de Clean Architecture.

## Architecture & Decisions

### 1. Unificação na rota `/plantas/[slug]`
- **Decisão**: A rota `/loja/[slug]` será completamente removida. Todos os links internos que apontavam para `/loja/[slug]` serão atualizados para `/plantas/[slug]`.
- **Racional**: Evita a manutenção de duas telas idênticas com arquiteturas diferentes. A nova rota `/plantas/[slug]` já implementa injeção de dependências e usa o caso de uso `ObterPlantaDetalhadaUseCase`.

### 2. Substituição da API legada por `HttpPlantaRepository`
- **Decisão**: Páginas que listam plantas (`/loja`, `/admin` e `/admin/plantas/[slug]`) passarão a instanciar `HttpPlantaRepository` para recuperar os dados tipados de `Planta` (entidade rica).
- **Racional**: Elimina o acoplamento com a interface anêmica e funções de busca do arquivo `frontend/lib/api.ts`.

## Component Types

| Componente | Tipo | Racional |
|------------|------|----------|
| `frontend/app/loja/page.tsx` | Server Component | Renderiza a vitrine de plantas de forma estática (SSG) no Next.js. |
| `frontend/app/admin/page.tsx` | Client Component | Dashboard administrativo interativo com buscas dinâmicas em runtime. |
| `frontend/app/admin/plantas/[slug]/page.tsx` | Client Component | Formulário administrativo interativo para edição de plantas. |

## TypeSafe Contracts

A entidade rica `Planta` de `frontend/core/domain/entities/Planta.ts` e o value object `Preco` serão adotados nas telas migradas.

Conversão da resposta da API no `HttpPlantaRepository`:
```typescript
new Planta(
  p.id,
  p.slug,
  p.titulo,
  p.descricao,
  new Preco(Number(p.preco)),
  p.imagens,
  p.terreno_minimo_m2,
  p.ativo
)
```

## Docker & Infrastructure

A topologia Docker e o ambiente de desenvolvimento local permanecem inalterados. O frontend Next.js continua rodando na porta `3000` e se comunicando com o backend FastAPI na porta `8000` via proxy local.
