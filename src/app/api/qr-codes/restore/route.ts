import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Valid QR ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // Restore by removing deletedAt field
        const result = await qrCodesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $unset: { deletedAt: "" } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'QR code restored successfully' });

    } catch (error) {
        console.error('Error restoring QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
