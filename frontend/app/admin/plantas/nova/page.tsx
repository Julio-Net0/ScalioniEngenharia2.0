'use client'

import { PlantaForm } from '@/components/admin/PlantaForm'

export default function AdminNovaPlantaPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="font-playfair text-4xl font-black text-white uppercase tracking-tight mb-2">Nova Planta</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Cadastre um novo projeto para venda</p>
            </div>

            <PlantaForm />
        </div>
    )
}
