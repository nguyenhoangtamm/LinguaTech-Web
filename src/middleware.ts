import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routes } from "@/config/routes";

const privatePaths = ['/managef']
const authPaths = ['/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value

    if (pathname === '/') {
        // if (accessToken) {
        //     return NextResponse.redirect(new URL(routes.manage.dashboard, request.url));
        // } else {
        //     return NextResponse.redirect(new URL('/login', request.url));
        // }
    }
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
        // return NextResponse.redirect(new URL('/manage', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/accounts', '/manage/:path*']
}
