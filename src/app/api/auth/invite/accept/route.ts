import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
        }

        const db = await getDatabase();
        const usersCollection = db.collection('users');

        // Find user with valid token
        const user = await usersCollection.findOne({
            invitationToken: token,
            invitationExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired invitation token' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    status: 'active',
                    updatedAt: new Date()
                },
                $unset: {
                    invitationToken: "",
                    invitationExpires: ""
                }
            }
        );

        // Create a default profile if they don't have one (optional, but good for UX)
        const profilesCollection = db.collection('profiles');
        const existingProfile = await profilesCollection.findOne({ userId: user._id });

        if (!existingProfile) {
            await profilesCollection.insertOne({
                userId: user._id,
                fullName: 'New User',
                username: `user_${Math.random().toString(36).substr(2, 6)}`,
                email: user.email,
                showEmail: true,
                showPhone: false,
                phoneNumbers: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return NextResponse.json({ message: 'Account activated successfully' });

    } catch (error) {
        console.error('Accept invite error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
