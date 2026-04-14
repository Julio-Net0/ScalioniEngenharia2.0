'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) return <>{children}</>

    return (
        <div className="flex min-h-screen bg-main-bg text-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-nav-bg border-b border-white/5 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Sistema de Gestão</span>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span className="text-[10px] text-white font-bold tracking-widest uppercase">
                            {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Administrador</span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">Nível Master</span>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center font-playfair font-black text-primary">
                            A
                        </div>
                    </div>
                </header>

                <main className="p-10 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
