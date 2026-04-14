import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(num)
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export function formatM2(value: number | null | undefined): string {
    if (!value) return '—'
    return `${value.toLocaleString('pt-BR')} m²`
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.slice(0, length) + '...'
}

export const STATUS_LABELS: Record<string, string> = {
    pendente: 'Pendente',
    pago: 'Pago',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
    in_process: 'Em Processo',
}

export const STATUS_COLORS: Record<string, string> = {
    pendente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pago: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    in_process: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}
