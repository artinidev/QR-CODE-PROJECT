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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ profileId: string }> }
) {
    try {
        const { profileId } = await params;
        const decoded = verifyToken(req);

        if (!profileId || !ObjectId.isValid(profileId)) {
            return NextResponse.json({ error: 'Valid Profile ID required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');
        const scansCollection = db.collection('scans');

        // 1. Find the QR Code associated with this Profile
        const qrCode = await qrCodesCollection.findOne({
            profileId: new ObjectId(profileId),
            deletedAt: { $exists: false } // Only active QR codes
        });

        if (!qrCode) {
            // Profile exists but no QR code generated yet ? 
            // Or allow returning empty stats
            return NextResponse.json({
                totalScans: 0,
                uniqueScans: 0,
                scansByDate: [],
                message: 'No QR code found for this profile'
            });
        }

        const qrObjectId = qrCode._id;

        // 2. Get Total Scans
        const totalScans = await scansCollection.countDocuments({ qrCodeId: qrObjectId });

        // 3. Get Unique Scans (Approximation by IP or Device)
        // Aggregation to count unique IPs
        const uniqueScansResult = await scansCollection.aggregate([
            { $match: { qrCodeId: qrObjectId } },
            { $group: { _id: "$ip" } }, // Group by IP
            { $count: "count" }
        ]).toArray();
        const uniqueScans = uniqueScansResult.length > 0 ? uniqueScansResult[0].count : 0;

        // 4. Get Scans by Date (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const scansByDate = await scansCollection.aggregate([
            {
                $match: {
                    qrCodeId: qrObjectId,
                    timestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $project: { date: '$_id', count: 1, _id: 0 } },
            { $sort: { date: 1 } }
        ]).toArray();

        return NextResponse.json({
            qrCodeId: qrCode._id,
            totalScans,
            uniqueScans,
            scansByDate
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching profile analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
