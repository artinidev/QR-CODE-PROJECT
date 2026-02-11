import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// This endpoint handles QR code redirects
// When someone scans a QR code with short URL like: https://yourapp.com/qr/abc123
// It redirects them to the actual profile page

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // Find the profile associated with this QR code
        const qrCode = await qrCodesCollection.findOne({ code });

        if (!qrCode) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Get the profile to find the username
        const profilesCollection = db.collection('profiles');
        const profile = await profilesCollection.findOne({ _id: qrCode.profileId });

        if (!profile) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirect to the profile page using username
        const profileUrl = new URL(`/u/${profile.username}`, request.url);
        return NextResponse.redirect(profileUrl);

    } catch (error) {
        console.error('Error in QR redirect:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
