import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch all users with Pagination
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const collection = db.collection('users');

        // Get total count for pagination
        const total = await collection.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const users = await collection
            .find({})
            .project({ password: 0 }) // Exclude passwords
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                totalPages,
                hasMore: page < totalPages
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a user by ID
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const result = await db.collection('users').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Log the event
        const { logAction } = await import('@/lib/audit');
        await logAction('USER_DELETED', `Admin deleted user ID: ${id}`, { targetUserId: id });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
