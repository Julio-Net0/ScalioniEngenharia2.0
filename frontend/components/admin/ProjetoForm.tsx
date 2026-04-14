'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { adminCreateProjeto, adminUpdateProjeto, uploadFile } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import type { Projeto } from '@/lib/api'

const projetoSchema = z.object({
    titulo: z.string().min(3, 'Título muito curto'),
    slug: z.string().min(3, 'Slug muito curto'),
    descricao: z.string().min(10, 'Descrição muito curta'),
    categoria: z.string().min(1, 'Selecione uma categoria'),
    ano: z.coerce.number().min(1900).max(2100),
    imagem_capa: z.string().url('URL de imagem inválida'),
    imagens: z.array(z.string()).default([]),
    ativo: z.boolean().default(true),
})

type ProjetoValues = z.infer<typeof projetoSchema>

interface Props {
    initialData?: Projeto
}

export function ProjetoForm({ initialData }: Props) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjetoValues>({
        resolver: zodResolver(projetoSchema),
        defaultValues: initialData ? {
            ...initialData,
            ano: Number(initialData.ano)
        } : {
            ativo: true,
            imagens: [],
            ano: new Date().getFullYear()
        }
    })

    const imagens = watch('imagens')
    const capa = watch('imagem_capa')

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'imagem_capa' | 'imagens') {
        const file = e.target.files?.[0]
        if (!file) return
        const token = getToken()
        if (!token) return

        setUploading(true)
        try {
            const { url } = await uploadFile(token, file)
            if (field === 'imagem_capa') {
                setValue('imagem_capa', url)
            } else {
                setValue('imagens', [...imagens, url])
            }
            toast('Upload concluído', 'success')
        } catch {
            toast('Erro no upload', 'error')
        } finally {
            setUploading(false)
        }
    }

    async function onSubmit(data: ProjetoValues) {
        const token = getToken()
        if (!token) return
        setLoading(true)
        try {
            if (initialData) {
                await adminUpdateProjeto(token, initialData.slug, data)
                toast('Projeto atualizado com sucesso', 'success')
            } else {
                await adminCreateProjeto(token, data)
                toast('Projeto criado com sucesso', 'success')
            }
            router.push('/admin/projetos')
            router.refresh()
        } catch (err: any) {
            toast(err.message || 'Erro ao salvar projeto', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="bg-card-bg border border-white/5 p-10 space-y-8">
                <div>
                    <h3 className="text-white font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-white/5 pb-4">
                        Informações Básicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Título do Projeto</label>
                            <input {...register('titulo')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="Ex: Residência Alpha" />
                            {errors.titulo && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.titulo.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Slug (URL)</label>
                            <input {...register('slug')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="residencia-alpha" />
                            {errors.slug && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.slug.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Categoria</label>
                        <select {...register('categoria')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none appearance-none">
                            <option value="Residencial Luxo">Residencial Luxo</option>
                            <option value="Corporativo">Corporativo</option>
                            <option value="Interiores">Interiores</option>
                            <option value="Restauração">Restauração</option>
                            <option value="Urbanismo">Urbanismo</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Ano de Conclusão</label>
                        <input type="number" {...register('ano')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Descrição</label>
                    <textarea {...register('descricao')} rows={6} className="w-full bg-main-bg border border-white/10 p-5 text-white focus:border-primary outline-none resize-none" placeholder="Detalhes do projeto..." />
                    {errors.descricao && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.descricao.message}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" {...register('ativo')} id="ativo" className="w-5 h-5 accent-primary bg-main-bg border-white/10" />
                    <label htmlFor="ativo" className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer">Projeto Ativo (Visível no site)</label>
                </div>
            </div>

            <div className="bg-card-bg border border-white/5 p-10 space-y-8">
                <h3 className="text-white font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-white/5 pb-4">
                    Mídia e Imagens
                </h3>

                {/* Capa */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Imagem de Capa (Principal)</label>
                    <div className="flex gap-6">
                        <div className="w-40 aspect-video bg-main-bg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            {capa ? (
                                <img src={capa} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-700" />
                            )}
                            {uploading && <div className="absolute inset-0 bg-main-bg/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={20} /></div>}
                        </div>
                        <div className="flex flex-col justify-center gap-3">
                            <label className="px-6 py-2 border border-primary text-primary text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-main-bg transition-all cursor-pointer">
                                Upload Capa
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'imagem_capa')} />
                            </label>
                            <input {...register('imagem_capa')} className="text-[10px] bg-transparent border-b border-white/10 text-slate-400 outline-none w-64" placeholder="Ou cole a URL aqui" />
                        </div>
                    </div>
                </div>

                {/* Galeria */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Galeria de Fotos</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {imagens.map((url, i) => (
                            <div key={i} className="relative aspect-square border border-white/10 group overflow-hidden">
                                <img src={url} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setValue('imagens', imagens.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                        <label className="aspect-square bg-main-bg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-all cursor-pointer">
                            <Plus size={24} />
                            <span className="text-[9px] font-bold uppercase mt-2">Adicionar</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'imagens')} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-10 py-5 border border-white/10 text-slate-400 font-black text-xs tracking-widest hover:text-white transition-all uppercase"
                >
                    CANCELAR
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-5 bg-primary text-main-bg font-black text-xs tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> SALVAR ALTERAÇÕES</>}
                </button>
            </div>
        </form>
    )
}
