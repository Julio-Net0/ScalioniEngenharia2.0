'use client'

import { ProjetoForm } from '@/components/admin/ProjetoForm'

export default function AdminNovoProjetoPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Novo Projeto</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Adicione uma nova obra ao portfólio</p>
            </div>

            <ProjetoForm />
        </div>
    )
}
