# Estágio de desenvolvimento
FROM node:20-alpine AS dev

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

# Comando padrão para dev
CMD ["npm", "run", "dev"]

# Estágio de build para produção (opcional, mas bom pra ter)
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_WHATSAPP
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET} \
    NEXT_PUBLIC_WHATSAPP=${NEXT_PUBLIC_WHATSAPP}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
