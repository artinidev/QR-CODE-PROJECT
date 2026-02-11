import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to get user from token
async function getUser(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase();
        const notifications = await db.collection('notifications')
            .find({ userId: new ObjectId(user.userId) })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        // Get unread count
        const unreadCount = await db.collection('notifications').countDocuments({
            userId: new ObjectId(user.userId),
            read: false
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { notificationId, action } = body;

        const db = await getDatabase();

        if (action === 'mark_read') {
            if (notificationId === 'all') {
                await db.collection('notifications').updateMany(
                    { userId: new ObjectId(user.userId), read: false },
                    { $set: { read: true } }
                );
            } else {
                await db.collection('notifications').updateOne(
                    { _id: new ObjectId(notificationId), userId: new ObjectId(user.userId) },
                    { $set: { read: true } }
                );
            }
        } else if (action === 'delete') {
            await db.collection('notifications').deleteOne(
                { _id: new ObjectId(notificationId), userId: new ObjectId(user.userId) }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
