import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await getDatabase();
        const qrCodes = await db.collection('qr_codes').find({}).toArray();

        return NextResponse.json({
            count: qrCodes.length,
            codes: qrCodes.map(qr => ({
                code: qr.code,
                profileId: qr.profileId?.toString(),
                scans: qr.scans || 0,
                createdAt: qr.createdAt
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
