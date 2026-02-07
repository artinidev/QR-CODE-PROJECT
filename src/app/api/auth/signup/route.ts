import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import rateLimit from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request: Request) {
    try {
        // 1. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

        try {
            await limiter.check(5, ip); // 5 requests per minute
        } catch {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const { email, password, verificationToken } = await request.json();

        // 2. Basic Validation
        if (!email || !password || !verificationToken) {
            return NextResponse.json(
                { error: 'Email, password, and verification token are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // 3. Verify Token
        const tokenRecord = await db.collection('verification_codes').findOne({
            email,
            exchangeToken: verificationToken,
            verified: true
        });

        if (!tokenRecord) {
            return NextResponse.json({ error: 'Invalid or expired verification session' }, { status: 403 });
        }

        if (tokenRecord.exchangeTokenExpires && new Date() > new Date(tokenRecord.exchangeTokenExpires)) {
            return NextResponse.json({ error: 'Session expired. Please verify email again.' }, { status: 403 });
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const usersCollection = db.collection('users');

        // 4. Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user
        const newUser = {
            email,
            password: hashedPassword,
            role: 'user',
            plan: 'starter', // Default Free Plan
            credits: {
                scans: 100,       // 100 Monthly Scans
                static_qr: -1,    // Unlimited (-1)
                dynamic_qr: 0     // 0 Dynamic QRs
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        // Cleanup verification code
        await db.collection('verification_codes').deleteOne({ email });

        // Log the event
        const { logAction } = await import('@/lib/audit');
        await logAction('USER_REGISTERED', `New user registered: ${email}`, { userId: result.insertedId });

        // AUTO-LOGIN: Generate JWT token
        const token = jwt.sign(
            {
                userId: result.insertedId,
                email: newUser.email,
                role: newUser.role,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            message: 'User created successfully',
            userId: result.insertedId,
        }, { status: 201 });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Sign Up Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
