import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { PortfolioGrid } from '@/components/home/PortfolioGrid'
import { ServicesSection } from '@/components/home/ServicesSection'
import { StoreCTA } from '@/components/home/StoreCTA'
import { getProjetos } from '@/lib/api'

export const metadata: Metadata = {
    title: 'Scalioni Engenharia — Arquitetura e Engenharia de Alto Padrão',
    description: 'Site oficial da Scalioni Engenharia. Portfólio de projetos residenciais e comerciais. Plantas prontas para compra online.',
}

export default async function HomePage() {
    let projetos = []
    try {
        projetos = await getProjetos()
    } catch {
        // fallback to empty — home still renders with placeholder cards
    }

    return (
        <>
            <HeroSection />
            <div className="gold-divider" />
            <StatsSection />
            <div className="gold-divider" />
            <PortfolioGrid projetos={projetos} />
            <div className="gold-divider" />
            <ServicesSection />
            <div className="gold-divider" />
            <StoreCTA />
        </>
    )
}
