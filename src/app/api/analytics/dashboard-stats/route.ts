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

        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'month';

        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();
        let format = "%Y-%m-%d";
        let groupBy = "day"; // day or month

        // Determine Date Ranges (Current vs Previous) for growth calculation
        if (range === 'week') {
            startDate.setDate(now.getDate() - 7);
            previousStartDate.setDate(now.getDate() - 14);
        } else if (range === 'month') {
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(now.getDate() - 60);
        } else if (range === 'year') {
            startDate.setMonth(now.getMonth() - 12); // Last 12 months
            startDate.setDate(1);
            previousStartDate.setMonth(now.getMonth() - 24);
            previousStartDate.setDate(1);
            format = "%Y-%m";
            groupBy = "month";
        }

        // --- Helper: Get Timeline Data ---
        const getTimeline = async (collection: string, dateField: string, matchQuery: any, start: Date) => {
            const raw = await db.collection(collection).aggregate([
                {
                    $match: {
                        ...matchQuery,
                        [dateField]: { $gte: start, $lte: now }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: format, date: `$${dateField}` } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray();

            // Fill gaps
            const result = [];
            const labels = [];

            if (groupBy === 'month') {
                for (let i = 11; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(now.getMonth() - i);
                    const key = d.toISOString().slice(0, 7); // YYYY-MM
                    const label = d.toLocaleDateString('en-US', { month: 'short' });
                    const entry = raw.find(r => r._id === key);
                    result.push({ date: key, count: entry ? entry.count : 0 });
                    labels.push(label);
                }
            } else {
                const days = range === 'week' ? 7 : 30;
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(now.getDate() - i);
                    const key = d.toISOString().split('T')[0];
                    const label = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
                    const entry = raw.find(r => r._id === key);
                    result.push({ date: key, count: entry ? entry.count : 0 });
                    labels.push(label);
                }
            }
            return { data: result, labels };
        };

        // --- Helper: Get Count for Range ---
        const getCount = async (collection: string, dateField: string, matchQuery: any, start: Date, end: Date) => {
            return await db.collection(collection).countDocuments({
                ...matchQuery,
                [dateField]: { $gte: start, $lt: end }
            });
        };

        // 1. Fetch User QR Codes
        const userQrCodes = await db.collection('qr_codes').find({ userId }).toArray(); // Removed projection to get createdAt/updatedAt
        const qrIds = userQrCodes.map(q => q._id);

        // 2. Metrics for ProgressCard (Gadgets)

        // A. Active QR Codes
        // Logic: Total QR codes created by user that are not deleted.
        // Chart: Timeline of creations (or cumulative active count over time? Usually just creations for sparkline is easier for "activity")
        const activeQrCodesValue = await db.collection('qr_codes').countDocuments({ userId, deletedAt: { $exists: false } });
        const activeQrTimeline = await getTimeline('qr_codes', 'createdAt', { userId, deletedAt: { $exists: false } }, startDate);

        // B. Links Updated
        // Logic: Number of QR codes updated within the date range.
        const linksUpdatedValue = await getCount('qr_codes', 'updatedAt', { userId }, startDate, now);
        const updatesTimeline = await getTimeline('qr_codes', 'updatedAt', { userId }, startDate);

        // C. Successful Redirects (Total Scans)
        // Logic: Total scans in the period.
        const conversionScansValue = await getCount('scans', 'timestamp', { qrCodeId: { $in: qrIds } }, startDate, now);
        const conversionTimeline = await getTimeline('scans', 'timestamp', { qrCodeId: { $in: qrIds } }, startDate);


        // 3. Other Metrics (for other cards, keeping existing logic mostly)
        const totalScans = await db.collection('scans').countDocuments({ qrCodeId: { $in: qrIds } });
        const scansCurrent = conversionScansValue; // Same as above
        const scansPrevious = await getCount('scans', 'timestamp', { qrCodeId: { $in: qrIds } }, previousStartDate, startDate);

        // Avg Scans/QR
        const avgScans = activeQrCodesValue > 0 ? Math.round(totalScans / activeQrCodesValue) : 0;

        // Calculate Growth Rates
        const calcGrowth = (current: number, prev: number) => {
            if (prev === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - prev) / prev) * 100);
        };

        // 4. Top Performers
        const topPerformers = await db.collection('scans').aggregate([
            { $match: { qrCodeId: { $in: qrIds } } },
            { $group: { _id: "$qrCodeId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "qr_codes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "qrDetails"
                }
            },
            { $unwind: "$qrDetails" }
        ]).toArray();

        // 5. Engagement Rate (Device Breakdown)
        const deviceStats = await db.collection('scans').aggregate([
            { $match: { qrCodeId: { $in: qrIds } } },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ]).toArray();

        // 6. OS Breakdown
        const osStats = await db.collection('scans').aggregate([
            { $match: { qrCodeId: { $in: qrIds } } },
            { $group: { _id: "$os", count: { $sum: 1 } } }
        ]).toArray();


        // 7. Top Locations
        const locationStats = await db.collection('scans').aggregate([
            { $match: { qrCodeId: { $in: qrIds } } },
            {
                $group: {
                    _id: {
                        city: "$location.city",
                        country: "$location.country"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();

        // 8. Marketing Campaigns Gadget Data
        const marketingCampaigns = await db.collection('qr_codes')
            .find({ userId, type: 'marketing-campaign', deletedAt: { $exists: false } })
            .sort({ createdAt: -1 })
            .limit(3)
            .toArray();

        const marketingGadgetData = await Promise.all(marketingCampaigns.map(async (campaign) => {
            const campaignScans = await db.collection('scans').find({ qrCodeId: campaign._id }).sort({ timestamp: -1 }).toArray();
            const totalScans = campaignScans.length;
            const lastScan = campaignScans.length > 0 ? campaignScans[0].timestamp : null;

            // Calculate time ago
            let lastScanText = 'Never';
            if (lastScan) {
                const diffMs = now.getTime() - new Date(lastScan).getTime();
                const diffMins = Math.round(diffMs / 60000);
                if (diffMins < 60) lastScanText = `${diffMins}m ago`;
                else {
                    const diffHours = Math.round(diffMins / 60);
                    if (diffHours < 24) lastScanText = `${diffHours}h ago`;
                    else lastScanText = `${Math.round(diffHours / 24)}d ago`;
                }
            }

            // Top Location for this specific campaign
            const topLoc = await db.collection('scans').aggregate([
                { $match: { qrCodeId: campaign._id } },
                { $group: { _id: "$location.city", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]).toArray();

            const locationText = topLoc.length > 0 && topLoc[0]._id ? topLoc[0]._id : "No data";

            return {
                id: campaign._id,
                name: campaign.name || 'Unnamed Campaign',
                scans: `${totalScans.toLocaleString()} Total Scans`,
                badges: campaign.status === 'active' ? ['Active'] : ['Dynamic'], // Simplified badge logic
                location: locationText,
                lastScan: lastScanText,
                // Add color/icon helpers if needed by frontend, but frontend has icons based on index/random or fixed.
                // We'll pass raw data and let frontend decide styling or pass consistent styling here.
                // RecentProjectsCard uses Megaphone icon.
            };
        }));


        return NextResponse.json({
            metrics: {
                totalScans: { value: totalScans, change: calcGrowth(scansCurrent, scansPrevious) },
                totalQrCodes: { value: activeQrCodesValue, change: 0 },
                avgScansPerQr: { value: avgScans, change: 0 },
                activeQrCodes: { value: activeQrCodesValue, change: 0 },
                // Specific gadget metrics
                gadgets: {
                    activeQrCodes: {
                        value: activeQrCodesValue,
                        timeline: activeQrTimeline.data.map(d => d.count)
                    },
                    linksUpdated: {
                        value: linksUpdatedValue,
                        timeline: updatesTimeline.data.map(d => d.count)
                    },

                    successfulRedirects: {
                        value: conversionScansValue,
                        timeline: conversionTimeline.data.map(d => d.count)
                    },
                    marketingCampaigns: marketingGadgetData
                }
            },
            charts: {
                labels: conversionTimeline.labels, // Default timeline labels
                scans: conversionTimeline.data.map(d => d.count),
                updates: updatesTimeline.data.map(d => d.count)
            },
            topPerformers: topPerformers.map((p, i) => ({
                id: p._id,
                name: p.qrDetails.name || 'Unnamed QR',
                scans: p.count,
                rank: i + 1
            })),
            deviceStats: deviceStats.map(d => ({
                label: d._id || 'Unknown',
                value: d.count
            })),
            osStats: osStats.map(d => ({
                label: d._id || 'Unknown',
                value: d.count
            })),
            locationStats: locationStats.map(d => ({
                city: d._id.city || 'Unknown',
                country: d._id.country || 'Unknown',
                count: d.count
            }))
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
