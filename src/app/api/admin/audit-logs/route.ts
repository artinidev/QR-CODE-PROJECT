import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Helper to log events (internal use mostly, or via POST from other services)
export async function logEvent(action: string, description: string, metadata: any = {}) {
    try {
        const db = await getDatabase();
        await db.collection('audit_logs').insertOne({
            action,
            description,
            metadata,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Failed to log event', error);
    }
}

// GET: Fetch audit logs for Admin Panel
export async function GET(request: Request) {
    try {
        const db = await getDatabase();
        const logs = await db.collection('audit_logs')
            .find({})
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch logs' },
            { status: 500 }
        );
    }
}

// POST: Internal API to create a log (secured in middleware usually)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await logEvent(body.action, body.description, body.metadata);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
    }
}
