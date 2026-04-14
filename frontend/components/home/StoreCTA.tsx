import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export function StoreCTA() {
    return (
        <section className="relative py-24 overflow-hidden bg-main-bg">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-card-bg border border-primary/20 p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    <div className="max-w-2xl relative z-10">
                        <span className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
                            Scalioni Store
                        </span>
                        <h2 className="font-playfair text-5xl md:text-6xl font-black text-white mb-6">
                            Plantas Prontas
                        </h2>
                        <p className="text-xl text-slate-300 mb-4 font-light">
                            Projetos arquitetônicos de alto padrão com entrega imediata em PDF.
                        </p>
                        <p className="text-3xl font-playfair font-bold text-primary mb-10">
                            A partir de R$ 990,00
                        </p>
                        <Link
                            href="/loja"
                            className="inline-block px-14 py-5 bg-primary text-main-bg font-black text-sm tracking-widest hover:bg-primary-hover hover:scale-105 transition-all uppercase shadow-2xl shadow-primary/20"
                        >
                            ACESSAR A LOJA
                        </Link>
                    </div>

                    <div className="relative w-full lg:w-[380px] aspect-square group shrink-0">
                        <div className="absolute -inset-4 border border-primary/30 group-hover:scale-105 transition-transform duration-700" />
                        <div
                            className="w-full h-full bg-cover bg-center shadow-2xl"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80')`,
                            }}
                        />
                        <div className="absolute -bottom-6 -right-6 bg-terracotta p-6 shadow-2xl">
                            <ShoppingCart size={36} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
