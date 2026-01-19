import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { Profile } from '@/types/models';
import { nanoid } from 'nanoid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'active';
        const search = searchParams.get('search');

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        const query: any = {
            userId: new ObjectId(decoded.userId),
            status: status === 'deleted' ? 'deleted' : { $ne: 'deleted' }
        };

        if (search) {
            query.fullName = { $regex: search, $options: 'i' };
        }

        const profiles = await profilesCollection.find(query).sort({ updatedAt: -1 }).toArray();

        return NextResponse.json(profiles);
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching profiles:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const body = await request.json();

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        // Generate a unique username if not provided or ensure uniqueness
        const baseUsername = (body.fullName || 'user').toLowerCase().replace(/\s+/g, '');
        let username = `${baseUsername}-${nanoid(6)}`;

        const newProfile: Omit<Profile, '_id'> = {
            userId: new ObjectId(decoded.userId),
            username: username,
            fullName: body.fullName || 'New Profile',
            jobTitle: body.jobTitle || '',
            company: body.company || '',
            phoneNumbers: body.phoneNumbers || [],
            photo: body.photo,
            showEmail: true,
            showPhone: true,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await profilesCollection.insertOne(newProfile);

        return NextResponse.json({
            message: 'Profile created successfully',
            profile: { ...newProfile, _id: result.insertedId }
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error creating profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
