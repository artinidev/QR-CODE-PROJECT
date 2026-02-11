import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/email';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        try {
            await limiter.check(3, ip); // 3 requests per minute
        } catch {
            return NextResponse.json({ error: 'Too many attempts. Please wait.' }, { status: 429 });
        }

        const { email } = await request.json();
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const db = await getDatabase();

        // Store code (upsert)
        await db.collection('verification_codes').updateOne(
            { email },
            { $set: { code, expiresAt, verified: false } },
            { upsert: true }
        );

        // Send email
        const sent = await sendVerificationEmail(email, code);
        if (!sent) {
            return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Verification code sent' });
    } catch (error) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
