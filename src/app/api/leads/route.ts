import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { profileId, name, email, phone, note } = body;

        if (!profileId || !name) {
            return NextResponse.json(
                { error: 'Profile ID and Name are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const leadsCollection = db.collection('leads');

        const newLead = {
            profileId: new ObjectId(profileId),
            name,
            email,
            phone,
            note,
            createdAt: new Date(),
            status: 'new' // new, contacted, archived
        };

        const result = await leadsCollection.insertOne(newLead);

        return NextResponse.json({ success: true, leadId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
        );
    }
}
