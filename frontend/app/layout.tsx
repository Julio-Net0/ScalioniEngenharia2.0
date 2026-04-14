import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BotaoWhatsApp } from '@/components/layout/BotaoWhatsApp'
import { Toaster } from '@/components/ui/toaster'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'Scalioni Engenharia — Arquitetura e Engenharia de Alto Padrão',
        template: '%s | Scalioni Engenharia',
    },
    description:
        'Escritório de arquitetura e engenharia de alto padrão. Portfólio de projetos residenciais e comerciais. Plantas prontas para download.',
    keywords: ['arquitetura', 'engenharia', 'projetos', 'plantas', 'alto padrão'],
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        siteName: 'Scalioni Engenharia',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" className="dark" suppressHydrationWarning>
            <body className={`${outfit.variable} ${playfair.variable}`}>
                <Navbar />
                <main>{children}</main>
                <Footer />
                <BotaoWhatsApp />
                <Toaster />
            </body>
        </html>
    )
}
