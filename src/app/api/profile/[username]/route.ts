import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import QRCode from 'qrcode';
import { Profile } from '@/types/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        const db = await getDatabase();
        const profilesCollection = db.collection<Profile>('profiles');

        const profile = await profilesCollection.findOne({ username });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Record scan (analytics)
        const scansCollection = db.collection('qr_scans');
        await scansCollection.insertOne({
            profileId: profile._id,
            userId: profile.userId,
            scannedAt: new Date(),
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            userAgent: request.headers.get('user-agent'),
        });

        // Update analytics
        const analyticsCollection = db.collection('analytics');
        await analyticsCollection.updateOne(
            { profileId: profile._id },
            {
                $inc: { totalScans: 1 },
                $set: { lastScannedAt: new Date() },
            },
            { upsert: true }
        );

        // Return public profile data
        const publicProfile = {
            username: profile.username,
            fullName: profile.fullName,
            jobTitle: profile.jobTitle,
            company: profile.company,
            photo: profile.photo,
            email: profile.showEmail ? profile.email : undefined,
            phoneNumbers: profile.showPhone ? profile.phoneNumbers : [],
            linkedIn: profile.linkedIn,
            website: profile.website,
            twitter: profile.twitter,
            instagram: profile.instagram,
        };

        return NextResponse.json(publicProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
