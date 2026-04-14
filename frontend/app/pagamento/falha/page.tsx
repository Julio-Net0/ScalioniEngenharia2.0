import Link from 'next/link'
import { XCircle, ShoppingBag, ArrowRight, HelpCircle } from 'lucide-react'

export default function PagamentoFalha() {
    return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center py-20 px-6">
            <div className="max-w-2xl w-full bg-card-bg border border-red-500/20 p-12 text-center relative overflow-hidden">
                <div className="relative z-10 font-body">
                    <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-10">
                        <XCircle size={48} className="text-red-500" />
                    </div>

                    <h1 className="font-playfair text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        Ops! Algo deu <span className="text-red-500">Errado</span>
                    </h1>

                    <p className="text-slate-300 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
                        Não foi possível processar o seu pagamento no momento. Nenhuma cobrança foi efetuada.
                        Isso pode ocorrer por problemas na operadora ou no processamento do Mercado Pago.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        <div className="bg-main-bg/50 border border-white/5 p-6 text-left">
                            <ShoppingBag size={20} className="text-primary mb-3" />
                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Tentar Novamente</p>
                            <p className="text-xs text-slate-300">Você pode tentar usar outro cartão.</p>
                        </div>
                        <div className="bg-main-bg/50 border border-white/5 p-6 text-left">
                            <HelpCircle size={20} className="text-primary mb-3" />
                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Dúvida Técnica?</p>
                            <p className="text-xs text-slate-300">Fale conosco se o problema persistir.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href="/loja"
                            className="px-10 py-5 bg-red-600/20 border border-red-500/30 text-red-500 font-black text-xs tracking-[0.2em] transition-all hover:bg-red-500 hover:text-white uppercase flex items-center justify-center gap-2"
                        >
                            TENTAR NOVAMENTE <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/contato"
                            className="px-10 py-5 border-2 border-primary text-primary font-black text-xs tracking-[0.2em] transition-all hover:bg-primary hover:text-main-bg uppercase"
                        >
                            FALAR COM SUPORTE
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
