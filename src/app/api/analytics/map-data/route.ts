import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = decoded.userId;

        const { searchParams } = new URL(req.url);
        const qrCodeId = searchParams.get('qrCodeId');
        // const campaignId = searchParams.get('campaignId'); // Future support

        const db = await getDatabase();
        const scansCollection = db.collection('scans');
        const qrCodesCollection = db.collection('qr_codes');

        // 1. Get all QR codes owned by this user
        const userQRs = await qrCodesCollection.find({ userId: new ObjectId(userId) }).project({ _id: 1 }).toArray();
        const userQRIds = userQRs.map(qr => qr._id);

        if (userQRIds.length === 0) {
            return NextResponse.json({ locations: [] });
        }

        // 2. Build Match Query
        let matchQuery: any = {
            qrCodeId: { $in: userQRIds },
            'location.latitude': { $exists: true, $ne: 0 },
            'location.longitude': { $exists: true, $ne: 0 }
        };

        if (qrCodeId && ObjectId.isValid(qrCodeId)) {
            // Ensure this QR belongs to user
            const isOwner = userQRIds.some(id => id.toString() === qrCodeId);
            if (isOwner) {
                matchQuery.qrCodeId = new ObjectId(qrCodeId);
            }
        }

        // 3. Aggregate Scans by Location (Lat/Long)
        const locations = await scansCollection.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        lat: "$location.latitude",
                        lng: "$location.longitude",
                        city: "$location.city",
                        country: "$location.country"
                    },
                    count: { $sum: 1 },
                    lastScan: { $max: "$timestamp" }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: "$_id.city",
                    country: "$_id.country",
                    latitude: "$_id.lat",
                    longitude: "$_id.lng",
                    count: "$count",
                    lastScan: "$lastScan"
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        // 4. Get active QR list for the filter dropdown
        const activeQRs = await qrCodesCollection
            .find({ userId: new ObjectId(userId), deletedAt: { $exists: false } })
            .project({ _id: 1, name: 1, code: 1 })
            .toArray();

        return NextResponse.json({
            locations,
            activeQRs: activeQRs.map(qr => ({
                id: qr._id.toString(),
                name: qr.name,
                code: qr.code
            }))
        });

    } catch (error) {
        console.error('Error fetching map data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
