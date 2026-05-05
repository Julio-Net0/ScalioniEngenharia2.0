import { MapPin, Calendar, Layout, User, CheckCircle2 } from 'lucide-react'

interface Props {
    categoria: string
    ano: number
    local?: string
    status?: string
}

export function FichaTecnica({ categoria, ano, local = 'São Paulo, SP', status = 'Concluído' }: Props) {
    const items = [
        { label: 'Categoria', value: categoria, icon: Layout },
        { label: 'Ano do Projeto', value: String(ano), icon: Calendar },
        { label: 'Localização', value: local, icon: MapPin },
        { label: 'Status', value: status, icon: CheckCircle2 },
        { label: 'Escritório', value: 'Scalioni Engenharia', icon: User },
    ]

    return (
        <div className="bg-card-bg border border-primary/30 p-8 md:p-10 sticky top-32">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/20">
                Ficha Técnica
            </h3>
            
            <dl className="space-y-6">
                {items.map((item) => (
                    <div key={item.label} className="group">
                        <dt className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-black mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                            <item.icon size={12} />
                            {item.label}
                        </dt>
                        <dd className="text-white font-medium text-sm md:text-base pl-5 border-l border-primary/10 group-hover:border-primary transition-colors">
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>

            <button className="w-full mt-10 py-4 bg-transparent border border-primary/50 text-primary text-[11px] font-black tracking-[0.3em] uppercase hover:bg-primary hover:text-main-bg transition-all duration-500">
                Solicitar Orçamento
            </button>
        </div>
    )
}
