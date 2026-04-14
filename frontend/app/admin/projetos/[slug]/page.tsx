'use client'

import { useEffect, useState } from 'react'
import { ProjetoForm } from '@/components/admin/ProjetoForm'
import { getProjeto } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import type { Projeto } from '@/lib/api'

export default function AdminEditarProjetoPage({ params }: { params: { slug: string } }) {
    const [projeto, setProjeto] = useState<Projeto | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const data = await getProjeto(params.slug)
                setProjeto(data)
            } catch {
                console.error('Erro ao carregar projeto')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [params.slug])

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    )

    if (!projeto) return (
        <div className="p-20 text-center text-slate-500 uppercase font-black tracking-widest text-xs">
            Projeto não encontrado.
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Editar Projeto</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">{projeto.titulo}</p>
            </div>

            <ProjetoForm initialData={projeto} />
        </div>
    )
}
