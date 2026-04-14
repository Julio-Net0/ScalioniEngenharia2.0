import type { Metadata } from 'next'
import { getPlantas } from '@/lib/api'
import { PlantaFilterGrid } from '@/components/loja/PlantaFilterGrid'
import { Download, ShieldCheck, Headphones, Award } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Loja de Plantas Prontas',
    description: 'Projetos arquitetônicos de alto padrão prontos para download imediato. Economize tempo e dinheiro com design assinado.',
}

const features = [
    { icon: Download, title: 'Download Imediato', desc: 'Receba o link em seu e-mail logo após a aprovação do pagamento.' },
    { icon: ShieldCheck, title: 'Segurança Total', desc: 'Pagamento processado via Mercado Pago com criptografia de ponta.' },
    { icon: Headphones, title: 'Suporte Premium', desc: 'Dúvidas sobre a planta? Nossa equipe técnica está pronta para ajudar.' },
    { icon: Award, title: 'Design Assinado', desc: 'Projetos exclusivos desenvolvidos com a excelência Scalioni.' },
]

export default async function LojaPage() {
    let plantas = []
    try {
        plantas = await getPlantas()
    } catch { }

    return (
        <>
            {/* Hero */}
            <section className="relative h-[300px] md:h-[400px] flex items-center bg-nav-bg pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-repeat opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
                    <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Scalioni Store</span>
                    <h1 className="font-playfair text-5xl md:text-7xl font-black text-white mb-4">Plantas Prontas</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light">
                        Sua casa dos sonhos começa aqui. Projetos completos com pranchas técnicas, cortes e renders.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="bg-main-bg py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex gap-4">
                                <Icon size={32} className="text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Store Grid */}
            <section className="bg-main-bg py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <PlantaFilterGrid plantas={plantas} />
                </div>
            </section>

            {/* Guarantee */}
            <section className="bg-card-bg py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                        <ShieldCheck size={32} className="text-primary" />
                    </div>
                    <h2 className="font-playfair text-4xl font-bold text-white mb-6">Garantia Scalioni de Qualidade</h2>
                    <p className="text-slate-400 leading-relaxed">
                        Todas as nossas plantas são desenvolvidas seguindo as normas técnicas brasileiras (NBRs)
                        e incluem arquivos em PDF prontos para impressão e documentação base para prefeituras.
                        Garantimos a precisão de cada cota e o requinte de cada detalhe.
                    </p>
                </div>
            </section>
        </>
    )
}
