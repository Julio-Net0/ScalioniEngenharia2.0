'use client'

import { useState, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).slice(2)
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }, [])

    const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

    return (
        <ToastContext.Provider value={{ toast }}>
            <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            'flex items-start gap-3 p-4 border text-sm font-medium animate-fade-in',
                            t.type === 'success' && 'bg-green-950 border-green-700 text-green-300',
                            t.type === 'error' && 'bg-red-950 border-red-700 text-red-300',
                            t.type === 'info' && 'bg-card-bg border-primary/30 text-slate-200',
                        )}
                    >
                        {t.type === 'success' && <CheckCircle size={16} className="shrink-0 mt-0.5" />}
                        {t.type === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                        <span className="flex-1">{t.message}</span>
                        <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
