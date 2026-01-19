import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyAdminToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        throw new Error('Unauthorized');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    if (decoded.role !== 'admin') {
        throw new Error('Forbidden');
    }
    return decoded;
}

export async function GET(request: NextRequest) {
    try {
        verifyAdminToken(request);

        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const profilesCollection = db.collection('profiles');
        const scansCollection = db.collection('qr_scans');

        // Get all users with their profiles
        const users = await usersCollection
            .find({}, { projection: { password: 0 } })
            .toArray();

        const usersWithProfiles = await Promise.all(
            users.map(async (user) => {
                const profile = await profilesCollection.findOne({ userId: user._id });
                const scanCount = await scansCollection.countDocuments({ userId: user._id });

                return {
                    ...user,
                    profile,
                    totalScans: scanCount,
                };
            })
        );

        return NextResponse.json({ users: usersWithProfiles });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
