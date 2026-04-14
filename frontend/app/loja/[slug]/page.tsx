import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPlanta, getPlantas } from '@/lib/api'
import { formatCurrency, formatM2 } from '@/lib/utils'
import { CheckoutDialog } from '@/components/loja/CheckoutDialog'
import { ChevronRight, Maximize2, Home, Bath, Car, CheckCircle2, FileText, Smartphone, Laptop } from 'lucide-react'

interface Props {
    params: { slug: string }
}

export async function generateStaticParams() {
    try {
        const plantas = await getPlantas()
        return plantas.map((p) => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const p = await getPlanta(params.slug)
        return { title: p.titulo, description: p.descricao }
    } catch {
        return { title: 'Planta' }
    }
}

export default async function PlantaDetalhe({ params }: Props) {
    let planta
    try {
        planta = await getPlanta(params.slug)
    } catch {
        notFound()
    }

    const images = [
        planta.imagens?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        ...(planta.imagens?.slice(1) || [])
    ]

    return (
        <>
            <section className="bg-main-bg pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[10px] text-slate-500 mb-10 font-bold uppercase tracking-widest">
                        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
                        <ChevronRight size={10} />
                        <Link href="/loja" className="hover:text-primary transition-colors">Loja de Plantas</Link>
                        <ChevronRight size={10} />
                        <span className="text-primary">{planta.titulo}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Gallery */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="aspect-[4/3] bg-card-bg border border-white/5 relative overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${images[0]}')` }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {images.slice(1, 4).map((img, i) => (
                                    <div key={i} className="aspect-square bg-card-bg border border-white/5 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }} />
                                ))}
                            </div>
                        </div>

                        {/* Purchase Options */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32">
                                <span className="bg-terracotta text-white text-[10px] font-bold px-4 py-1.5 mb-6 inline-block tracking-widest uppercase">
                                    LANÇAMENTO EXCLUSIVO
                                </span>
                                <h1 className="font-playfair text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                                    {planta.titulo}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-10">
                                    <span className="text-4xl font-playfair font-black text-primary">
                                        {formatCurrency(planta.preco)}
                                    </span>
                                    <span className="text-slate-500 text-sm line-through">
                                        {formatCurrency(Number(planta.preco) * 1.5)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Maximize2 size={18} className="text-primary" />
                                        <div>
                                            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Área do Terreno</p>
                                            <p className="text-white font-bold">{formatM2(planta.terreno_minimo_m2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Home size={18} className="text-primary" />
                                        <div>
                                            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Ambientes</p>
                                            <p className="text-white font-bold">3 Suítes + Escritório</p>
                                        </div>
                                    </div>
                                </div>

                                <CheckoutDialog
                                    plantaId={planta.id}
                                    titulo={planta.titulo}
                                    preco={planta.preco}
                                />

                                <div className="mt-12 space-y-6">
                                    <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase border-b border-white/5 pb-4 mb-6">
                                        O que está incluso:
                                    </h3>
                                    {[
                                        ['Pranchas Técnicas (PDF/DWG)', 'Arquitetônico completo com medidas.'],
                                        ['Cortes e Fachadas', 'Detalhamento vertical e estético.'],
                                        ['Projeto Elétrico e Hidráulico', 'Fundações e instalações base.'],
                                        ['Renders Realistas', 'Imagens em alta definição do projeto.'],
                                    ].map(([title, desc]) => (
                                        <div key={title} className="flex gap-4">
                                            <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-200">{title}</p>
                                                <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description & Specs */}
            <section className="bg-card-bg py-24 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="text-terracotta text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Descrição do Projeto</span>
                        <p className="text-slate-300 text-lg leading-relaxed mb-12">
                            {planta.descricao}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="flex flex-col gap-4">
                                <FileText size={40} className="text-primary" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Normas Técnicas</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold">Totalmente compatível com NBRs e prefeituras.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Smartphone size={40} className="text-primary" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Acesso Vitalício</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold">Download liberado sempre que precisar.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Laptop size={40} className="text-primary" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Suporte Especializado</h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold">Tire dúvidas técnicas com nossos engenheiros.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
