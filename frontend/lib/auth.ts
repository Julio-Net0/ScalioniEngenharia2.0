'use client'

const TOKEN_KEY = 'scalioni_admin_token'

export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
    // Also set as cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
}

export function removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
}

export function isAuthenticated(): boolean {
    return !!getToken()
}
