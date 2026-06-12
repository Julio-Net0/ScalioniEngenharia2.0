## Context

O backend viola a regra de dependência da Clean Architecture, com a camada externa (routers/interfaces) possuindo dependência direta do banco de dados (infrastructure) e bibliotecas de pagamento (infraestrutura externa).

## Goals / Non-Goals

**Goals:**
- Desacoplar routers do banco de dados e de integrações externas.
- Garantir alinhamento de 100% com as regras de API definidas em `api-contrato.md` e `pagamento-webhook.md`.
- Implementar controle de concorrência com `with_for_update` na idempotência do webhook.

**Non-Goals:**
- Não alterar o esquema físico do banco de dados.

## Decisions

### 1. Criação de Repositórios de Infraestrutura
- **Decisão**: Implementar `PedidoRepository`, `MensagemContatoRepository` e `AdminUserRepository` estendendo a lógica SQLAlchemy.
- **Racional**: Centralizar todas as chamadas SQL e permitir que os routers dependam apenas de interfaces ou abstrações de serviço.

### 2. DDL das Tabelas Envolvidas
```sql
CREATE TYPE pedido_status AS ENUM ('pendente', 'pago', 'rejected', 'cancelled', 'in_process');

CREATE TABLE plantas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
    imagens TEXT[] NOT NULL DEFAULT '{}',
    terreno_minimo_m2 NUMERIC(8,2),
    arquivo_path TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planta_id UUID NOT NULL REFERENCES plantas(id) ON DELETE RESTRICT,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT,
    valor NUMERIC(10,2) NOT NULL,
    status pedido_status NOT NULL DEFAULT 'pendente',
    mp_payment_id TEXT UNIQUE,
    download_token UUID UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE mensagens_contato (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    mensagem TEXT NOT NULL CHECK (length(mensagem) <= 2000),
    lida BOOLEAN NOT NULL DEFAULT false,
    criada_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 3. Contratos TypeSafe (SQLAlchemy model -> Pydantic schema)
- `Planta` -> `PlantaResponse` (com preço formatado e m²).
- `Pedido` -> `PedidoResponse` (retorna `pedido_id` e `init_point`).
- `ContatoCreate` -> Valida e-mail e restrição de mensagem com 2000 caracteres.

### 4. Topologia Docker
- Serviço `backend`: Python 3.12, porta 8000, conectado à rede `bridge` do Docker Compose com o serviço `postgres` (PostgreSQL 16) e `frontend` (Next.js 15).

## Componentes Afetados
- [MODIFY] [contato.py](file:///home/alunos/ScalioniEngenharia2.0/backend/interfaces/routers/contato.py)
- [MODIFY] [pedidos.py](file:///home/alunos/ScalioniEngenharia2.0/backend/interfaces/routers/pedidos.py)
- [MODIFY] [webhook.py](file:///home/alunos/ScalioniEngenharia2.0/backend/interfaces/routers/webhook.py)
- [MODIFY] [admin.py](file:///home/alunos/ScalioniEngenharia2.0/backend/interfaces/routers/admin.py)
- [MODIFY] [download.py](file:///home/alunos/ScalioniEngenharia2.0/backend/interfaces/routers/download.py)
- [MODIFY] [config.py](file:///home/alunos/ScalioniEngenharia2.0/backend/core/config.py)
- [NEW] [pedido_repository.py](file:///home/alunos/ScalioniEngenharia2.0/backend/infrastructure/repositories/pedido_repository.py)
- [NEW] [mensagem_contato_repository.py](file:///home/alunos/ScalioniEngenharia2.0/backend/infrastructure/repositories/mensagem_contato_repository.py)
- [NEW] [admin_user_repository.py](file:///home/alunos/ScalioniEngenharia2.0/backend/infrastructure/repositories/admin_user_repository.py)
