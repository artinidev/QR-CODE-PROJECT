import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { Profile } from '@/types/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const decoded = verifyToken(request);
        const { id } = await params;

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        const profile = await profilesCollection.findOne({
            _id: new ObjectId(id),
            userId: new ObjectId(decoded.userId)
        });

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        return NextResponse.json(profile);
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const decoded = verifyToken(request);
        const { id } = await params;
        const updates = await request.json();

        // Safety: Remove IDs
        delete updates._id;
        delete updates.userId;

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        const result = await profilesCollection.findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(decoded.userId) },
            { $set: { ...updates, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        return NextResponse.json({ message: 'Updated', profile: result });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const decoded = verifyToken(request);
        const { id } = await params;

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        // Soft Delete
        const result = await profilesCollection.findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(decoded.userId) },
            {
                $set: {
                    status: 'deleted',
                    updatedAt: new Date()
                }
            }
        );

        if (!result) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

        return NextResponse.json({ message: 'Profile deleted' });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
