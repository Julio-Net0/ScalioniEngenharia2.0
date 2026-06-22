# Plano de Deploy e CI/CD — Scalioni Engenharia 2.0

Este documento apresenta o plano detalhado de infraestrutura, segredos e automação de deploy utilizando Neon, Render, Vercel, Docker Hub e GitHub Actions.

---

## 1. Topologia de Infraestrutura de Produção

A topologia de execução após o deploy segue o fluxo abaixo:

```text
                                   [ Cliente / Browser ]
                                             │
                                             │ (Porta 3000 / 80)
                                             ▼
                              ┌──────────────────────────────┐
                              │      Frontend Container      │
                              │   (Next.js Standalone Prod)  │
                              └──────────────────────────────┘
                                             │
                                             │ (Porta 8000 / Internal API)
                                             ▼
                              ┌──────────────────────────────┐
                              │      Backend Container       │
                              │   (FastAPI / Uvicorn Prod)   │
                              └──────────────────────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │      Postgres Container      │
                              │        (Neon Cloud DB)       │
                              └──────────────────────────────┘
```

---

## 2. Configurações por Provedor

### Neon (PostgreSQL Cloud)
1. Crie ou acesse o projeto existente no Neon.
2. Colete a URI de conexão (ex: `postgresql://user:password@host/dbname?sslmode=require`).

### Render (FastAPI Backend)
1. Crie um novo **Web Service**.
2. Aponte para a imagem Docker hospedada no Docker Hub: `docker.io/<seu-usuario>/scalioni-backend:latest`.
3. Defina o **Release Command** (executado antes de liberar a nova build):
   ```bash
   alembic upgrade head
   ```
4. Adicione as variáveis de ambiente necessárias em **Environment**:
   * `DATABASE_URL`: URI obtida no Neon.
   * `SECRET_KEY`: Chave secreta de produção.
   * `MP_ACCESS_TOKEN`: Token de produção do Mercado Pago.
   * `MP_WEBHOOK_SECRET`: Segredo de webhooks do Mercado Pago.
   * `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD`: E-mail SMTP de produção.
   * `ADMIN_EMAIL`: E-mail do administrador inicial.
   * `SEED_ENV`: `prod` (evita dados falsos de teste no banco Neon).
5. Salve a **Deploy Hook URL** (Webhook para gatilho de deploy).
6. **Plano Free**: sem Persistent Disk disponível. `/app/uploads` existe (criado no Dockerfile) então o app sobe normalmente, mas é filesystem efêmero — todo arquivo enviado via upload (imagens/PDFs de plantas) é perdido a cada redeploy ou restart do container. Reenvie os arquivos pelo admin sempre que isso ocorrer.
   * Para persistir de fato, migrar para plano pago com **Persistent Disk** (mount `/app/uploads`) ou storage de objeto (S3/R2) — sem isso é a limitação aceita no plano atual.

### Vercel (Next.js Frontend)
1. Importe o repositório Git e aponte para a pasta `frontend` como diretório raiz.
2. Configure as seguintes variáveis em **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: URL pública de produção do Backend na Render (ex: `https://scalioni-backend.onrender.com`).
   * `INTERNAL_API_URL`: Mesmo valor da URL pública.
   * `NEXT_PUBLIC_JWT_SECRET`: Mesma `SECRET_KEY` configurada no backend.
   * `NEXT_PUBLIC_WHATSAPP`: Telefone para o botão de chat.

---

## 3. GitHub Secrets

No menu **Settings > Secrets and variables > Actions** do repositório, adicione:

| Chave | Descrição |
| :--- | :--- |
| `DOCKER_USERNAME` | Nome de usuário no Docker Hub. |
| `DOCKER_PASSWORD` | Access Token de leitura/escrita do Docker Hub. |
| `RENDER_DEPLOY_HOOK` | URL do Deploy Hook gerada pelo Render. |
| `VERCEL_TOKEN` | Token de Acesso Pessoal gerado na conta Vercel. |
| `VERCEL_ORG_ID` | ID de Organização/Usuário da Vercel. |
| `VERCEL_PROJECT_ID` | ID do projeto Next.js na Vercel. |

---

## 4. Pipeline GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  backend-ci-cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Start Docker services and Run Tests
        run: |
          echo "MP_ACCESS_TOKEN=dummy_token" >> .env
          echo "SECRET_KEY=dev-secret-key" >> .env
          docker compose up -d postgres backend
          docker compose exec -T backend pytest -c backend/pytest.ini
          docker compose down

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Backend Image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          target: prod
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/scalioni-backend:latest

      - name: Trigger Render Deploy Hook
        run: |
          curl -f -X GET "${{ secrets.RENDER_DEPLOY_HOOK }}"

  frontend-ci-cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: |
          cd frontend
          npm ci

      - name: Check Lint and Types
        run: |
          cd frontend
          npm run lint -- --max-warnings=0
          npx tsc --noEmit

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```
