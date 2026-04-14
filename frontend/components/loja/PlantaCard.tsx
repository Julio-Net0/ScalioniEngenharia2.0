import Link from 'next/link'
import { Home, Maximize2, Bath, Car } from 'lucide-react'
import { formatCurrency, formatM2 } from '@/lib/utils'
import type { Planta } from '@/lib/api'

interface Props {
    planta: Planta
}

export function PlantaCard({ planta }: Props) {
    return (
        <div className="bg-card-bg border border-white/5 group overflow-hidden flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: planta.imagens?.[0]
                            ? `url('${planta.imagens[0]}')`
                            : `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80')`,
                    }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {planta.terreno_minimo_m2 && planta.terreno_minimo_m2 > 300 && (
                        <span className="bg-terracotta text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                            Luxo
                        </span>
                    )}
                    <span className="bg-primary text-main-bg text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                        {planta.terreno_minimo_m2 ? `< ${planta.terreno_minimo_m2} m²` : 'Planta'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="font-playfair text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {planta.titulo}
                </h3>

                <div className="grid grid-cols-2 gap-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Maximize2 size={14} className="text-primary" />
                        <span>{formatM2(planta.terreno_minimo_m2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Home size={14} className="text-primary" />
                        <span>3 Quartos</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Bath size={14} className="text-primary" />
                        <span>2 Banheiros</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Car size={14} className="text-primary" />
                        <span>2 Vagas</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">Preço</span>
                        <span className="text-xl font-playfair font-black text-primary">
                            {formatCurrency(planta.preco)}
                        </span>
                    </div>
                    <Link
                        href={`/loja/${planta.slug}`}
                        className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black tracking-widest hover:bg-primary hover:text-main-bg transition-all uppercase"
                    >
                        Ver Detalhes
                    </Link>
                </div>
            </div>
        </div>
    )
}
