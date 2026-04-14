'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center p-6 text-center">
            <div className="max-w-xl">
                <h1 className="font-playfair text-[120px] md:text-[200px] font-black text-primary/10 leading-none select-none">
                    404
                </h1>
                <div className="relative -mt-10 md:-mt-20">
                    <h2 className="font-playfair text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        Página Não Encontrada
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 font-light max-w-md mx-auto">
                        O projeto que você procura pode ter sido movido ou ainda não foi construído.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-10 py-5 bg-primary text-main-bg font-black text-xs tracking-widest hover:scale-105 transition-all uppercase flex items-center justify-center gap-2"
                        >
                            <Home size={18} /> VOLTAR PARA HOME
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="px-10 py-5 border-2 border-primary text-primary font-black text-xs tracking-widest hover:bg-primary hover:text-main-bg transition-all uppercase flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} /> PÁGINA ANTERIOR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
