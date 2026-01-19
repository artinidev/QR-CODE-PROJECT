import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Protect Dashboard Routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Optional: Redirect / to /dashboard if logged in?
    // For now, valid to keep strictly to the user request.

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
