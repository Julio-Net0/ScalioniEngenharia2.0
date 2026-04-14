import type { Metadata } from 'next'
import { ContatoForm } from '@/components/contato/ContatoForm'
import { Mail, Phone, MapPin, Instagram, Linkedin, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Fale Conosco',
    description: 'Solicite um orçamento ou tire suas dúvidas técnicas. Nossa equipe está pronta para atender seu projeto de alto padrão.',
}

export default function ContatoPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative h-[300px] flex items-center bg-nav-bg pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-repeat opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A55A' fill-opacity='1'%3E%3Cpath d='M24 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
                    <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Fale Conosco</span>
                    <h1 className="font-playfair text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">Contato</h1>
                </div>
            </section>

            <section className="bg-main-bg py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Info */}
                        <div className="lg:col-span-5">
                            <span className="text-terracotta text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Informações</span>
                            <h2 className="font-playfair text-4xl font-bold text-white mb-10">Agende uma Reunião <br /> com nossa Equipe</h2>

                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-card-bg border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-1">Localização</h4>
                                        <p className="text-slate-400 text-sm">Av. Paulista, 1000 - Bela Vista <br /> São Paulo - SP, 01310-100</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-card-bg border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-1">E-mail</h4>
                                        <p className="text-slate-400 text-sm">contato@scalioni.com <br /> suporte@scalioni.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-card-bg border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-1">Telefone</h4>
                                        <p className="text-slate-400 text-sm">(11) 99999-9999 <br /> (11) 3333-3333</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-10 border-t border-white/5">
                                <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-6">Redes Sociais</h4>
                                <div className="flex gap-4">
                                    {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="w-12 h-12 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-main-bg transition-all"
                                        >
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-7">
                            <ContatoForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="h-[500px] w-full bg-nav-bg relative">
                <iframe
                    src={process.env.NEXT_PUBLIC_MAPS_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border-y-4 border-primary" />
            </section>
        </>
    )
}
