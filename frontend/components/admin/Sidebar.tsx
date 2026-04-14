'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    Title,
    LayoutDashboard,
    FolderKanban,
    Store,
    ShoppingCart,
    MessageSquare,
    Users,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { removeToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'projetos', label: 'Projetos', icon: FolderKanban, href: '/admin/projetos' },
    { id: 'plantas', label: 'Plantas', icon: Store, href: '/admin/plantas' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, href: '/admin/pedidos' },
    { id: 'mensagens', label: 'Mensagens', icon: MessageSquare, href: '/admin/mensagens' },
    { id: 'usuarios', label: 'Usuários', icon: Users, href: '/admin/usuarios' },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    function handleLogout() {
        removeToken()
        router.push('/admin/login')
    }

    return (
        <aside className="w-72 bg-nav-bg border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
            <div className="p-8 pb-12">
                <Link href="/" className="font-playfair text-xl font-black text-primary tracking-tighter uppercase">
                    SCALIONI<span className="text-white">ADMIN</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-4 text-[11px] font-bold tracking-widest uppercase transition-all group",
                                isActive
                                    ? "bg-primary text-main-bg"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={18} />
                                {item.label}
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 text-[11px] font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={18} />
                    Sair do Sistema
                </button>
            </div>
        </aside>
    )
}
