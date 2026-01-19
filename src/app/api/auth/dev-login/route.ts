import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { User } from '@/types/models';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const db = await getDatabase();
        const usersCollection = db.collection<User>('users');
        const profilesCollection = db.collection('profiles');

        const testEmail = 'dev@example.com';

        // Check if existing dev user exists, if not create one
        let user = await usersCollection.findOne({ email: testEmail });

        if (!user) {
            // Create dev user
            const newUser: Omit<User, '_id'> = {
                email: testEmail,
                password: 'devpass_placeholder_hash', // We won't check password for dev login
                role: 'user',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await usersCollection.insertOne(newUser as User);

            // Fetch the inserted user to get the _id with correct typing
            user = await usersCollection.findOne({ _id: result.insertedId });

            if (!user) {
                throw new Error("Failed to create user");
            }

            // Create profile for dev user
            const username = 'devuser';

            // Check if profile exists (unlikely if user didn't exist, but good practice)
            const existingProfile = await profilesCollection.findOne({ username });
            if (!existingProfile) {
                await profilesCollection.insertOne({
                    userId: user._id!,
                    username: username,
                    fullName: 'Developer User',
                    phoneNumbers: ['555-0123'],
                    showEmail: true,
                    showPhone: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }

        // Generate Token
        const token = jwt.sign(
            {
                userId: user._id!.toString(),
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with cookie
        const response = NextResponse.json({
            message: 'Dev login successful',
            user: {
                id: user._id,
                email: user.email,
                fullName: 'Developer User',
            },
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Dev login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
