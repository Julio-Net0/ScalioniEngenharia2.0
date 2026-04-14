'use client'

import { useEffect, useState } from 'react'
import {
    getAdminPedidos,
    adminUpdatePedidoStatus
} from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import { cn, formatCurrency, formatDate, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils'
import {
    Search,
    Loader2,
    ShoppingBag,
    Mail,
    Phone,
    Download,
    AlertCircle,
    FileText
} from 'lucide-react'

export default function AdminPedidosPage() {
    const [pedidos, setPedidos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { toast } = useToast()

    async function loadPedidos() {
        const token = getToken()
        if (!token) return
        setLoading(true)
        try {
            const data = await getAdminPedidos(token)
            setPedidos(data)
        } catch {
            toast('Erro ao carregar pedidos', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPedidos() }, [])

    async function handleStatusChange(id: string, newStatus: string) {
        const token = getToken()
        if (!token) return
        try {
            await adminUpdatePedidoStatus(token, id, newStatus)
            toast('Status atualizado', 'success')
            loadPedidos()
        } catch {
            toast('Erro ao atualizar status', 'error')
        }
    }

    const filtered = pedidos.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.planta?.titulo?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-10">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Pedidos</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Vendas realizadas via loja de plantas</p>
            </div>

            <div className="bg-card-bg border border-white/5 p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-main-bg border border-white/10 h-12 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700 text-xs font-bold uppercase tracking-widest"
                        placeholder="Buscar por cliente ou planta..."
                    />
                </div>
            </div>

            <div className="bg-card-bg border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-main-bg/50 border-b border-white/5 text-[9px] uppercase font-black text-slate-500 tracking-[0.2em]">
                                    <th className="px-8 py-5">Identificação</th>
                                    <th className="px-6 py-5">Cliente</th>
                                    <th className="px-6 py-5">Planta</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Valor / Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-main-bg border border-white/10 flex items-center justify-center text-primary">
                                                    <ShoppingBag size={18} />
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400">#{p.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">{p.nome}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                                                    <Mail size={12} className="text-primary" /> {p.email}
                                                </div>
                                                {p.telefone && (
                                                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase border-l border-white/10 pl-4">
                                                        <Phone size={12} className="text-primary" /> {p.telefone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-primary" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{p.planta?.titulo || 'Removida'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <select
                                                value={p.status}
                                                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                className={cn(
                                                    "px-3 py-1 bg-main-bg border text-[9px] font-black uppercase tracking-widest outline-none transition-colors",
                                                    STATUS_COLORS[p.status]
                                                )}
                                            >
                                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                                    <option key={val} value={val} className="bg-main-bg text-white">{label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-bold text-white">{formatCurrency(p.valor)}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-widest">{formatDate(p.criado_em)}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center text-slate-600">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Nenhum pedido encontrado</p>
                    </div>
                )}
            </div>
        </div>
    )
}
