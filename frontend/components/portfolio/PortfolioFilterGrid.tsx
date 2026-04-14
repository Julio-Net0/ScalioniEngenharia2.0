'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Projeto } from '@/lib/api'

const CATEGORIES = ['Todos', 'Residencial Luxo', 'Corporativo', 'Interiores', 'Restauração', 'Urbanismo']

interface Props {
    projetos: Projeto[]
}

export function PortfolioFilterGrid({ projetos }: Props) {
    const [activeCategory, setActiveCategory] = useState('Todos')

    const filtered = activeCategory === 'Todos'
        ? projetos
        : projetos.filter((p) => p.categoria === activeCategory)

    return (
        <div>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-3 mb-10">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeCategory === cat
                                ? 'bg-primary text-main-bg'
                                : 'border border-primary/40 text-primary hover:border-primary hover:bg-primary/10'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Count */}
            <p className="text-slate-500 text-sm mb-8">
                {filtered.length} projeto{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((projeto) => (
                    <Link
                        key={projeto.id}
                        href={`/portfolio/${projeto.slug}`}
                        className="relative overflow-hidden group h-72"
                    >
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: projeto.imagem_capa
                                    ? `url('${projeto.imagem_capa}')`
                                    : `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-main-bg/90 via-transparent to-transparent group-hover:from-primary/80 transition-all duration-500 flex flex-col justify-end p-6">
                            <span className="text-[10px] font-bold tracking-widest text-terracotta bg-terracotta/20 px-3 py-1 w-fit mb-2 uppercase">
                                {projeto.categoria}
                            </span>
                            <h3 className="font-playfair text-xl font-bold text-white">{projeto.titulo}</h3>
                            <p className="text-slate-300 text-xs mt-1">{projeto.ano}</p>
                        </div>
                    </Link>
                ))}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="col-span-3 text-center py-20">
                        <p className="text-slate-500">Nenhum projeto nesta categoria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
