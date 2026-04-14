'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Lock, Mail } from 'lucide-react'
import { adminLogin } from '@/lib/api'
import { setToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginValues) {
        setLoading(true)
        try {
            const token = await adminLogin(data.email, data.senha)
            setToken(token)
            toast('Login realizado com sucesso', 'success')
            router.push('/admin')
        } catch (err: any) {
            toast(err.message || 'Credenciais inválidas', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center p-6 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A55A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>
            <div className="max-w-md w-full">
                <div className="text-center mb-12">
                    <h2 className="font-playfair text-3xl font-black text-primary tracking-tighter mb-2 uppercase">
                        SCALIONI<span className="text-white">ENGENHARIA</span>
                    </h2>
                    <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase">Acesso Administrativo</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-card-bg border border-primary/20 p-10 shadow-3xl space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                            <Mail size={12} className="text-primary" /> E-mail
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none transition-all"
                            placeholder="admin@scalioni.com"
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                            <Lock size={12} className="text-primary" /> Senha
                        </label>
                        <input
                            {...register('senha')}
                            type="password"
                            className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {errors.senha && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.senha.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-main-bg font-black tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : 'ENTRAR NO PAINEL'}
                    </button>
                </form>

                <div className="mt-8 text-center text-[10px] text-slate-600 font-bold tracking-widest uppercase">
                    © {new Date().getFullYear()} Scalioni Engenharia v2.0
                </div>
            </div>
        </div>
    )
}
