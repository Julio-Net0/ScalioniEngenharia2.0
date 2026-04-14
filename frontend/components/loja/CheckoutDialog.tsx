'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Lock, CreditCard, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createPedido } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/toaster'

const checkoutSchema = z.object({
    nome: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().optional(),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

interface Props {
    plantaId: string
    titulo: string
    preco: string
}

export function CheckoutDialog({ plantaId, titulo, preco }: Props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
    })

    async function onSubmit(data: CheckoutValues) {
        setLoading(true)
        try {
            const res = await createPedido({
                planta_id: plantaId,
                ...data,
            })
            // Redirect to Mercado Pago
            window.location.href = res.init_point
        } catch (err: any) {
            toast(err.message || 'Erro ao processar pedido', 'error')
            setLoading(false)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="w-full py-5 bg-primary text-main-bg font-black tracking-widest hover:bg-primary-hover hover:scale-[1.02] transition-all uppercase shadow-2xl shadow-primary/20 flex items-center justify-center gap-3">
                    <CreditCard size={20} /> COMPRAR AGORA — {formatCurrency(preco)}
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-main-bg/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card-bg border border-primary/30 p-8 z-50 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                        <div>
                            <h2 className="font-playfair text-2xl font-bold text-white uppercase tracking-tight">Checkout</h2>
                            <p className="text-xs text-primary font-bold tracking-widest mt-1 uppercase">{titulo}</p>
                        </div>
                        <Dialog.Close className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Nome Completo</label>
                            <input
                                {...register('nome')}
                                className="w-full bg-main-bg border border-white/10 h-12 px-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700"
                                placeholder="Ex: João Silva"
                            />
                            {errors.nome && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.nome.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">E-mail para entrega</label>
                            <input
                                {...register('email')}
                                className="w-full bg-main-bg border border-white/10 h-12 px-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700"
                                placeholder="exemplo@email.com"
                            />
                            {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">WhatsApp (Opcional)</label>
                            <input
                                {...register('telefone')}
                                className="w-full bg-main-bg border border-white/10 h-12 px-4 text-white focus:border-primary outline-none transition-all placeholder:text-slate-700"
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="bg-primary/5 p-4 border border-primary/20 flex gap-3 mb-6">
                            <Lock size={16} className="text-primary shrink-0" />
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Seus dados estão protegidos. Após o pagamento, o link de download será enviado para o e-mail informado acima.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-main-bg font-black tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                'IR PARA O PAGAMENTO'
                            )}
                        </button>
                        <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                            Processado por Mercado Pago
                        </p>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
