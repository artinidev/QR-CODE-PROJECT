import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        verifyAdminToken(request);
        const body = await request.json();

        // Allowed fields to update
        const { status, limit, features, subscription, password } = body;

        const updateData: any = { updatedAt: new Date() };

        if (status) {
            if (!['active', 'suspended', 'pending'].includes(status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
            updateData.status = status;
        }

        if (limit) updateData.limits = limit; // mapped to 'limits' in db
        if (features) updateData.features = features;
        if (subscription) updateData.subscription = subscription;

        // Password Reset (Admin Override)
        if (password) {
            const bcrypt = require('bcryptjs'); // Dynamically require to avoid top-level if not used elsewhere
            updateData.password = await bcrypt.hash(password, 10);
        }

        const db = await getDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after', projection: { password: 0 } }
        );

        if (!result) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user: result,
        });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        console.error('Error updating user status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: userIdStr } = await params;
        verifyAdminToken(request);

        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const profilesCollection = db.collection('profiles');
        const scansCollection = db.collection('qr_scans');
        const analyticsCollection = db.collection('analytics');

        const userId = new ObjectId(userIdStr);

        // Delete user and all related data
        await Promise.all([
            usersCollection.deleteOne({ _id: userId }),
            profilesCollection.deleteMany({ userId }),
            scansCollection.deleteMany({ userId }),
            analyticsCollection.deleteMany({ userId }),
        ]);

        return NextResponse.json({
            message: 'User deleted successfully',
        });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
