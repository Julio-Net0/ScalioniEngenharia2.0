# Proposal — Site Scalioniengenharia 2.0

## O que estamos construindo

Site institucional com e-commerce integrado para o escritório de engenharia **Scalioni Engenharia**, contendo portfólio de projetos, loja de plantas prontas (produtos digitais), captação de leads e painel administrativo completo.

## Por que estamos construindo

O escritório precisa de presença digital que simultaneamente:
1. Exiba credibilidade via portfólio curado
2. Gere receita passiva com venda de plantas prontas sem atendimento humano
3. Capture leads qualificados para projetos customizados
4. Centralize gestão de projetos, pedidos e mensagens num painel próprio

## Público-alvo

- **Pessoa física** buscando projeto residencial (casa própria)
- **Pequeno empresário** buscando projeto comercial

## Solução

### Site público
- Portfólio em grid com hover dourado e páginas individuais de projeto
- Loja de plantas prontas: galeria de renders, specs de terreno, compra sem cadastro
- Pagamento via Mercado Pago (PIX + cartão parcelado)
- Entrega automática: e-mail com link de download (token UUID, 72h)
- Formulário de contato com 3 ações automáticas: salvar no banco + e-mail ao cliente + notificação ao admin

### Segurança de pagamento
- Webhook validado por HMAC-SHA256 (`x-signature`)
- Double-check via API do Mercado Pago antes de qualquer ação
- Idempotência por `mp_payment_id`

### Painel Admin
- CRUD de projetos, plantas, pedidos, mensagens e usuários admin
- Gestão de leads com badge "nova" e link WhatsApp pré-preenchido

## Non-goals

- Autenticação de clientes finais (compra é anônima, só e-mail)
- Sistema de cupons ou desconto
- Chat em tempo real
- App mobile
- Internacionalização (i18n)
- Marketplace multi-vendedor
- Sistema de avaliações/reviews
