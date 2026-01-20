import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'));

    // Clear the token cookie
    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return response;
}
