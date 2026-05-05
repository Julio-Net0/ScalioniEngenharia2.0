## Context

O ambiente de desenvolvimento utiliza Docker Compose. O serviço `frontend` tenta se comunicar com o serviço `backend` usando `localhost:8000`, o que funciona apenas no navegador do host, mas falha no servidor do Next.js (SSR). Isso ocorre porque, dentro da rede do Docker, `localhost` se refere ao próprio container.

## Goals / Non-Goals

**Goals:**
- Corrigir a comunicação Server-to-Server entre Frontend e Backend.
- Manter a funcionalidade de Client-side fetch (browser para backend) via Proxy/Rewrites.
- Garantir que a listagem de projetos no portfólio carregue corretamente em todos os cenários.

**Non-Goals:**
- Não alterar a infraestrutura de rede do Docker (manter rede bridge padrão).
- Não remover o suporte a ambiente local sem Docker (fallback para localhost).

## Decisions

### 1. Separação de URL da API (Interna vs Externa)
- **Decisão**: Utilizar `API_URL` para chamadas no servidor e `NEXT_PUBLIC_API_URL` para chamadas no cliente.
- **Racional**: O Next.js precisa saber como chegar no backend através da rede interna do Docker (`http://backend:8000`) durante o build e o SSR, enquanto o navegador precisa usar a URL exposta no host (`http://localhost:8000`).

### 2. Configuração de Rewrites Dinâmicos
- **Decisão**: Alterar o `next.config.ts` para usar uma variável `INTERNAL_API_URL` ou o nome do serviço `backend`.
```typescript
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://backend:8000';
// ... rewrites ...
destination: `${INTERNAL_API_URL}/api/:path*`
```

### 3. Topologia Docker
- **Serviço Backend**: Nome do serviço é `backend`, porta `8000`.
- **Serviço Frontend**: Adicionar `INTERNAL_API_URL: http://backend:8000` no environment.

## Risks / Trade-offs

- **[Risk]** Inconsistência entre dev e prod → **Mitigation**: Usar variáveis de ambiente padronizadas que podem ser sobrepostas pelo CI/CD ou Docker Compose local.
- **[Trade-off]** Adição de mais uma variável de ambiente → **Mitigation**: Facilita a depuração de problemas de rede específicos de container.

## Componentes Afetados (Server vs Client)
- `frontend/app/portfolio/page.tsx` (Server Component): Realiza o fetch inicial de projetos.
- `frontend/lib/api.ts`: Centraliza a lógica de fetch e configuração da base URL.
- `frontend/next.config.ts`: Gerencia o roteamento de proxy.
