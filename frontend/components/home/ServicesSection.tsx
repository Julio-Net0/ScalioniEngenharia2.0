import Link from 'next/link'
import { Building2, HardHat, Layers, PenTool, ArrowRight } from 'lucide-react'

const services = [
    {
        icon: PenTool,
        title: 'Arquitetura de Luxo',
        desc: 'Desenvolvimento de projetos residenciais e comerciais exclusivos, focados em estética, funcionalidade e sofisticação máxima.',
    },
    {
        icon: HardHat,
        title: 'Engenharia de Precisão',
        desc: 'Cálculos estruturais complexos e gestão de obras com rigor técnico, garantindo segurança e fidelidade ao projeto original.',
    },
    {
        icon: Building2,
        title: 'Gestão de Grandes Obras',
        desc: 'Acompanhamento completo de cronograma, fornecedores e orçamentos para empreendimentos de alto padrão e edifícios.',
    },
    {
        icon: Layers,
        title: 'Design de Interiores',
        desc: 'Curadoria de materiais nobres e mobiliário assinado para criar ambientes que refletem a personalidade e o status dos clientes.',
    },
]

export function ServicesSection() {
    return (
        <section className="bg-card-bg py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-terracotta text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
                        Especialidades
                    </span>
                    <h2 className="font-playfair text-5xl md:text-6xl font-black text-white mb-6">Nossas Soluções</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="bg-main-bg p-10 gold-border-left hover:bg-zinc-900 transition-all group border border-white/5"
                        >
                            <Icon
                                size={48}
                                className="text-primary mb-6 group-hover:scale-110 transition-transform"
                            />
                            <h3 className="text-2xl font-playfair font-bold text-white mb-4">{title}</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">{desc}</p>
                            <Link
                                href="/servicos"
                                className="text-primary text-sm font-bold tracking-widest uppercase flex items-center gap-2 group-hover:text-primary-hover"
                            >
                                Saiba Mais <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
