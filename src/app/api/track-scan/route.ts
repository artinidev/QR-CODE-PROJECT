import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { profileId, latitude, longitude, deviceType } = body;

        if (!profileId) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        const db = await getDatabase();

        // Simple location inference from IP if lat/long not provided (mock implementation for now if needed, 
        // but we will rely on client provided lat/long first, or basic IP lookup if we had a library)
        // For this demo, we store what we get.

        /* 
           Note: In a real production app, we would use a library like 'geoip-lite' 
           or a service to get location from IP if lat/lng is missing.
           For now, we trust the client or default to unknown.
        */

        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        const scanEvent = {
            profileId: new ObjectId(profileId),
            scannedAt: new Date(),
            ipAddress,
            userAgent,
            deviceType: deviceType || 'unknown', // e.g., 'mobile', 'desktop'
            location: {
                lat: latitude || null,
                lng: longitude || null,
            }
        };

        await db.collection('qr_scans').insertOne(scanEvent);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking scan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
