'use client'

import { useState } from 'react'
import type { Planta } from '@/lib/api'
import { PlantaCard } from './PlantaCard'

const FILTERS = [
    { label: 'Todos', min: 0, max: 9999 },
    { label: 'Até 150m²', min: 0, max: 150 },
    { label: '150m²-300m²', min: 150, max: 300 },
    { label: '300m²-500m²', min: 300, max: 500 },
    { label: 'Mansões', min: 500, max: 9999 },
]

interface Props {
    plantas: Planta[]
}

export function PlantaFilterGrid({ plantas }: Props) {
    const [activeFilter, setActiveFilter] = useState('Todos')

    const currentFilter = FILTERS.find((f) => f.label === activeFilter) || FILTERS[0]

    const filtered = plantas.filter((p) => {
        const m2 = p.terreno_minimo_m2 || 0
        return m2 >= currentFilter.min && m2 < currentFilter.max
    })

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-10">
                {FILTERS.map((f) => (
                    <button
                        key={f.label}
                        onClick={() => setActiveFilter(f.label)}
                        className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeFilter === f.label
                                ? 'bg-primary text-main-bg'
                                : 'border border-primary/40 text-primary hover:border-primary hover:bg-primary/10'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((planta) => (
                    <PlantaCard key={planta.id} planta={planta} />
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10">
                        <p className="text-slate-500">Nenhuma planta encontrada nesta faixa de área.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
