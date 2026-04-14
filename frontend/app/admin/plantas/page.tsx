'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { getPlantas, adminDeletePlanta } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import { cn, formatCurrency, formatM2 } from '@/lib/utils'
import type { Planta } from '@/lib/api'

export default function AdminPlantasPage() {
    const [plantas, setPlantas] = useState<Planta[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { toast } = useToast()

    async function loadPlantas() {
        setLoading(true)
        try {
            const data = await getPlantas()
            setPlantas(data)
        } catch {
            toast('Erro ao carregar plantas', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPlantas() }, [])

    async function handleDelete(slug: string) {
        if (!confirm('Tem certeza que deseja excluir esta planta?')) return
        const token = getToken()
        if (!token) return
        try {
            await adminDeletePlanta(token, slug)
            toast('Planta excluída com sucesso', 'success')
            loadPlantas()
        } catch (err: any) {
            toast(err.message || 'Erro ao excluir planta', 'error')
        }
    }

    const filtered = plantas.filter(p =>
        p.titulo.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Plantas Prontas</h1>
                    <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Gerencie os projetos à venda na loja</p>
                </div>
                <Link
                    href="/admin/plantas/nova"
                    className="px-8 py-4 bg-primary text-main-bg font-black text-xs tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center gap-2"
                >
                    <Plus size={18} /> Nova Planta
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-card-bg border border-white/5 p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-main-bg border border-white/10 h-12 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700 text-xs font-bold uppercase tracking-widest"
                        placeholder="Buscar por título..."
                    />
                </div>
                <div className="flex items-center gap-4 bg-main-bg border border-white/10 px-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="text-white">{filtered.length}</span> Plantas Cadastradas
                </div>
            </div>

            {/* Table */}
            <div className="bg-card-bg border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-main-bg/50 border-b border-white/5 text-[9px] uppercase font-black text-slate-500 tracking-[0.2em]">
                                    <th className="px-8 py-5">Projeto</th>
                                    <th className="px-6 py-5">Área (m²)</th>
                                    <th className="px-6 py-5">Preço</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 aspect-video bg-main-bg border border-white/10 shrink-0 overflow-hidden">
                                                    {p.imagens?.[0] && <img src={p.imagens[0]} className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="text-[11px] font-bold text-white uppercase tracking-wider">{p.titulo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[11px] text-white font-bold">{formatM2(p.terreno_minimo_m2)}</td>
                                        <td className="px-6 py-5 text-[11px] text-primary font-bold">{formatCurrency(p.preco)}</td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest",
                                                p.ativo ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {p.ativo ? 'À Venda' : 'Pausado'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/loja/${p.slug}`} target="_blank" className="p-2 bg-main-bg border border-white/10 text-slate-400 hover:text-white transition-all" title="Ver no site">
                                                    <Eye size={14} />
                                                </Link>
                                                <Link href={`/admin/plantas/${p.slug}`} className="p-2 bg-main-bg border border-white/10 text-primary hover:bg-primary hover:text-main-bg transition-all" title="Editar">
                                                    <Edit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p.slug)}
                                                    className="p-2 bg-main-bg border border-white/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center text-slate-600">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Nenhuma planta cadastrada</p>
                    </div>
                )}
            </div>
        </div>
    )
}
