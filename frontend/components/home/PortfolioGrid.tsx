import Link from 'next/link'
import Image from 'next/image'
import type { Projeto } from '@/lib/api'

interface Props {
    projetos: Projeto[]
}

export function PortfolioGrid({ projetos }: Props) {
    const featured = projetos.slice(0, 4)

    return (
        <section className="bg-main-bg py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                            Exclusividade
                        </span>
                        <h2 className="font-playfair text-5xl md:text-6xl font-black text-white">Nosso Portfólio</h2>
                    </div>
                    <Link
                        href="/portfolio"
                        className="text-primary text-sm font-bold tracking-widest border-b-2 border-primary/30 pb-2 hover:text-primary-hover hover:border-primary-hover transition-all uppercase"
                    >
                        VER TODOS OS PROJETOS
                    </Link>
                </div>

                <div className="masonry-grid">
                    {featured.map((projeto, i) => (
                        <Link
                            key={projeto.id}
                            href={`/portfolio/${projeto.slug}`}
                            className={`relative overflow-hidden group ${i === 0 ? 'masonry-item-tall' : ''} ${i === 1 ? 'masonry-item-wide' : ''}`}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-110"
                                style={{
                                    backgroundImage: projeto.imagem_capa
                                        ? `url('${projeto.imagem_capa}')`
                                        : `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80')`,
                                }}
                            />
                            <div className="absolute inset-0 bg-main-bg/20 group-hover:bg-primary/80 transition-all duration-500 flex flex-col justify-end p-8">
                                <span className="bg-terracotta text-white text-[10px] font-bold px-4 py-1.5 w-fit mb-3 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    {projeto.categoria.toUpperCase()}
                                </span>
                                <h3 className="text-2xl font-playfair font-black text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    {projeto.titulo}
                                </h3>
                            </div>
                        </Link>
                    ))}

                    {/* Placeholder cards if no data */}
                    {featured.length === 0 && [
                        { cat: 'RESIDENCIAL', title: 'Residência Alpha', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', tall: true },
                        { cat: 'CORPORATIVO', title: 'Edifício Beta', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', wide: true },
                        { cat: 'INTERIORES', title: 'Loft Contemporâneo', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
                        { cat: 'RESIDENCIAL', title: 'Villa Toscana', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80' },
                    ].map((p, i) => (
                        <Link
                            key={i}
                            href="/portfolio"
                            className={`relative overflow-hidden group ${p.tall ? 'masonry-item-tall' : ''} ${p.wide ? 'masonry-item-wide' : ''}`}
                        >
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                style={{ backgroundImage: `url('${p.img}')` }}
                            />
                            <div className="absolute inset-0 bg-main-bg/20 group-hover:bg-primary/80 transition-all duration-500 flex flex-col justify-end p-8">
                                <span className="bg-terracotta text-white text-[10px] font-bold px-4 py-1.5 w-fit mb-3 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    {p.cat}
                                </span>
                                <h3 className="text-2xl font-playfair font-black text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    {p.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
