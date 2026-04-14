'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, X, Plus, Trash2, Image as ImageIcon, FileText } from 'lucide-react'
import { adminCreatePlanta, adminUpdatePlanta, uploadFile } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useToast } from '@/components/ui/toaster'
import type { Planta } from '@/lib/api'

const plantaSchema = z.object({
    titulo: z.string().min(3, 'Título muito curto'),
    slug: z.string().min(3, 'Slug muito curto'),
    descricao: z.string().min(10, 'Descrição muito curta'),
    preco: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido (ex: 990.00)'),
    terreno_minimo_m2: z.coerce.number().min(1).nullable(),
    imagens: z.array(z.string()).default([]),
    arquivo_path: z.string().nullable(),
    ativo: z.boolean().default(true),
})

type PlantaValues = z.infer<typeof plantaSchema>

interface Props {
    initialData?: Planta
}

export function PlantaForm({ initialData }: Props) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState<string | null>(null)
    const router = useRouter()
    const { toast } = useToast()

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PlantaValues>({
        resolver: zodResolver(plantaSchema),
        defaultValues: initialData ? {
            ...initialData,
            preco: String(initialData.preco),
            terreno_minimo_m2: initialData.terreno_minimo_m2
        } : {
            ativo: true,
            imagens: [],
            preco: '990.00',
            terreno_minimo_m2: 150
        }
    })

    const imagens = watch('imagens')
    const arquivo = watch('arquivo_path')

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'imagens' | 'arquivo_path') {
        const file = e.target.files?.[0]
        if (!file) return
        const token = getToken()
        if (!token) return

        setUploading(field)
        try {
            const { url } = await uploadFile(token, file)
            if (field === 'imagens') {
                setValue('imagens', [...imagens, url])
            } else {
                setValue('arquivo_path', url)
            }
            toast('Upload concluído', 'success')
        } catch {
            toast('Erro no upload', 'error')
        } finally {
            setUploading(null)
        }
    }

    async function onSubmit(data: PlantaValues) {
        const token = getToken()
        if (!token) return
        setLoading(true)
        try {
            if (initialData) {
                await adminUpdatePlanta(token, initialData.slug, data)
                toast('Planta atualizada com sucesso', 'success')
            } else {
                await adminCreatePlanta(token, data as any)
                toast('Planta criada com sucesso', 'success')
            }
            router.push('/admin/plantas')
            router.refresh()
        } catch (err: any) {
            toast(err.message || 'Erro ao salvar planta', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="bg-card-bg border border-white/5 p-10 space-y-8">
                <div>
                    <h3 className="text-white font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-white/5 pb-4">
                        Dados Técnicos e Preço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Título da Planta</label>
                            <input {...register('titulo')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="Ex: Casa Contemporânea A1" />
                            {errors.titulo && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.titulo.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Slug (URL)</label>
                            <input {...register('slug')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="casa-contemporanea-a1" />
                            {errors.slug && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.slug.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Preço de Venda (R$)</label>
                        <input {...register('preco')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="990.00" />
                        {errors.preco && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.preco.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Área do Terreno (m²)</label>
                        <input type="number" {...register('terreno_minimo_m2')} className="w-full bg-main-bg border border-white/10 h-14 px-5 text-white focus:border-primary outline-none" placeholder="150" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Descrição</label>
                    <textarea {...register('descricao')} rows={6} className="w-full bg-main-bg border border-white/10 p-5 text-white focus:border-primary outline-none resize-none" placeholder="Detalhes técnicos e diferenciais..." />
                    {errors.descricao && <p className="text-[10px] text-red-500 uppercase font-bold">{errors.descricao.message}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" {...register('ativo')} id="ativo" className="w-5 h-5 accent-primary bg-main-bg border-white/10" />
                    <label htmlFor="ativo" className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer">Disponível para venda</label>
                </div>
            </div>

            <div className="bg-card-bg border border-white/5 p-10 space-y-8">
                <h3 className="text-white font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-white/5 pb-4">
                    Arquivos e Imagens
                </h3>

                {/* Arquivo PDF/ZIP */}
                <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Arquivo do Projeto (PDF/ZIP)</label>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-main-bg border border-white/10 flex items-center justify-center text-primary relative">
                            <FileText size={24} />
                            {uploading === 'arquivo_path' && <div className="absolute inset-0 bg-main-bg/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={16} /></div>}
                        </div>
                        <div className="flex-1">
                            {arquivo ? (
                                <p className="text-[11px] text-green-500 font-bold uppercase mb-2 truncate max-w-md">✓ Arquivo carregado: {arquivo.split('/').pop()}</p>
                            ) : (
                                <p className="text-[11px] text-red-500 font-bold uppercase mb-2">Nenhum arquivo de download associado.</p>
                            )}
                            <label className="px-6 py-2 border border-primary text-primary text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-main-bg transition-all cursor-pointer inline-block">
                                Selecionar Arquivo
                                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'arquivo_path')} />
                            </label>
                            <input {...register('arquivo_path')} className="hidden" />
                        </div>
                    </div>
                </div>

                {/* Galeria */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Galeria de Demonstração (Mín. 1)</label>
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
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> SALVAR PLANTA</>}
                </button>
            </div>
        </form>
    )
}
