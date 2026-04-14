const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ── Types ──────────────────────────────────────────────────────────────────

export interface Projeto {
    id: string
    slug: string
    titulo: string
    descricao: string
    categoria: string
    imagem_capa: string
    imagens: string[]
    ano: number
    ativo: boolean
    criado_em: string
}

export interface Planta {
    id: string
    slug: string
    titulo: string
    descricao: string
    preco: string
    imagens: string[]
    terreno_minimo_m2: number | null
    arquivo_path: string | null
    ativo: boolean
    criado_em: string
}

export interface Pedido {
    id: string
    planta_id: string
    email: string
    nome: string
    telefone: string | null
    valor: string
    status: 'pendente' | 'pago' | 'rejected' | 'cancelled' | 'in_process'
    mp_payment_id: string | null
    download_token: string | null
    expires_at: string | null
    criado_em: string
    atualizado_em: string
}

export interface MensagemContato {
    id: string
    nome: string
    email: string
    telefone: string | null
    mensagem: string
    lida: boolean
    criada_em: string
}

export interface PedidoCreate {
    planta_id: string
    email: string
    nome: string
    telefone?: string
}

export interface PedidoResponse {
    id: string
    init_point: string
}

export interface ContatoCreate {
    nome: string
    email: string
    telefone?: string
    assunto?: string
    mensagem: string
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getProjetos(): Promise<Projeto[]> {
    const res = await fetch(`${API_URL}/api/projetos`, {
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('Erro ao carregar projetos')
    return res.json()
}

export async function getProjeto(slug: string): Promise<Projeto> {
    const res = await fetch(`${API_URL}/api/projetos/${slug}`, {
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('Projeto não encontrado')
    return res.json()
}

export async function getPlantas(): Promise<Planta[]> {
    const res = await fetch(`${API_URL}/api/plantas`, {
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('Erro ao carregar plantas')
    return res.json()
}

export async function getPlanta(slug: string): Promise<Planta> {
    const res = await fetch(`${API_URL}/api/plantas/${slug}`, {
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('Planta não encontrada')
    return res.json()
}

export async function createPedido(data: PedidoCreate): Promise<PedidoResponse> {
    const res = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao criar pedido')
    }
    return res.json()
}

export async function sendContato(data: ContatoCreate): Promise<void> {
    const res = await fetch(`${API_URL}/api/contato`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao enviar mensagem')
    }
}

// ── Admin API ──────────────────────────────────────────────────────────────

function authHeaders(token: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export async function adminLogin(email: string, senha: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    })
    if (!res.ok) throw new Error('Credenciais inválidas')
    const data = await res.json()
    return data.access_token
}

export async function getAdminMensagens(token: string): Promise<{ mensagens: MensagemContato[]; nao_lidas: number }> {
    const res = await fetch(`${API_URL}/api/admin/mensagens`, {
        headers: authHeaders(token),
        cache: 'no-store',
    })
    if (!res.ok) throw new Error('Erro ao carregar mensagens')
    return res.json()
}

export async function marcarMensagemLida(token: string, id: string): Promise<void> {
    await fetch(`${API_URL}/api/admin/mensagens/${id}/lida`, {
        method: 'PATCH',
        headers: authHeaders(token),
    })
}

export async function getAdminPedidos(token: string): Promise<Pedido[]> {
    const res = await fetch(`${API_URL}/api/admin/pedidos`, {
        headers: authHeaders(token),
        cache: 'no-store',
    })
    if (!res.ok) throw new Error('Erro ao carregar pedidos')
    return res.json()
}

export async function reenviarEmailDownload(token: string, id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/admin/pedidos/${id}/reenviar-email`, {
        method: 'POST',
        headers: authHeaders(token),
    })
    if (!res.ok) throw new Error('Erro ao reenviar e-mail')
}

export async function adminCreateProjeto(token: string, data: Omit<Projeto, 'id' | 'criado_em'>): Promise<Projeto> {
    const res = await fetch(`${API_URL}/api/projetos`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao criar projeto')
    }
    return res.json()
}

export async function adminUpdateProjeto(token: string, slug: string, data: Partial<Projeto>): Promise<Projeto> {
    const res = await fetch(`${API_URL}/api/projetos/${slug}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao atualizar projeto')
    }
    return res.json()
}

export async function adminDeleteProjeto(token: string, slug: string): Promise<void> {
    await fetch(`${API_URL}/api/projetos/${slug}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
}

export async function adminCreatePlanta(token: string, data: Omit<Planta, 'id' | 'criado_em'>): Promise<Planta> {
    const res = await fetch(`${API_URL}/api/plantas`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao criar planta')
    }
    return res.json()
}

export async function adminUpdatePlanta(token: string, slug: string, data: Partial<Planta>): Promise<Planta> {
    const res = await fetch(`${API_URL}/api/plantas/${slug}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? 'Erro ao atualizar planta')
    }
    return res.json()
}

export async function adminDeletePlanta(token: string, slug: string): Promise<void> {
    await fetch(`${API_URL}/api/plantas/${slug}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
}

export async function uploadFile(token: string, file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    })
    if (!res.ok) throw new Error('Erro ao fazer upload')
    return res.json()
}
