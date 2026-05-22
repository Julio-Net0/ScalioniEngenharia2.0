import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { getProjeto, getProjetos } from '@/lib/api'
import { GaleriaProjeto } from '@/components/portfolio/GaleriaProjeto'
import { FichaTecnica } from '@/components/portfolio/FichaTecnica'
import type { Projeto } from '@/lib/api'

interface Props {
    params: Promise<{ slug: string }>
}

// Fallback para projetos de demonstração
const MOCK_PROJETOS: Record<string, Partial<Projeto>> = {
    'residencia-alpha': {
        titulo: 'Residência Alpha',
        descricao: 'Projeto residencial de alto padrão em condomínio fechado.',
        categoria: 'Residencial Luxo',
        ano: 2023,
        imagem_capa: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
        imagens: [
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        ]
    },
    'corporativo-beta': {
        titulo: 'Edifício Beta',
        descricao: 'Projeto corporativo de 8 andares no centro.',
        categoria: 'Corporativo',
        ano: 2024,
        imagem_capa: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80',
        imagens: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        ]
    },
    'loft-contemporaneo': {
        titulo: 'Loft Contemporâneo',
        descricao: 'Um projeto que redefine a vida urbana, focando em espaços abertos e luz natural abundante.',
        categoria: 'Interiores',
        ano: 2024,
        imagem_capa: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
        imagens: [
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
            'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80',
        ]
    },
    'villa-toscana': {
        titulo: 'Villa Toscana',
        descricao: 'Inspirada nas clássicas vilas italianas, esta residência combina tradição com o máximo luxo moderno.',
        categoria: 'Residencial Luxo',
        ano: 2023,
        imagem_capa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80',
        imagens: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        ]
    }
}

export async function generateStaticParams() {
    try {
        const projetos = await getProjetos()
        return projects_to_params(projetos)
    } catch {
        return Object.keys(MOCK_PROJETOS).map(slug => ({ slug }))
    }
}

function projects_to_params(projetos: Projeto[]) {
    const params = projetos.map((p) => ({ slug: p.slug }))
    // Adiciona mocks se não estiverem no banco
    Object.keys(MOCK_PROJETOS).forEach(slug => {
        if (!params.find(p => p.slug === slug)) {
            params.push({ slug })
        }
    })
    return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug
    try {
        const p = await getProjeto(slug)
        return { title: `${p.titulo} — Scalioni Engenharia`, description: p.descricao }
    } catch {
        const mock = MOCK_PROJETOS[slug]
        if (mock) return { title: `${mock.titulo} — Demo`, description: mock.descricao }
        return { title: 'Projeto' }
    }
}

export default async function ProjetoDetalhe({ params }: Props) {
    const slug = (await params).slug
    let projeto: Projeto | null = null

    try {
        projeto = await getProjeto(slug)
    } catch {
        const mock = MOCK_PROJETOS[slug]
        if (mock) {
            projeto = {
                id: 'mock',
                slug,
                titulo: mock.titulo!,
                descricao: mock.descricao!,
                categoria: mock.categoria!,
                imagem_capa: mock.imagem_capa!,
                imagens: mock.imagens || [],
                ano: mock.ano!,
                ativo: true,
                criado_em: new Date().toISOString()
            }
        }
    }

    if (!projeto) notFound()

    const allImagesForGallery = projeto.imagens && projeto.imagens.length > 0 
        ? projeto.imagens 
        : [projeto.imagem_capa] // fallback se não houver galeria

    return (
        <main className="bg-main-bg min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-end pt-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${projeto.imagem_capa}')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-main-bg/20 to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 mb-8 uppercase">
                        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
                        <ChevronRight size={10} className="text-slate-600" />
                        <Link href="/portfolio" className="hover:text-primary transition-colors">Portfólio</Link>
                        <ChevronRight size={10} className="text-slate-600" />
                        <span className="text-primary">{projeto.titulo}</span>
                    </nav>

                    <div className="max-w-4xl">
                        <span className="inline-block bg-terracotta text-white text-[10px] font-black tracking-[0.3em] px-5 py-2 mb-6 uppercase">
                            {projeto.categoria}
                        </span>
                        <h1 className="font-playfair text-6xl md:text-8xl font-black text-white leading-tight mb-4">
                            {projeto.titulo}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base uppercase tracking-[0.2em] font-medium">
                            {projeto.ano} — São Paulo, SP
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 opacity-30">
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase text-white [writing-mode:vertical-lr]">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
                        {/* Left: Description & Gallery */}
                        <div className="lg:col-span-8">
                            <div className="max-w-2xl">
                                <span className="text-terracotta text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">
                                    Sobre o Projeto
                                </span>
                                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
                                    Conceito e Arquitetura
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed mb-12 font-light">
                                    {projeto.descricao}
                                </p>
                            </div>

                            <GaleriaProjeto imagens={allImagesForGallery} />
                        </div>

                        {/* Right: Technical Info */}
                        <div className="lg:col-span-4">
                            <FichaTecnica 
                                categoria={projeto.categoria}
                                ano={projeto.ano}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Navigation */}
            <div className="gold-divider" />
            <section className="py-12 bg-card-bg/30">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/portfolio" className="flex items-center gap-4 text-slate-500 hover:text-primary transition-all group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Anterior</span>
                            <span className="text-xs font-black uppercase text-white/50 group-hover:text-white transition-colors">Voltar ao Portfólio</span>
                        </div>
                    </Link>

                    <Link href="/portfolio" className="flex items-center gap-4 text-slate-500 hover:text-primary transition-all group text-right">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Próximo</span>
                            <span className="text-xs font-black uppercase text-white/50 group-hover:text-white transition-colors">Ver Mais Projetos</span>
                        </div>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>
        </main>
    )
}
