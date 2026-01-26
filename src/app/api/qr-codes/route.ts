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
        const body = await req.json();
        const { profileId, targetUrl, name, color, isDynamic } = body;

        // In a real app we'd validate the session/user here. 
        // For now, assume profileId is allowed if provided, or fallback to a default if not.
        // If strict profileId requirement is needed:
        // if (!profileId || !ObjectId.isValid(profileId)) ...

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

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
            // If profileId is optional for free users, handle that. Assuming required for now or mocked.
            profileId: profileId && ObjectId.isValid(profileId) ? new ObjectId(profileId) : null,
            targetUrl: targetUrl || 'https://example.com', // The real destination
            name: name || 'Untitled QR',
            color: color || '#000000',
            isDynamic: !!isDynamic, // If false, the QR encodes targetUrl directly? 
            // ACTUALLY: The prompt implies *creating* the DB record. 
            // Even for "static" QRs we might want to track scans?
            // If strictly static, we don't *need* a DB record for redirection, 
            // but preserving it lets us edit it later or track it.
            // Let's assume ALL QRs created via this API get a record.
            createdAt: new Date(),
            scans: 0
        };

        const result = await qrCodesCollection.insertOne(newQrCode);
        const createdQR = await qrCodesCollection.findOne({ _id: result.insertedId });

        if (!createdQR) {
            return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
        }

        // Determine Base URL
        // 1. Env Var (Best for Prod/ngrok)
        // 2. Request Host (Fallback)
        let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!baseUrl) {
            const host = req.headers.get('host');
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            if (host) {
                // Fix for 0.0.0.0 -> localhost
                const cleanHost = host.replace('0.0.0.0', 'localhost');
                baseUrl = `${protocol}://${cleanHost}`;
            } else {
                baseUrl = new URL(req.url).origin;
            }
        }

        return NextResponse.json({
            id: createdQR._id.toString(),
            code: createdQR.code,
            targetUrl: createdQR.targetUrl,
            shortUrl: `${baseUrl}/q/${createdQR.code}`,
            isDynamic: createdQR.isDynamic,
            name: createdQR.name,
            color: createdQR.color,
            scans: createdQR.scans
        });

    } catch (error) {
        console.error('Error creating QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, targetUrl, name, color } = body;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Valid QR ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        const updateFields: any = {};
        if (targetUrl) updateFields.targetUrl = targetUrl;
        if (name) updateFields.name = name;
        if (color) updateFields.color = color;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No fields to update' });
        }

        const result = await qrCodesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'QR code updated successfully' });

    } catch (error) {
        console.error('Error updating QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const permanent = searchParams.get('permanent') === 'true';

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Valid QR ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        if (permanent) {
            // Permanent delete
            const result = await qrCodesCollection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, message: 'QR code permanently deleted' });
        } else {
            // Soft delete - set deletedAt timestamp
            const result = await qrCodesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { deletedAt: new Date() } }
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, message: 'QR code moved to trash' });
        }

    } catch (error) {
        console.error('Error deleting QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Get QR codes (List or Single)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get('profileId');
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const deletedOnly = searchParams.get('deletedOnly') === 'true';

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        let query: any = {};
        if (profileId && ObjectId.isValid(profileId)) {
            query.profileId = new ObjectId(profileId);
        }

        // Filter based on deleted status
        if (deletedOnly) {
            query.deletedAt = { $exists: true };
        } else if (!includeDeleted) {
            query.deletedAt = { $exists: false };
        }

        const qrCodes = await qrCodesCollection.find(query).sort({ createdAt: -1 }).toArray();

        // Determine Base URL helper
        const getBaseUrl = () => {
            let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
            if (!baseUrl) {
                const host = req.headers.get('host');
                const protocol = req.headers.get('x-forwarded-proto') || 'http';
                if (host) {
                    const cleanHost = host.replace('0.0.0.0', 'localhost');
                    baseUrl = `${protocol}://${cleanHost}`;
                } else {
                    baseUrl = new URL(req.url).origin;
                }
            }
            return baseUrl;
        };

        const baseUrl = getBaseUrl();

        return NextResponse.json({
            qrCodes: qrCodes.map(qr => ({
                id: qr._id.toString(),
                code: qr.code,
                targetUrl: qr.targetUrl,
                shortUrl: `${baseUrl}/q/${qr.code}`,
                isDynamic: qr.isDynamic,
                name: qr.name,
                color: qr.color,
                scans: qr.scans || 0,
                createdAt: qr.createdAt
            }))
        });

    } catch (error) {
        console.error('Error fetching QR codes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
