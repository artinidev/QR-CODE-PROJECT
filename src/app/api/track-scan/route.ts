import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper to parse user agent
function parseUserAgent(ua: string) {
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);

    let device = 'Desktop';
    if (isTablet) device = 'Tablet';
    else if (isMobile) device = 'Mobile';

    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { device, browser, os };
}

// Helper to get location from IP (using free ipapi.co service)
async function getLocationFromIP(ip: string) {
    try {
        // Skip for localhost/private IPs
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return { country: 'Local', city: 'Local', ip };
        }

        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: { 'User-Agent': 'PDI-Platform/1.0' }
        });

        if (!response.ok) {
            return { country: 'Unknown', city: 'Unknown', ip };
        }

        const data = await response.json();
        return {
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown',
            ip
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return { country: 'Unknown', city: 'Unknown', ip };
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { qrCodeId } = body;

        if (!qrCodeId || !ObjectId.isValid(qrCodeId)) {
            return NextResponse.json({ error: 'Valid QR code ID required' }, { status: 400 });
        }

        // Extract metadata from request
        const userAgent = req.headers.get('user-agent') || 'Unknown';
        const referrer = req.headers.get('referer') || req.headers.get('referrer') || 'Direct';

        // Get IP address
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '127.0.0.1';

        // Parse user agent
        const { device, browser, os } = parseUserAgent(userAgent);

        // Get location (async, but we'll await it)
        const location = await getLocationFromIP(ip);

        const db = await getDatabase();
        const scansCollection = db.collection('scans');
        const qrCodesCollection = db.collection('qr_codes');

        // Create scan event
        const scanEvent = {
            qrCodeId: new ObjectId(qrCodeId),
            timestamp: new Date(),
            device,
            browser,
            os,
            location,
            referrer,
            userAgent
        };

        // Insert scan event
        await scansCollection.insertOne(scanEvent);

        // Increment scan counter on QR code
        await qrCodesCollection.updateOne(
            { _id: new ObjectId(qrCodeId) },
            {
                $inc: { scans: 1 },
                $set: { lastScan: new Date() }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Scan tracked successfully',
            scan: {
                device,
                browser,
                location: location.city + ', ' + location.country
            }
        });

    } catch (error) {
        console.error('Error tracking scan:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
