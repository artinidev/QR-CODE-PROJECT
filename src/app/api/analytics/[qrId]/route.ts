import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ qrId: string }> }
) {
    try {
        const { qrId } = await params;

        if (!qrId || !ObjectId.isValid(qrId)) {
            return NextResponse.json({ error: 'Valid QR ID required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');
        const scansCollection = db.collection('scans');

        // Get QR code details
        const qrCode = await qrCodesCollection.findOne({ _id: new ObjectId(qrId) });

        if (!qrCode) {
            return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
        }

        const qrObjectId = new ObjectId(qrId);

        // Get total scans
        const totalScans = await scansCollection.countDocuments({ qrCodeId: qrObjectId });

        // Device breakdown
        const deviceBreakdown = await scansCollection.aggregate([
            { $match: { qrCodeId: qrObjectId } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
            { $project: { device: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]).toArray();

        // Browser breakdown
        const browserBreakdown = await scansCollection.aggregate([
            { $match: { qrCodeId: qrObjectId } },
            { $group: { _id: '$browser', count: { $sum: 1 } } },
            { $project: { browser: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]).toArray();

        // OS breakdown
        const osBreakdown = await scansCollection.aggregate([
            { $match: { qrCodeId: qrObjectId } },
            { $group: { _id: '$os', count: { $sum: 1 } } },
            { $project: { os: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]).toArray();

        // Location breakdown
        const locationBreakdown = await scansCollection.aggregate([
            { $match: { qrCodeId: qrObjectId } },
            {
                $group: {
                    _id: {
                        country: '$location.country',
                        city: '$location.city'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    country: '$_id.country',
                    city: '$_id.city',
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        // Scan timeline (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const scanTimeline = await scansCollection.aggregate([
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
                    scans: { $sum: 1 }
                }
            },
            { $project: { date: '$_id', scans: 1, _id: 0 } },
            { $sort: { date: 1 } }
        ]).toArray();

        // Recent scans (last 20)
        const recentScans = await scansCollection.find({ qrCodeId: qrObjectId })
            .sort({ timestamp: -1 })
            .limit(20)
            .toArray();

        // Calculate stats
        const uniqueDevices = new Set(recentScans.map(s => s.userAgent)).size;
        const topLocation = locationBreakdown[0]
            ? `${locationBreakdown[0].city}, ${locationBreakdown[0].country}`
            : 'No data';

        // Calculate scan trend (compare last 7 days vs previous 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const lastWeekScans = await scansCollection.countDocuments({
            qrCodeId: qrObjectId,
            timestamp: { $gte: sevenDaysAgo }
        });

        const previousWeekScans = await scansCollection.countDocuments({
            qrCodeId: qrObjectId,
            timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        });

        const scanTrend = previousWeekScans > 0
            ? Math.round(((lastWeekScans - previousWeekScans) / previousWeekScans) * 100)
            : 0;

        return NextResponse.json({
            qrCode: {
                id: qrCode._id.toString(),
                name: qrCode.name,
                url: qrCode.targetUrl,
                shortUrl: qrCode.code,
                createdAt: qrCode.createdAt
            },
            stats: {
                totalScans,
                uniqueDevices,
                topLocation,
                scanTrend
            },
            deviceBreakdown,
            browserBreakdown,
            osBreakdown,
            locationBreakdown,
            scanTimeline,
            recentScans: recentScans.map(scan => ({
                timestamp: scan.timestamp,
                device: scan.device,
                browser: scan.browser,
                os: scan.os,
                location: `${scan.location.city}, ${scan.location.country}`,
                referrer: scan.referrer
            }))
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
