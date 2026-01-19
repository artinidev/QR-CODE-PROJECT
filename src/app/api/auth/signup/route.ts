import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { User } from '@/types/models';

export async function POST(request: NextRequest) {
    try {
        const { email, password, fullName } = await request.json();

        // Validation
        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Password validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const usersCollection = db.collection<User>('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser: Omit<User, '_id'> = {
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser as User);

        // Create default profile
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const profilesCollection = db.collection('profiles');

        await profilesCollection.insertOne({
            userId: result.insertedId,
            username: username,
            fullName: fullName,
            phoneNumbers: [],
            showEmail: true,
            showPhone: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                userId: result.insertedId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
