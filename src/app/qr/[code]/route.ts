import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// This endpoint handles QR code redirects
// When someone scans a QR code with short URL like: https://yourapp.com/qr/abc123
// It redirects them to the actual profile page

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params;

        console.log('[QR Redirect] Received code:', code);

        if (!code) {
            console.log('[QR Redirect] No code provided, redirecting to home');
            return NextResponse.redirect(new URL('/', request.url));
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // Find the profile associated with this QR code
        const qrCode = await qrCodesCollection.findOne({ code });

        console.log('[QR Redirect] QR code found:', qrCode ? 'yes' : 'no');

        if (!qrCode) {
            console.log('[QR Redirect] QR code not found in database');
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Get the profile to find the username
        const profilesCollection = db.collection('profiles');
        const profile = await profilesCollection.findOne({ _id: qrCode.profileId });

        console.log('[QR Redirect] Profile found:', profile ? profile.username : 'no');

        if (!profile) {
            console.log('[QR Redirect] Profile not found');
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Increment scan counter
        await qrCodesCollection.updateOne(
            { code },
            { $inc: { scans: 1 } }
        );

        // Redirect to the profile page using username
        const profileUrl = new URL(`/u/${profile.username}`, request.url);
        console.log('[QR Redirect] Redirecting to:', profileUrl.toString());
        return NextResponse.redirect(profileUrl);

    } catch (error) {
        console.error('Error in QR redirect:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
