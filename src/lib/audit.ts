import { getDatabase } from '@/lib/mongodb';

export async function logAction(action: string, description: string, metadata: any = {}) {
    try {
        const db = await getDatabase();
        await db.collection('audit_logs').insertOne({
            action,
            description,
            metadata,
            timestamp: new Date(),
        });
    } catch (error) {
        // Fail silently to not block main flow
        console.error('Audit Log Error:', error);
    }
}
