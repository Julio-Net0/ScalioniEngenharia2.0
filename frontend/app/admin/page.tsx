'use client'

import { useEffect, useState } from 'react'
import {
    ShoppingBag,
    MessageSquare,
    TrendingUp,
    Store,
    Clock,
    ArrowUpRight,
    Loader2
} from 'lucide-react'
import { KpiCard } from '@/components/admin/KpiCard'
import { getAdminPedidos, getAdminMensagens, getPlantas, getProjetos } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const token = getToken()
            if (!token) return
            try {
                const [pedidos, mensagens, plantas, projetos] = await Promise.all([
                    getAdminPedidos(token),
                    getAdminMensagens(token),
                    getPlantas(),
                    getProjetos(),
                ])
                setData({
                    pedidos,
                    mensagens: mensagens.mensagens,
                    nao_lidas: mensagens.nao_lidas,
                    plantas_count: plantas.length,
                    projetos_count: projetos.length
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    )

    const ultimosPedidos = data?.pedidos?.slice(0, 5) ?? []
    const vlrTotal = data?.pedidos?.filter((p: any) => p.status === 'pago').reduce((acc: number, p: any) => acc + Number(p.valor), 0) ?? 0

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Resumo Geral</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Métricas principais do sistema</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard label="Receita Total" value={formatCurrency(vlrTotal)} icon={TrendingUp} />
                <KpiCard label="Pedidos Totais" value={data?.pedidos?.length ?? 0} icon={ShoppingBag} />
                <KpiCard label="Plantas Ativas" value={data?.plantas_count ?? 0} icon={Store} />
                <KpiCard label="Novas Mensagens" value={data?.nao_lidas ?? 0} icon={MessageSquare} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Ultimos Pedidos */}
                <div className="bg-card-bg border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-white font-bold tracking-widest text-[11px] uppercase">Pedidos Recentes</h3>
                        <Link href="/admin/pedidos" className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline flex items-center gap-1">
                            Ver Todos <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-main-bg/50 border-b border-white/5 text-[9px] uppercase font-black text-slate-500 tracking-[0.2em]">
                                    <th className="px-8 py-4">ID</th>
                                    <th className="px-4 py-4">Cliente</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {ultimosPedidos.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-4 font-mono text-[10px] text-primary">#{p.id.slice(0, 5)}</td>
                                        <td className="px-4 py-4">
                                            <p className="text-[11px] font-bold text-white">{p.nome}</p>
                                            <p className="text-[9px] text-slate-600 uppercase font-black">{p.email}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn("px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest", STATUS_COLORS[p.status])}>
                                                {STATUS_LABELS[p.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[11px] text-white font-bold">{formatCurrency(p.valor)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mensagens Recentes */}
                <div className="bg-card-bg border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-white font-bold tracking-widest text-[11px] uppercase">Mensagens Recentes</h3>
                        <Link href="/admin/mensagens" className="text-primary text-[10px] font-bold tracking-widest uppercase hover:underline flex items-center gap-1">
                            Ver Todas <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div className="p-8 space-y-6">
                        {data?.mensagens?.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="flex gap-4 group">
                                <div className="w-10 h-10 bg-main-bg border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                                    <Clock size={16} className="text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-[11px] font-bold text-white">{m.nome}</h4>
                                        {!m.lida && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        <span className="text-[9px] text-slate-600 ml-auto uppercase font-bold">{formatDate(m.criada_em)}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-2 uppercase font-medium leading-relaxed">
                                        {m.mensagem}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {data?.mensagens?.length === 0 && (
                            <p className="text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest py-10">
                                Nenhuma mensagem pendente.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
