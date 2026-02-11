import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (e) {
        return null;
    }
}

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
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = decoded.userId;

        const body = await req.json();
        const { profileId, targetUrl, name, color, isDynamic } = body;

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
            userId: new ObjectId(userId),
            // If profileId is optional for free users, handle that.
            profileId: profileId && ObjectId.isValid(profileId) ? new ObjectId(profileId) : null,
            targetUrl: targetUrl || 'https://example.com', // The real destination
            name: name || 'Untitled QR',
            color: color || '#000000',
            isDynamic: !!isDynamic,

            // Campaign Fields
            type: body.type || 'standard', // 'standard' | 'marketing-campaign'
            objective: body.objective || null,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,
            fallbackUrl: body.fallbackUrl || null,
            redirectBehavior: body.redirectBehavior || 'always_primary', // 'always_primary', 'fallback_expired'

            createdAt: new Date(),
            scans: 0
        };

        const result = await qrCodesCollection.insertOne(newQrCode);
        const createdQR = await qrCodesCollection.findOne({ _id: result.insertedId });

        if (!createdQR) {
            return NextResponse.json({ error: 'Failed to create QR code' }, { status: 500 });
        }

        // Determine Base URL
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
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = decoded.userId;

        const body = await req.json();
        const { id, targetUrl, name, color } = body;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Valid QR ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // Ensure user owns this QR
        const existingQR = await qrCodesCollection.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) });
        if (!existingQR) {
            return NextResponse.json({ error: 'QR code not found or unauthorized' }, { status: 404 });
        }

        const updateFields: any = {};
        if (targetUrl) updateFields.targetUrl = targetUrl;
        if (name) updateFields.name = name;
        if (color) updateFields.color = color;
        updateFields.updatedAt = new Date();

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No fields to update' });
        }

        const result = await qrCodesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        return NextResponse.json({ success: true, message: 'QR code updated successfully' });

    } catch (error) {
        console.error('Error updating QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = decoded.userId;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const permanent = searchParams.get('permanent') === 'true';

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Valid QR ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        // Ensure user owns this QR
        const matchQuery = { _id: new ObjectId(id), userId: new ObjectId(userId) };

        if (permanent) {
            // Permanent delete
            const result = await qrCodesCollection.deleteOne(matchQuery);
            if (result.deletedCount === 0) {
                return NextResponse.json({ error: 'QR code not found or unauthorized' }, { status: 404 });
            }
            return NextResponse.json({ success: true, message: 'QR code permanently deleted' });
        } else {
            // Soft delete
            const result = await qrCodesCollection.updateOne(
                matchQuery,
                { $set: { deletedAt: new Date() } }
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({ error: 'QR code not found or unauthorized' }, { status: 404 });
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
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = decoded.userId;

        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get('profileId');
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const deletedOnly = searchParams.get('deletedOnly') === 'true';

        const db = await getDatabase();
        const qrCodesCollection = db.collection('qr_codes');

        let query: any = { userId: new ObjectId(userId) };
        if (profileId && ObjectId.isValid(profileId)) {
            query.profileId = new ObjectId(profileId);
        }

        // Filter based on deleted status
        if (deletedOnly) {
            query.deletedAt = { $exists: true };
        } else if (!includeDeleted) {
            query.deletedAt = { $exists: false };
        }

        // Filter by type
        const type = searchParams.get('type');
        if (type) {
            query.type = type;
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
                lastScan: qr.lastScan || null,
                createdAt: qr.createdAt
            }))
        });

    } catch (error) {
        console.error('Error fetching QR codes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
