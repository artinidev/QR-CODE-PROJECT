import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { parseUserAgent, getLocationFromIP } from '@/lib/tracking';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        // Connect to DB
        let db;
        try {
            db = await getDatabase();
        } catch (dbError: any) {
            console.error('Database connection failed:', dbError);
            return NextResponse.json({ error: `Database connection failed: ${dbError.message}` }, { status: 500 });
        }

        const qrCodesCollection = db.collection('qr_codes');

        // Find the QR code
        const qrCode = await qrCodesCollection.findOne({ code });

        if (!qrCode) {
            return NextResponse.json({ error: `QR Code not found for code: ${code}` }, { status: 404 });
        }

        // Rich Tracking
        try {
            const userAgent = request.headers.get('user-agent') || 'Unknown';
            const forwarded = request.headers.get('x-forwarded-for');
            const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'; // Fallback
            const referrer = request.headers.get('referer') || 'Direct';

            // Parse User Agent & Location
            const { device, browser, os } = parseUserAgent(userAgent);

            // Get location (non-blocking if possible, but we need data)
            // Note: In serverless/edge, awaiting fetch adds latency. For now we await it.
            const location = await getLocationFromIP(ip);

            const scanEvent = {
                qrCodeId: qrCode._id,
                timestamp: new Date(),
                userAgent,
                ip,
                referrer,
                device,   // Mobile, Desktop, Tablet
                os,       // iOS, Android, macOS...
                browser,  // Chrome, Safari...
                location  // { city, country, ip }
            };

            const scansCollection = db.collection('scans');

            // Fire and forget insert
            scansCollection.insertOne(scanEvent).catch(err => console.error('Failed to insert scan:', err));

            qrCodesCollection.updateOne(
                { _id: qrCode._id },
                {
                    $inc: { scans: 1 },
                    $set: { lastScan: new Date() }
                }
            ).catch(err => console.error('Failed to update scan stats:', err));

        } catch (trackError) {
            console.error('Scan tracking setup failed:', trackError);
        }

        // Campaign Logic
        let destination = qrCode.targetUrl || 'https://google.com';
        const now = new Date();

        // 1. Check Not Started
        if (qrCode.startDate && now < new Date(qrCode.startDate)) {
            // If aggressive check needed. For now, we might just allow it or redirect to 'pending'.
            // Simplest validation for now:
            // return NextResponse.redirect(new URL('/campaign-pending', request.url));
            console.log('Campaign not started yet');
        }

        // 2. Check Expiration
        if (qrCode.endDate && now > new Date(qrCode.endDate)) {
            if (qrCode.redirectBehavior === 'fallback_expired' && qrCode.fallbackUrl) {
                destination = qrCode.fallbackUrl;
            } else if (qrCode.redirectBehavior === 'fallback_expired') {
                // Expired but no fallback - send to generic expired page
                return NextResponse.redirect(new URL('/campaign-expired', request.url));
            }
            // If 'always_primary', we do nothing and let it go to destination
        }

        // Handle Relative URLs (e.g. /u/username)
        if (destination.startsWith('/')) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
            destination = `${baseUrl}${destination}`;
        }
        // Handle Domain without protocol (e.g. google.com)
        else if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
            destination = `https://${destination}`;
        }

        // Return a redirect response
        return NextResponse.redirect(destination, {
            status: 302,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error: any) {
        console.error('Error processing QR redirect:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
