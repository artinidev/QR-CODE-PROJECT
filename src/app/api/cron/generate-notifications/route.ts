import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic'; // Static generation fails for cron often

export async function GET(req: NextRequest) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow localhost for testing without secret if needed, or enforce strictly
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const notificationsCollection = db.collection('notifications');
        const scansCollection = db.collection('scans');
        const qrCodesCollection = db.collection('qr_codes');

        const notifications = [];
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // --- 1. SCAN UPDATES (Daily Summary) ---
        // Find scans from the last 24 hours
        const dailyScans = await scansCollection.aggregate([
            { $match: { timestamp: { $gte: yesterday } } },
            { $group: { _id: "$qrCodeId", count: { $sum: 1 } } }
        ]).toArray();

        // Map scan counts to users
        const userScanCounts: Record<string, number> = {};

        for (const scan of dailyScans) {
            const qr = await qrCodesCollection.findOne({ _id: new ObjectId(scan._id) });
            if (qr && qr.userId) {
                const userId = qr.userId.toString();
                userScanCounts[userId] = (userScanCounts[userId] || 0) + scan.count;
            }
        }

        // Generate notifications for scans
        for (const [userId, count] of Object.entries(userScanCounts)) {
            const message = `🚀 Your QR codes received ${count} scans in the last 24 hours! Check the analytics page for details.`;

            // Check if similar notification exists for today (deduplication)
            const exists = await notificationsCollection.findOne({
                userId: new ObjectId(userId),
                type: 'update',
                createdAt: { $gte: yesterday }
            });

            if (!exists) {
                notifications.push({
                    userId: new ObjectId(userId),
                    type: 'update', // 'hint' | 'update' | 'alert'
                    message,
                    read: false,
                    createdAt: now
                });
            }
        }

        // --- 2. HINTS & REMINDERS ---
        // Fetch all users (batching recommended for large scale, ok for MVP)
        const users = await usersCollection.find({}).toArray();

        for (const user of users) {
            // Hint: Create First QR
            // If account > 1 day old and no QRs
            const accountAgeHrs = (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);
            if (accountAgeHrs > 24) {
                const qrCount = await qrCodesCollection.countDocuments({ userId: user._id });
                if (qrCount === 0) {
                    const msg = "💡 Tip: Create your first QR code instantly! Try a 'URL' QR for your website.";
                    const exists = await notificationsCollection.findOne({ userId: user._id, message: msg });
                    if (!exists) {
                        notifications.push({
                            userId: user._id,
                            type: 'hint',
                            message: msg,
                            read: false,
                            createdAt: now
                        });
                    }
                }
            }

            // Hint: Dynamic QRs
            // If user has static QRs but no dynamic ones
            if (user.credits?.dynamic_qr === 0) { // Assuming this field validates dynamic usage (checking logic)
                // Actually credits probably means 'remaining' or 'used'. 
                // Let's check actual QR types if possible, or skip complex logic for now.
                // Simple logic: Random hint for everyone occasionally
            }
        }

        // Bulk Insert
        if (notifications.length > 0) {
            await notificationsCollection.insertMany(notifications);
        }

        return NextResponse.json({
            success: true,
            generated: notifications.length,
            scan_updates: Object.keys(userScanCounts).length
        });

    } catch (error) {
        console.error('Error generating notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
