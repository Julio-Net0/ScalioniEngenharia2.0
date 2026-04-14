import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjeto, getProjetos } from '@/lib/api'
import { ChevronRight, MapPin, Calendar, ArrowLeft, ArrowRight } from 'lucide-react'

interface Props {
    params: { slug: string }
}

export async function generateStaticParams() {
    try {
        const projetos = await getProjetos()
        return projetos.map((p) => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const p = await getProjeto(params.slug)
        return { title: p.titulo, description: p.descricao }
    } catch {
        return { title: 'Projeto' }
    }
}

export default async function ProjetoDetalhe({ params }: Props) {
    let projeto
    try {
        projeto = await getProjeto(params.slug)
    } catch {
        notFound()
    }

    const allImages = [projeto.imagem_capa, ...(projeto.imagens ?? [])].filter(Boolean)

    return (
        <>
            {/* Hero full-screen */}
            <section className="relative h-screen overflow-hidden flex items-end bg-main-bg pt-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${projeto.imagem_capa || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80'}')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-main-bg/40 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                        <Link href="/" className="hover:text-primary">Início</Link>
                        <ChevronRight size={12} />
                        <Link href="/portfolio" className="hover:text-primary">Projetos</Link>
                        <ChevronRight size={12} />
                        <span className="text-primary">{projeto.titulo}</span>
                    </nav>

                    <span className="inline-block bg-terracotta text-white text-[10px] font-bold tracking-[0.2em] px-4 py-1.5 mb-4 uppercase">
                        {projeto.categoria}
                    </span>
                    <h1 className="font-playfair text-5xl md:text-7xl font-black text-white mb-4">{projeto.titulo}</h1>
                    <div className="flex items-center gap-6 text-slate-300 text-sm">
                        <span className="flex items-center gap-2"><Calendar size={14} /> {projeto.ano}</span>
                        <span className="flex items-center gap-2"><MapPin size={14} /> São Paulo, SP</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="bg-main-bg py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Description */}
                        <div className="lg:col-span-2">
                            <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Sobre o Projeto</span>
                            <h2 className="font-playfair text-3xl font-bold text-white mb-6">{projeto.titulo}</h2>
                            <p className="text-slate-300 leading-relaxed text-lg">{projeto.descricao}</p>

                            {/* Gallery */}
                            {allImages.length > 1 && (
                                <div className="mt-12 grid grid-cols-2 gap-4">
                                    {allImages.slice(1, 5).map((img, i) => (
                                        <div
                                            key={i}
                                            className="h-48 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${img}')` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ficha Técnica */}
                        <div>
                            <div className="bg-card-bg border border-primary/30 p-8 sticky top-24">
                                <h3 className="font-playfair text-xl font-bold text-primary mb-6 pb-4 border-b border-primary/20">
                                    Ficha Técnica
                                </h3>
                                <dl className="space-y-4">
                                    {[
                                        ['Categoria', projeto.categoria],
                                        ['Ano', String(projeto.ano)],
                                        ['Local', 'São Paulo, SP'],
                                        ['Status', 'Concluído'],
                                    ].map(([key, val]) => (
                                        <div key={key}>
                                            <dt className="text-[10px] tracking-widest text-slate-500 uppercase font-bold mb-1">{key}</dt>
                                            <dd className="text-white font-medium">{val}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="gold-divider" />
            <div className="bg-main-bg py-8">
                <div className="max-w-7xl mx-auto px-6 flex justify-between">
                    <Link href="/portfolio" className="flex items-center gap-2 text-primary text-sm font-bold tracking-widest hover:text-primary-hover">
                        <ArrowLeft size={16} /> TODOS OS PROJETOS
                    </Link>
                    <Link href="/portfolio" className="flex items-center gap-2 text-primary text-sm font-bold tracking-widest hover:text-primary-hover">
                        VER MAIS <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </>
    )
}
