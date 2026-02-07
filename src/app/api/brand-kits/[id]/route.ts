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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const decoded = verifyToken(req);
        const db = await getDatabase();

        let query;
        try {
            query = { _id: new ObjectId(params.id), userId: new ObjectId(decoded.userId) };
        } catch (e) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const kit = await db.collection('brandKits').findOne(query);

        if (!kit) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(kit);
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const decoded = verifyToken(req);
        const updates = await req.json();
        delete updates._id;
        delete updates.userId;

        const db = await getDatabase();
        const userId = new ObjectId(decoded.userId);
        const kitId = new ObjectId(params.id);

        if (updates.isDefault) {
            await db.collection('brandKits').updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
        }

        const result = await db.collection('brandKits').updateOne(
            { _id: kitId, userId },
            { $set: { ...updates, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const decoded = verifyToken(req);
        const db = await getDatabase();
        const userId = new ObjectId(decoded.userId);

        const result = await db.collection('brandKits').deleteOne({
            _id: new ObjectId(params.id),
            userId
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
