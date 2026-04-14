import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Home, Phone } from 'lucide-react'

export default function PagamentoSucesso() {
    return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center py-20 px-6">
            <div className="max-w-2xl w-full bg-card-bg border border-primary/20 p-12 text-center relative overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A55A' fill-opacity='1'%3E%3Cpath d='M24 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10 font-body">
                    <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>

                    <h1 className="font-playfair text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        Pagamento <span className="text-primary">Confirmado</span>
                    </h1>

                    <p className="text-slate-300 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
                        Obrigado por escolher a <span className="text-primary font-bold">Scalioni Engenharia</span>.
                        O link para download da sua planta e o recibo de compra foram enviados para o seu e-mail.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        <div className="bg-main-bg/50 border border-white/5 p-6 text-left">
                            <ShoppingBag size={20} className="text-primary mb-3" />
                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Próximo Passo</p>
                            <p className="text-xs text-slate-300">Verifique sua caixa de entrada e spam.</p>
                        </div>
                        <div className="bg-main-bg/50 border border-white/5 p-6 text-left">
                            <Phone size={20} className="text-primary mb-3" />
                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Precisa de Ajuda?</p>
                            <p className="text-xs text-slate-300">(11) 99999-9999 ou contato@scalioni.com</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href="/loja"
                            className="px-10 py-5 bg-primary text-main-bg font-black text-xs tracking-[0.2em] transition-all hover:bg-primary-hover uppercase"
                        >
                            VOLTAR PARA A LOJA
                        </Link>
                        <Link
                            href="/"
                            className="px-10 py-5 border-2 border-primary text-primary font-black text-xs tracking-[0.2em] transition-all hover:bg-primary hover:text-main-bg uppercase"
                        >
                            <Home size={14} className="inline mr-2 -mt-0.5" /> IR PARA HOME
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
