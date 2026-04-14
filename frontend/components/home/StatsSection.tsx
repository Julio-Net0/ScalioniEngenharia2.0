export function StatsSection() {
    const stats = [
        { value: '150+', label: 'Projetos Entregues' },
        { value: '15+', label: 'Anos de Mercado' },
        { value: '12', label: 'Prêmios de Design' },
        { value: '30', label: 'Cidades Atendidas' },
    ]

    return (
        <section className="bg-main-bg py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-center">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center text-center px-4 ${i > 0 ? 'md:border-l border-primary/20' : ''}`}
                        >
                            <span className="text-5xl lg:text-6xl font-playfair font-black text-primary mb-3">
                                {stat.value}
                            </span>
                            <span className="text-[11px] tracking-[0.2em] text-slate-400 uppercase font-bold">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
