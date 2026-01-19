const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/pdi-platform';

async function fixDates() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('pdi-platform');

        const profiles = await db.collection('profiles').find({}).toArray();

        for (const p of profiles) {
            let updates = {};
            if (typeof p.createdAt === 'string') {
                updates.createdAt = new Date(p.createdAt);
            }
            if (typeof p.updatedAt === 'string') {
                updates.updatedAt = new Date(p.updatedAt);
            }

            if (Object.keys(updates).length > 0) {
                console.log(`Fixing dates for profile ${p._id}`);
                await db.collection('profiles').updateOne(
                    { _id: p._id },
                    { $set: updates }
                );
            }
        }
        console.log('Date fix complete.');

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

fixDates();
