import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { User, Profile } from '@/types/models';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const db = await getDatabase();

        const user = await db.collection<User>('users').findOne({
            _id: new ObjectId(decoded.userId)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const profile = await db.collection<Profile>('profiles').findOne({
            userId: user._id
        });

        return NextResponse.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            limits: user.limits,
            features: user.features,
            profile: {
                fullName: profile?.fullName || '',
                username: profile?.username || ''
            }
        });

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
