'use client'

import { MessageCircle } from 'lucide-react'

export function BotaoWhatsApp() {
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? '5511999999999'
    const message = encodeURIComponent('Olá! Vi o site da Scalioni Engenharia e gostaria de mais informações.')

    return (
        <a
            href={`https://wa.me/${whatsapp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco no WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all hover:scale-110 rounded-full"
        >
            <MessageCircle size={26} fill="white" />
        </a>
    )
}
