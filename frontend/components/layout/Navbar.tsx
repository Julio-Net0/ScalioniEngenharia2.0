'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { href: '/', label: 'INÍCIO' },
    { href: '/portfolio', label: 'PORTFÓLIO' },
    { href: '/loja', label: 'LOJA' },
    { href: '/servicos', label: 'SERVIÇOS' },
    { href: '/contato', label: 'CONTATO' },
]

export function Navbar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    if (pathname.startsWith('/admin')) return null

    return (
        <nav className="fixed top-0 w-full z-50 bg-nav-bg/95 backdrop-blur-md border-b border-primary/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-playfair text-xl lg:text-2xl font-black text-primary tracking-tighter">
                    SCALIONI<span className="text-white">ENGENHARIA</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-xs font-bold tracking-widest transition-colors relative group ${pathname === href ? 'text-primary' : 'text-slate-300 hover:text-primary'
                                }`}
                        >
                            {label}
                            <span className="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full w-0" />
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/contato"
                        className="px-5 py-2.5 bg-primary text-main-bg text-xs font-black tracking-widest hover:bg-primary-hover transition-all uppercase"
                    >
                        SOLICITAR ORÇAMENTO
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="lg:hidden text-primary p-2"
                    onClick={() => setOpen(!open)}
                    aria-label="Menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="lg:hidden bg-nav-bg border-t border-primary/20 px-6 py-6 flex flex-col gap-6">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="text-sm font-bold tracking-widest text-slate-300 hover:text-primary transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/contato"
                        onClick={() => setOpen(false)}
                        className="mt-2 px-5 py-3 bg-primary text-main-bg text-xs font-black tracking-widest text-center uppercase"
                    >
                        SOLICITAR ORÇAMENTO
                    </Link>
                </div>
            )}
        </nav>
    )
}
