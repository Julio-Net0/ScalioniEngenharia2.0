'use client'

import { useEffect, useState } from 'react'
import { getAdminMensagens, adminMarkMensagemLida } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import { formatDate } from '@/lib/utils'
import {
    Search,
    Loader2,
    MessageSquare,
    Mail,
    Clock,
    Plus,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'

export default function AdminMensagensPage() {
    const [mensagens, setMensagens] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { toast } = useToast()

    async function loadMensagens() {
        const token = getToken()
        if (!token) return
        setLoading(true)
        try {
            const data = await getAdminMensagens(token)
            setMensagens(data.mensagens)
        } catch {
            toast('Erro ao carregar mensagens', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadMensagens() }, [])

    async function handleMarkRead(id: string) {
        const token = getToken()
        if (!token) return
        try {
            await adminMarkMensagemLida(token, id)
            setMensagens(msgs => msgs.map(m => m.id === id ? { ...m, lida: true } : m))
            toast('Mensagem marcada como lida', 'success')
        } catch {
            toast('Erro ao marcar como lida', 'error')
        }
    }

    const filtered = mensagens.filter(m =>
        m.nome.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.mensagem.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-10">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Mensagens</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Contatos recebidos via site</p>
            </div>

            <div className="bg-card-bg border border-white/5 p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-main-bg border border-white/10 h-12 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700 text-xs font-bold uppercase tracking-widest"
                        placeholder="Buscar por nome, e-mail ou conteúdo..."
                    />
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : filtered.length > 0 ? (
                    filtered.map((m) => (
                        <div
                            key={m.id}
                            className={`bg-card-bg border ${m.lida ? 'border-white/5 opacity-60' : 'border-primary/20 shadow-2xl shadow-primary/5'} p-8 transition-all group`}
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 flex items-center justify-center border ${m.lida ? 'border-white/10' : 'border-primary/30'} text-primary shrink-0`}>
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">{m.nome}</h3>
                                                {!m.lida && <span className="px-2 py-0.5 bg-primary text-main-bg text-[7px] font-black uppercase tracking-[0.2em] rounded-full">NOVO</span>}
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{m.assunto}</p>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end text-[9px] text-slate-600 font-bold uppercase">
                                            <div className="flex items-center gap-2"><Clock size={10} /> {formatDate(m.criada_em)}</div>
                                            <div className="flex items-center gap-2 mt-1"><Mail size={10} /> {m.email}</div>
                                        </div>
                                    </div>
                                    <div className="bg-main-bg/50 border border-white/5 p-6 rounded-sm">
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{m.mensagem}</p>
                                    </div>
                                </div>
                                {!m.lida && (
                                    <div className="flex flex-col justify-center">
                                        <button
                                            onClick={() => handleMarkRead(m.id)}
                                            className="px-6 py-3 border border-primary text-primary text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-main-bg transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Mark as Read
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 bg-card-bg border border-white/5 flex flex-col items-center text-slate-600">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Nenhuma mensagem encontrada</p>
                    </div>
                )}
            </div>
        </div>
    )
}
