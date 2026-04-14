import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center bg-main-bg pt-20">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80')`,
                    }}
                />
                <div className="absolute inset-0 diagonal-gradient" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-4xl">
                    <span className="inline-block bg-terracotta text-white text-[11px] font-bold tracking-[0.3em] px-5 py-2 mb-8 uppercase">
                        Excelência em Engenharia
                    </span>
                    <h1 className="font-playfair text-6xl md:text-8xl lg:text-[100px] leading-[0.9] font-black text-white mb-8">
                        Projetos que <br />
                        <span className="text-primary">Transformam</span> <br />
                        Espaços
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed">
                        Arquitetura de alto padrão e engenharia de precisão para criar espaços extraordinários.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-main-bg font-bold text-sm tracking-widest hover:bg-primary-hover transition-all uppercase"
                        >
                            VER PROJETOS <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/contato"
                            className="px-10 py-5 border-2 border-primary text-primary font-bold text-sm tracking-widest hover:bg-primary hover:text-main-bg transition-all uppercase backdrop-blur-sm"
                        >
                            SOLICITAR ORÇAMENTO
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary animate-bounce">
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Scroll</span>
                <ChevronDown size={20} />
            </div>
        </section>
    )
}
