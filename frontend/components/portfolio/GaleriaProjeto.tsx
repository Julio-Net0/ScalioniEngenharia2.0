'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2, X } from 'lucide-react'

interface Props {
    imagens: string[]
}

export function GaleriaProjeto({ imagens }: Props) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null)

    if (!imagens || imagens.length === 0) return null

    // Layout assimétrico: 1 grande, 2 médias, 2 pequenas
    const layoutClasses = [
        'md:col-span-2 md:row-span-2 h-[400px] md:h-full', // Principal
        'h-48 md:h-[200px]', // Média 1
        'h-48 md:h-[200px]', // Média 2
        'h-40 md:h-[180px]', // Pequena 1
        'h-40 md:h-[180px]', // Pequena 2
    ]

    return (
        <div className="mt-16">
            <span className="text-terracotta text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block">
                Galeria de Fotos
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
                {imagens.slice(0, 5).map((img, i) => (
                    <div
                        key={i}
                        className={`relative group overflow-hidden cursor-pointer ${layoutClasses[i] || 'h-48'}`}
                        onClick={() => setSelectedImg(img)}
                    >
                        <Image
                            src={img}
                            alt={`Imagem do projeto ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="text-white" size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Simples */}
            {selectedImg && (
                <div 
                    className="fixed inset-0 z-[100] bg-main-bg/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedImg(null)}
                >
                    <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
                        <X size={32} />
                    </button>
                    <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
                        <Image
                            src={selectedImg}
                            alt="Visualização ampliada"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
