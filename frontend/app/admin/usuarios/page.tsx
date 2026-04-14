'use client'

import { useEffect, useState } from 'react'
import { getAdminUsuarios } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import {
    Users,
    Search,
    Loader2,
    ShieldCheck,
    Mail,
    Calendar,
    AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminUsuariosPage() {
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const { toast } = useToast()

    async function loadUsuarios() {
        const token = getToken()
        if (!token) return
        setLoading(true)
        try {
            const data = await getAdminUsuarios(token)
            setUsuarios(data)
        } catch {
            toast('Erro ao carregar usuários', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadUsuarios() }, [])

    const filtered = usuarios.filter(u =>
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-10">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Usuários</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Gestores do sistema administrativo</p>
            </div>

            <div className="bg-card-bg border border-white/5 p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-main-bg border border-white/10 h-12 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700 text-xs font-bold uppercase tracking-widest"
                        placeholder="Buscar por nome ou e-mail..."
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
                                    <th className="px-8 py-5">Usuário</th>
                                    <th className="px-6 py-5">Nível de Acesso</th>
                                    <th className="px-6 py-5">Data de Cadastro</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-playfair font-black uppercase">
                                                    {u.nome.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-white uppercase tracking-wider">{u.nome}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={10} className="text-primary" /> {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-widest">
                                                <ShieldCheck size={14} className="text-primary" /> Administrador
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[11px] text-slate-400 font-bold flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" /> 10/04/2026
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest">
                                                Ativo
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center text-slate-600">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>
        </div>
    )
}
