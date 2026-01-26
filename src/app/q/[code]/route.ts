import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // find the QR code by the short code
        const qrCode = await qrCodesCollection.findOne({ code });

        if (!qrCode) {
            return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
        }

        // Increment scan count (fire and forget - mostly, wait to ensure it counts)
        await qrCodesCollection.updateOne(
            { _id: qrCode._id },
            { $inc: { scans: 1 } }
        );

        // Get the destination URL
        const destination = qrCode.targetUrl || 'https://google.com'; // Fallback

        // Return a redirect response
        // 302 Found (Temporary Redirect) - Use this instead of 307 for better compatibility with some QR readers/browsers in this context
        // Cache-Control: no-store, no-cache, must-revalidate to prevent browser caching of the redirect
        return NextResponse.redirect(destination, {
            status: 302,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error('Error processing QR redirect:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
