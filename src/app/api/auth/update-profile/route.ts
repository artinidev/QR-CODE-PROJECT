import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Profile } from '@/types/models';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { fullName } = await request.json();

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const db = await getDatabase();

        await db.collection<Profile>('profiles').updateOne(
            { userId: new ObjectId(decoded.userId) },
            {
                $set: {
                    fullName,
                    updatedAt: new Date()
                }
            },
            { upsert: true } // Create if doesn't exist (though it should)
        );

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
