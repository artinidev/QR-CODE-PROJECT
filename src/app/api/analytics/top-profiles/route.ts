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

export async function GET(req: NextRequest) {
    try {
        const decoded = verifyToken(req);
        const db = await getDatabase();
        const userId = new ObjectId(decoded.userId);

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    status: { $ne: 'deleted' }
                }
            },
            {
                $lookup: {
                    from: 'qr_codes',
                    localField: '_id',
                    foreignField: 'profileId',
                    as: 'qrCodes'
                }
            },
            {
                $lookup: {
                    from: 'scans',
                    let: { qrIds: '$qrCodes._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$qrCodeId', '$$qrIds'] }
                            }
                        },
                        { $count: 'count' }
                    ],
                    as: 'scanStats'
                }
            },
            {
                $project: {
                    _id: 1,
                    profileId: '$_id',
                    profileName: '$fullName',
                    profileRole: '$jobTitle',
                    profilePhoto: '$photo',
                    totalScans: {
                        $ifNull: [
                            { $arrayElemAt: ['$scanStats.count', 0] },
                            0
                        ]
                    }
                }
            },
            {
                $facet: {
                    topProfiles: [
                        { $sort: { totalScans: -1 } },
                        { $limit: 10 }
                    ],
                    stats: [
                        {
                            $group: {
                                _id: null,
                                totalScans: { $sum: "$totalScans" },
                                activeCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ];

        const [result] = await db.collection('profiles').aggregate(pipeline).toArray();

        const topProfiles = result?.topProfiles || [];
        const stats = result?.stats[0] || { totalScans: 0, activeCount: 0 };

        // --- Timeline Aggregation (Last 30 Days) ---
        // 1. Get all Profile IDs for this user
        const userProfiles = await db.collection('profiles').find(
            { userId: userId, status: { $ne: 'deleted' } },
            { projection: { _id: 1 } }
        ).toArray();
        const profileIds = userProfiles.map(p => p._id);

        // 2. Get all QR Codes for these profiles
        const userQrCodes = await db.collection('qr_codes').find(
            { profileId: { $in: profileIds } },
            { projection: { _id: 1 } }
        ).toArray();
        const qrIds = userQrCodes.map(q => q._id);

        // ... existing profile/qr code fetch ...
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'month'; // 'week', 'month', 'year'

        // 3. Aggregate Scans by Date
        const now = new Date();
        let startDate = new Date();
        let dateFormat = "%Y-%m-%d";
        let daysToFill = 30;

        if (range === 'week') {
            startDate.setDate(now.getDate() - 7);
            daysToFill = 7;
        } else if (range === 'month') {
            startDate.setDate(now.getDate() - 30);
            daysToFill = 30;
        } else if (range === 'year') {
            startDate.setMonth(now.getMonth() - 11); // Last 12 months
            startDate.setDate(1); // Start of that month
            dateFormat = "%Y-%m"; // Group by month
        }

        const timelineRaw = await db.collection('scans').aggregate([
            {
                $match: {
                    qrCodeId: { $in: qrIds },
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        // 4. Fill missing dates with 0
        const scansByDate = [];

        if (range === 'year') {
            // Fill months
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(now.getMonth() - i);
                const dateStr = d.toISOString().slice(0, 7); // YYYY-MM
                const entry = timelineRaw.find(item => item._id === dateStr);
                scansByDate.push({
                    date: dateStr,
                    count: entry ? entry.count : 0
                });
            }
        } else {
            // Fill days
            for (let i = daysToFill - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const entry = timelineRaw.find(item => item._id === dateStr);
                scansByDate.push({
                    date: dateStr,
                    count: entry ? entry.count : 0
                });
            }
        }

        return NextResponse.json({
            topProfiles,
            stats,
            scansByDate
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching top profiles:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
