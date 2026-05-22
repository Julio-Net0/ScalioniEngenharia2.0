'use client'

import { useEffect, useState, use } from 'react'
import { PlantaForm } from '@/components/admin/PlantaForm'
import { HttpPlantaRepository } from '@/core/infra/http/HttpPlantaRepository'
import { Loader2 } from 'lucide-react'
import { Planta } from '@/core/domain/entities/Planta'

export default function AdminEditarPlantaPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug
    const [planta, setPlanta] = useState<Planta | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const isServer = typeof window === 'undefined'
                const apiUrl = isServer
                    ? (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000')
                    : ''
                const repo = new HttpPlantaRepository(apiUrl)
                const data = await repo.getPlanta(slug)
                setPlanta(data)
            } catch {
                console.error('Erro ao carregar planta')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [slug])

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    )

    if (!planta) return (
        <div className="p-20 text-center text-slate-500 uppercase font-black tracking-widest text-xs">
            Planta não encontrada.
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Editar Planta</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">{planta.titulo}</p>
            </div>

            <PlantaForm initialData={planta} />
        </div>
    )
}
