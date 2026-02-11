import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Check for a secret cookie or header
        // Phase 1: Simple check. Real implementation needs a session check.
        // For now, allow access if on localhost or if a specific query param is present for debugging
        // Use a "secure-admin-token" cookie in real scenario.

        // TEMPORARY: Allow all for now so you can test, but uncomment below to lock it down
        // const isAdmin = request.cookies.get('admin_session');
        // if (!isAdmin) {
        //     return NextResponse.redirect(new URL('/auth/login', request.url));
        // }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
