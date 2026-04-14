import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET ?? 'dev-secret-key'
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!pathname.startsWith('/admin')) return NextResponse.next()
    if (pathname === '/admin/login') return NextResponse.next()

    const token =
        request.cookies.get('token')?.value ??
        request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
        await jwtVerify(token, SECRET)
        return NextResponse.next()
    } catch {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('token')
        return response
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
