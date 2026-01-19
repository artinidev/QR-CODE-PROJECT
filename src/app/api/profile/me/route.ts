import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        throw new Error('Unauthorized');
    }
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
}

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const db = await getDatabase();
        const profilesCollection = db.collection('profiles');

        const profile = await profilesCollection.findOne({
            userId: new ObjectId(decoded.userId),
        });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(profile);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const updates = await request.json();

        // Remove _id and userId from updates if present to avoid errors or type corruption
        delete updates._id;
        delete updates.userId;

        const db = await getDatabase();
        const profilesCollection = db.collection('profiles');

        // Check if username is being changed and if it's available
        if (updates.username) {
            const existingProfile = await profilesCollection.findOne({
                username: updates.username,
                userId: { $ne: new ObjectId(decoded.userId) },
            });

            if (existingProfile) {
                return NextResponse.json(
                    { error: 'Username already taken' },
                    { status: 409 }
                );
            }
        }

        // Update profile
        const result = await profilesCollection.findOneAndUpdate(
            { userId: new ObjectId(decoded.userId) },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            profile: result,
        });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
