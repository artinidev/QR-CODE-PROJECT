import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { User } from '@/types/models';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const db = await getDatabase();
        const users = db.collection<User>('users');

        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        if (!user || user.status !== 'active') {
            return NextResponse.json({ error: 'User not found or suspended' }, { status: 403 });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password || '');
        if (!isMatch) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await users.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Password update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
