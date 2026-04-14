import type { Metadata } from 'next'
import Link from 'next/link'
import { PenTool, HardHat, Building2, CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Nossos Serviços',
    description: 'Arquitetura de luxo, engenharia de precisão e gestão de obras. Conheça as soluções da Scalioni Engenharia.',
}

const steps = [
    { n: '01', title: 'Brainstorm e Conceito', desc: 'Entendemos seus desejos e traduzimos em um conceito arquitetônico único.' },
    { n: '02', title: 'Projeto Executivo', desc: 'Detalhamento técnico rigoroso para viabilizar a construção com precisão.' },
    { n: '03', title: 'Aprovações', desc: 'Cuidamos de toda a burocracia junto aos órgãos competentes.' },
    { n: '04', title: 'Gestão da Obra', desc: 'Acompanhamento diário para garantir que o projeto seja seguido à risca.' },
    { n: '05', title: 'Entrega das Chaves', desc: 'Seu sonho materializado com acabamento impecável e pronto para morar.' },
]

export default function ServicosPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative h-[400px] flex items-center bg-nav-bg pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503387762-592dea58ef21?w=1920&q=80')` }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
                    <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Soluções Completas</span>
                    <h1 className="font-playfair text-5xl md:text-7xl font-black text-white mb-4">Nossos Serviços</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light">
                        Da concepção à entrega: excelência técnica e estética em cada etapa do seu empreendimento.
                    </p>
                </div>
            </section>

            {/* Detail Sections */}
            {[
                {
                    id: 'arquitetura',
                    icon: PenTool,
                    title: 'Arquitetura de Luxo',
                    desc: 'Nossos projetos arquitetônicos são desenvolvidos com um olhar atento ao luxo contemporâneo e à funcionalidade. Criamos espaços que não apenas impressionam visualmente, mas que elevam a qualidade de vida e o bem-estar dos seus ocupantes.',
                    features: ['Projetos Residenciais de Alto Padrão', 'Complexos Corporativos Modernos', 'Design de Interiores Exclusivo'],
                    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                    side: 'right'
                },
                {
                    id: 'engenharia',
                    icon: HardHat,
                    title: 'Engenharia de Precisão',
                    desc: 'A robustez de uma obra depende da inteligência da sua engenharia. Realizamos cálculos estruturais avançados e projetos complementares que otimizam recursos e garantem a durabilidade máxima de cada edificação.',
                    features: ['Cálculo Estrutural Avançado', 'Projetos de Instalações Eficientes', 'Laudos e Perícias Técnicas'],
                    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=1200&q=80',
                    side: 'left'
                },
                {
                    id: 'gestao',
                    icon: Building2,
                    title: 'Gestão de Obras',
                    desc: 'Eliminamos as preocupações comuns da construção civil. Nossa equipe de gestão cuida de cada detalhe do canteiro de obras, desde o controle de insumos até a coordenação fina de fornecedores e cronogramas.',
                    features: ['Fiscalização de Qualidade', 'Gestão Financeira e de Suprimentos', 'Cronograma de Execução Rigoroso'],
                    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
                    side: 'right'
                }
            ].map((s) => (
                <section key={s.id} className="bg-main-bg py-24 border-b border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex flex-col ${s.side === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
                            <div className="flex-1">
                                <s.icon size={48} className="text-primary mb-8" />
                                <h2 className="font-playfair text-4xl md:text-5xl font-black text-white mb-8">{s.title}</h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10">{s.desc}</p>
                                <ul className="space-y-4 mb-12">
                                    {s.features.map((f) => (
                                        <li key={f} className="flex items-center gap-3 text-white font-bold text-sm tracking-wide">
                                            <CheckCircle2 size={18} className="text-primary" /> {f.toUpperCase()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 relative group w-full">
                                <div className="absolute -inset-4 border border-primary/20 scale-95 group-hover:scale-100 transition-transform duration-700" />
                                <div className="aspect-square bg-cover bg-center relative z-10" style={{ backgroundImage: `url('${s.img}')` }} />
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Process Stepper */}
            <section className="bg-card-bg py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-terracotta text-xs font-bold tracking-[0.4em] uppercase mb-4 block">O Fluxo da Perfeição</span>
                        <h2 className="font-playfair text-5xl font-black text-white">Como Trabalhamos</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative">
                        {/* Divider line hidden on mobile */}
                        <div className="hidden lg:block absolute top-10 left-0 w-full h-px bg-primary/20" />

                        {steps.map((step) => (
                            <div key={step.n} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-main-bg border-4 border-primary flex items-center justify-center font-playfair text-2xl font-black text-primary mb-8">
                                    {step.n}
                                </div>
                                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-4">{step.title}</h3>
                                <p className="text-slate-500 text-[11px] leading-relaxed uppercase font-bold">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-primary py-24 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-playfair text-5xl md:text-6xl font-black text-main-bg mb-10">
                        Vamos Construir <br /> seu Próximo Marco?
                    </h2>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-main-bg text-primary font-black tracking-widest hover:scale-105 transition-all uppercase shadow-2xl"
                    >
                        FALAR COM ESPECIALISTA <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </>
    )
}
