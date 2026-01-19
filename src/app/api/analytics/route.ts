import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        throw new Error('Unauthorized');
    }
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
}

export async function GET(request: NextRequest) {
    try {
        const decoded = verifyToken(request);
        const { searchParams } = new URL(request.url);
        const profileIdParam = searchParams.get('profileId');

        const db = await getDatabase();
        const profilesCollection = db.collection('profiles');
        const scansCollection = db.collection('qr_scans');

        let profileId: ObjectId;

        if (profileIdParam && ObjectId.isValid(profileIdParam)) {
            // Validate that this profile belongs to the user
            const profile = await profilesCollection.findOne({
                _id: new ObjectId(profileIdParam),
                userId: new ObjectId(decoded.userId)
            });

            if (!profile) {
                return NextResponse.json({ error: 'Profile not found or unauthorized' }, { status: 404 });
            }
            profileId = profile._id!;
        } else {
            // Default: Get the first active profile for the user to show initial data
            // Or we could return aggregate data if we preferred
            const firstProfile = await profilesCollection.findOne({
                userId: new ObjectId(decoded.userId),
                status: 'active'
            });

            if (!firstProfile) {
                return NextResponse.json({ totalScans: 0, uniqueScans: 0, recentScans: [] });
            }
            profileId = firstProfile._id!;
        }

        // Get total scans
        const totalScans = await scansCollection.countDocuments({
            profileId: profileId,
        });

        // Get scans by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const scansByDate = await scansCollection
            .aggregate([
                {
                    $match: {
                        profileId: profileId,
                        scannedAt: { $gte: thirtyDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$scannedAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ])
            .toArray();

        // Get unique scans (by IP address)
        const uniqueScans = await scansCollection
            .aggregate([
                {
                    $match: {
                        profileId: profileId,
                    },
                },
                {
                    $group: {
                        _id: '$ipAddress',
                    },
                },
                {
                    $count: 'total',
                },
            ])
            .toArray();

        // Get last scanned date
        const lastScan = await scansCollection.findOne(
            { profileId: profileId },
            { sort: { scannedAt: -1 } }
        );

        // Get Recent Scans for Live Feed
        const recentScans = await scansCollection
            .find({ profileId: profileId })
            .sort({ scannedAt: -1 })
            .limit(10)
            .toArray();

        return NextResponse.json({
            profileId: profileId.toString(),
            totalScans,
            uniqueScans: uniqueScans[0]?.total || 0,
            lastScannedAt: lastScan?.scannedAt,
            scansByDate: scansByDate.map((item) => ({
                date: item._id,
                count: item.count,
            })),
            recentScans
        });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
