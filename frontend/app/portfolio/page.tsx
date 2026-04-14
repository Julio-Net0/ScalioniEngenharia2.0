import type { Metadata } from 'next'
import { getProjetos } from '@/lib/api'
import { PortfolioFilterGrid } from '@/components/portfolio/PortfolioFilterGrid'

export const metadata: Metadata = {
    title: 'Portfólio Completo',
    description: 'Explore nosso portfólio de projetos residenciais, comerciais e de interiores. Mais de 150 projetos entregues.',
}

export default async function PortfolioPage() {
    let projetos = []
    try {
        projetos = await getProjetos()
    } catch { }

    return (
        <>
            {/* Hero */}
            <section className="relative h-80 md:h-[420px] overflow-hidden flex items-end bg-main-bg pt-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')` }}
                />
                <div className="absolute inset-0 bg-main-bg/70" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
                    <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Nossa Obra</span>
                    <h1 className="font-playfair text-5xl md:text-7xl font-black text-white">Portfólio Completo</h1>
                </div>
            </section>

            {/* Stats bar */}
            <div className="bg-card-bg border-b border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-6 flex gap-10 text-sm">
                    {[['25+', 'Anos de experiência'], ['400', 'Obras executadas'], ['15', 'Prêmios nacionais']].map(([n, l]) => (
                        <div key={n} className="flex items-center gap-3">
                            <span className="font-playfair text-2xl font-black text-primary">{n}</span>
                            <span className="text-slate-400 text-xs uppercase tracking-widest">{l}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <section className="bg-main-bg py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <PortfolioFilterGrid projetos={projetos} />
                </div>
            </section>
        </>
    )
}
