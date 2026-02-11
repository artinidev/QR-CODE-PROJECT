import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
// In a real app, use a proper JWT library here. For "Pro Minimal" Phase 1, we use a simple DB flag or temp secret.
// Actually, let's trust the client for the *immediate* next step by returning a signed token or just a "verified: true" flag in DB.
// Better: Return a "verificationToken" which is just the OTP but signed or a random string stored in DB as "exchangeToken".

import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();
        if (!email || !code) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

        const db = await getDatabase();
        const record = await db.collection('verification_codes').findOne({ email });

        if (!record) {
            return NextResponse.json({ error: 'No code found for this email' }, { status: 400 });
        }

        if (record.code !== code) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        if (new Date() > new Date(record.expiresAt)) {
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        // Code is valid! 
        // Generate a temporary exchange token that allows password creation
        const exchangeToken = nanoid(32);

        // Update record to mark as verified and store exchange token
        await db.collection('verification_codes').updateOne(
            { email },
            {
                $set: {
                    verified: true,
                    exchangeToken,
                    exchangeTokenExpires: new Date(Date.now() + 15 * 60 * 1000) // 15 mins to finish signup
                }
            }
        );

        return NextResponse.json({
            message: 'Email verified',
            verificationToken: exchangeToken
        });

    } catch (error) {
        console.error('OTP Verify Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
