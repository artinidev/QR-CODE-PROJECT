import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { Group, Profile } from '@/types/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const db = await getDatabase();
        const groupsCollection = db.collection<Group>('groups');
        const profilesCollection = db.collection<Profile>('profiles');

        const groups = await groupsCollection.find({
            userId: new ObjectId(decoded.userId)
        }).sort({ createdAt: -1 }).toArray();

        // Enrich with real-time counts
        const enrichedGroups = await Promise.all(groups.map(async (group) => {
            if (!group._id) return { ...group, profileCount: 0 };

            const count = await profilesCollection.countDocuments({
                userId: new ObjectId(decoded.userId),
                groupId: group._id.toString(),
                status: { $ne: 'deleted' }
            });
            return { ...group, profileCount: count };
        }));

        return NextResponse.json(enrichedGroups);
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching groups:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection<Group>('groups');

        const newGroup = {
            userId: new ObjectId(decoded.userId),
            name: body.name,
            description: body.description || '',
            color: body.color || 'blue',
            defaultBrandKitId: body.defaultBrandKitId,
            profileCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await groupsCollection.insertOne(newGroup);

        return NextResponse.json({
            message: 'Group created',
            group: { ...newGroup, _id: result.insertedId }
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error creating group:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
