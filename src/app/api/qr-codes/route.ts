import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Generate a unique short code for QR
function generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function POST(req: NextRequest) {
    try {
        const { profileId } = await req.json();

        if (!profileId || !ObjectId.isValid(profileId)) {
            return NextResponse.json({ error: 'Valid profile ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');
        const profilesCollection = db.collection('profiles');

        // Check if profile exists
        const profile = await profilesCollection.findOne({ _id: new ObjectId(profileId) });
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Check if QR code already exists for this profile
        let qrCode = await qrCodesCollection.findOne({ profileId: new ObjectId(profileId) });

        if (!qrCode) {
            // Generate unique code
            let code = generateShortCode();
            let exists = await qrCodesCollection.findOne({ code });

            // Ensure uniqueness
            while (exists) {
                code = generateShortCode();
                exists = await qrCodesCollection.findOne({ code });
            }

            // Create new QR code entry
            const newQrCode = {
                code,
                profileId: new ObjectId(profileId),
                createdAt: new Date(),
                scans: 0
            };

            const result = await qrCodesCollection.insertOne(newQrCode);

            // Fetch the inserted document
            qrCode = await qrCodesCollection.findOne({ _id: result.insertedId });
        }

        if (!qrCode) {
            return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
        }

        return NextResponse.json({
            code: qrCode.code,
            url: `/qr/${qrCode.code}`,
            fullUrl: `${new URL(req.url).origin}/qr/${qrCode.code}`
        });

    } catch (error) {
        console.error('Error creating QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Get QR code for a profile
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get('profileId');

        if (!profileId || !ObjectId.isValid(profileId)) {
            return NextResponse.json({ error: 'Valid profile ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        const qrCode = await qrCodesCollection.findOne({ profileId: new ObjectId(profileId) });

        if (!qrCode) {
            return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
        }

        return NextResponse.json({
            code: qrCode.code,
            url: `/qr/${qrCode.code}`,
            fullUrl: `${new URL(req.url).origin}/qr/${qrCode.code}`,
            scans: qrCode.scans || 0
        });

    } catch (error) {
        console.error('Error fetching QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
