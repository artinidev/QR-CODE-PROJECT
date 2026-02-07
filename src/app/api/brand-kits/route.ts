
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error('Unauthorized');
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function GET(req: NextRequest) {
    try {
        const decoded = verifyToken(req);

        const db = await getDatabase();
        const userId = new ObjectId(decoded.userId);

        const brandKits = await db.collection('brandKits')
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(brandKits);
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching brand kits:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const decoded = verifyToken(req);
        const { name, config, isDefault } = await req.json();

        if (!name || !config) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDatabase();
        const userId = new ObjectId(decoded.userId);

        // If this is set to default, unset others
        if (isDefault) {
            await db.collection('brandKits').updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
        }

        const newKit = {
            userId,
            name,
            config,
            isDefault: isDefault || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('brandKits').insertOne(newKit);

        return NextResponse.json({ ...newKit, _id: result.insertedId }, { status: 201 });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error creating brand kit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
