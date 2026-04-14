import { LucideIcon } from 'lucide-react'

interface Props {
    label: string
    value: string | number
    icon: LucideIcon
    color?: string
}

export function KpiCard({ label, value, icon: Icon, color = 'primary' }: Props) {
    return (
        <div className="bg-card-bg border border-white/5 p-8 flex items-start justify-between group hover:border-primary/30 transition-all">
            <div>
                <h4 className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-4">{label}</h4>
                <span className="text-4xl font-playfair font-black text-white group-hover:text-primary transition-colors">
                    {value}
                </span>
            </div>
            <div className="w-14 h-14 bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon size={24} className="text-primary" />
            </div>
        </div>
    )
}
