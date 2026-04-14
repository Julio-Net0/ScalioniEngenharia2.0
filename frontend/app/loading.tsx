export default function Loading() {
    return (
        <div className="fixed inset-0 bg-main-bg z-[9999] flex flex-col items-center justify-center">
            <div className="w-24 h-24 relative mb-8">
                {/* Animated Rings */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />

                {/* Logo Initial */}
                <div className="absolute inset-0 flex items-center justify-center font-playfair font-black text-3xl text-primary">
                    S
                </div>
            </div>

            <div className="text-center">
                <h2 className="font-playfair text-xl font-bold text-white uppercase tracking-[0.3em] mb-2 animate-pulse">
                    Scalioni
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em]">
                    Carregando Excelência
                </p>
            </div>
        </div>
    )
}
