'use client'

import { useEffect, useState } from 'react'
import { PlantaForm } from '@/components/admin/PlantaForm'
import { getPlanta } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import type { Planta } from '@/lib/api'

export default function AdminEditarPlantaPage({ params }: { params: { slug: string } }) {
    const [planta, setPlanta] = useState<Planta | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const data = await getPlanta(params.slug)
                setPlanta(data)
            } catch {
                console.error('Erro ao carregar planta')
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
