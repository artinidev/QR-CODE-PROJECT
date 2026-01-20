import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { User } from '@/types/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to check if current user is super admin
async function isSuperAdmin(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.role === 'admin';
    } catch (e) {
        return false;
    }
}

export async function GET(request: NextRequest) {
    if (!await isSuperAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const db = await getDatabase();
        const users = await db.collection<User>('users')
            .find({ role: 'sub-admin' })
            .project({ password: 0 }) // Exclude password
            .toArray();

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sub-admins' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!await isSuperAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { email, password, permissions, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const db = await getDatabase();

        // Check if user exists
        const existing = await db.collection<User>('users').findOne({ email });
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            email,
            password: hashedPassword,
            role: 'sub-admin',
            status: 'active',
            permissions: permissions || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection<User>('users').insertOne(newUser);

        // Create a profile for them too so valid names exist
        await db.collection('profiles').insertOne({
            userId: result.insertedId,
            fullName: name || 'Sub Admin',
            email: email,
            username: `admin_${Math.random().toString(36).substr(2, 6)}`,
            showEmail: true,
            showPhone: false,
            phoneNumbers: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ message: 'Sub-admin created', id: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Create sub-admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
