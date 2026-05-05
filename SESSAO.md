# Contexto da Sessão — Scalioniengenharia 2.0
**Última atualização:** 2026-05-05 21:12

---

## ⏸️ Estado atual

- **Fase:** Frontend em progresso — Core do Portfólio e Detalhes implementado.
- **Próximo passo:** Loja de plantas e Fluxo de Checkout.

---

## ✅ O que foi feito nesta sessão (2026-05-05)

| O que | Resultado |
|---|---|
| Feature: `project-details-page` | Navegação Home → Detalhes funcional. Mocks de fallback para projetos sem dados. |
| Componente `GaleriaProjeto` | Grade assimétrica (5 fotos) + Lightbox. |
| Componente `FichaTecnica` | Card lateral com specs do projeto (Dark Luxury). |
| Fix: `fix-portfolio-listing` | Corrigida falha de carregamento no `/portfolio` (SSR Docker). |
| Infra: `INTERNAL_API_URL` | Adicionado `http://backend:8000` para SSR interno no container. |
| Proxy: `next.config.ts` | Rewrites priorizam comunicação inter-service. |
| API: `lib/api.ts` | Detecção automática de ambiente (Server vs Client) para base URL. |

### Credenciais e URLs (Atualizado)

| Serviço | URL | Status |
|---|---|---|
| Frontend | http://localhost:3000 | Online |
| Backend | http://localhost:8000 | Online |
| API Projetos | http://localhost:8000/api/projetos | 200 OK |
| Portfolio | /portfolio | Listando projetos reais |

---

## O que foi decidido (Design & Infra)

### Infraestrutura Docker
- **Comunicação Interna**: Frontend MUST usar `INTERNAL_API_URL` (host `backend`) para SSR.
- **Proxy**: Browser MUST usar `/api/*` (rewrite Next.js) para evitar CORS.

### UI Detalhes do Projeto
- **Galeria**: Layout "Masonry-like" fixo para 5 imagens principais.
- **Fallback**: Se projeto não existe no DB, exibe dados estáticos (demo) em vez de 404.
- **Navegação**: Rodapé com botões "Anterior" e "Próximo" projeto.

---

## Arquivos alterados/criados

| Arquivo | Descrição |
|---|---|
| `docker-compose.yml` | Inserida `INTERNAL_API_URL`. |
| `frontend/next.config.ts` | Ajustados rewrites para rede interna. |
| `frontend/lib/api.ts` | Lógica de fetch resiliente a containers. |
| `frontend/app/portfolio/[slug]/page.tsx` | Página de detalhes com SSR e Galeria. |
| `frontend/components/portfolio/GaleriaProjeto.tsx` | Componente de fotos premium. |
| `frontend/components/portfolio/FichaTecnica.tsx` | Informações técnicas do projeto. |

---

## Próximos Passos

1. **Implementar Loja de Plantas**:
   - Criar `/loja` com filtros de m².
   - Criar `/loja/[slug]` (detalhes da planta).
2. **Integração Mercado Pago**:
   - Webhook backend.
   - Modal de checkout no frontend.
3. **Admin UI**:
   - Dashboard e listagens protegidas.
