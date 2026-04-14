'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Send } from 'lucide-react'
import { sendContato } from '@/lib/api'
import { useToast } from '@/components/ui/toaster'

const contatoSchema = z.object({
    nome: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    assunto: z.string().min(1, 'Selecione um assunto'),
    mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type ContatoValues = z.infer<typeof contatoSchema>

export function ContatoForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContatoValues>({
        resolver: zodResolver(contatoSchema),
        defaultValues: { assunto: 'Orçamento' }
    })

    async function onSubmit(data: ContatoValues) {
        setLoading(true)
        try {
            await sendContato(data)
            toast('Mensagem enviada com sucesso! Logo entraremos em contato.', 'success')
            reset()
        } catch (err: any) {
            toast(err.message || 'Erro ao enviar mensagem', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card-bg border border-white/5 p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Seu Nome</label>
                    <input
                        {...register('nome')}
                        className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none transition-all"
                        placeholder="Nome completo"
                    />
                    {errors.nome && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.nome.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Seu E-mail</label>
                    <input
                        {...register('email')}
                        className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none transition-all"
                        placeholder="exemplo@email.com"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Assunto</label>
                <select
                    {...register('assunto')}
                    className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="Orçamento">Solicitar Orçamento</option>
                    <option value="Dúvida Técnica">Dúvida Técnica</option>
                    <option value="Loja de Plantas">Dúvida sobre Loja de Plantas</option>
                    <option value="Carreiras">Trabalhe Conosco</option>
                    <option value="Outros">Outros</option>
                </select>
                {errors.assunto && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.assunto.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Sua Mensagem</label>
                <textarea
                    {...register('mensagem')}
                    rows={6}
                    className="w-full bg-main-bg border border-white/10 p-5 text-white focus:border-primary outline-none transition-all resize-none"
                    placeholder="Como podemos ajudar?"
                />
                {errors.mensagem && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.mensagem.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-main-bg font-black tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <>ENVIAR MENSAGEM <Send size={18} /></>}
            </button>
        </form>
    )
}
