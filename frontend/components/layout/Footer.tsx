'use client'

import Link from 'next/link'
import { Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-nav-bg pt-20 pb-10 border-t-4 border-primary">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h2 className="font-playfair text-xl font-black text-primary mb-6 tracking-tighter uppercase">
                            SCALIONI<span className="text-white">ENGENHARIA</span>
                        </h2>
                        <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                            Referência em engenharia e arquitetura de luxo, entregando excelência técnica e estética em cada projeto.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Linkedin, Phone].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-main-bg transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest uppercase mb-8 text-xs">Links Úteis</h3>
                        <ul className="space-y-4">
                            {[
                                ['/', 'Início'],
                                ['/portfolio', 'Portfólio'],
                                ['/loja', 'Loja de Plantas'],
                                ['/servicos', 'Serviços'],
                                ['/contato', 'Contato'],
                                ['/admin', 'Painel Admin'],
                            ].map(([href, label]) => (
                                <li key={href}>
                                    <Link href={href} className="text-slate-400 hover:text-primary transition-colors text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest uppercase mb-8 text-xs">Contato</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <MapPin size={16} className="text-primary shrink-0" />
                                São Paulo, SP
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail size={16} className="text-primary shrink-0" />
                                contato@scalioni.com
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Phone size={16} className="text-primary shrink-0" />
                                (11) 99999-9999
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold tracking-widest uppercase mb-8 text-xs">Newsletter</h3>
                        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                            Receba tendências de arquitetura de luxo em seu e-mail.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="bg-main-bg border border-white/10 text-white focus:border-primary h-12 px-4 text-sm outline-none transition-all"
                            />
                            <button
                                type="submit"
                                className="h-12 bg-primary text-main-bg font-black tracking-widest uppercase text-xs hover:bg-primary-hover transition-colors"
                            >
                                Inscrever-se
                            </button>
                        </form>
                    </div>
                </div>

                <div className="gold-divider mb-8" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold">
                        © {new Date().getFullYear()} SCALIONIENGENHARIA. TODOS OS DIREITOS RESERVADOS.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] tracking-widest text-slate-500 hover:text-primary uppercase font-bold">Privacidade</a>
                        <a href="#" className="text-[10px] tracking-widest text-slate-500 hover:text-primary uppercase font-bold">Termos de Uso</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
