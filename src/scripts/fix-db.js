const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/pdi-platform';

async function fixDB() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('pdi-platform');

        const profiles = await db.collection('profiles').find({}).toArray();

        for (const p of profiles) {
            if (typeof p.userId === 'string') {
                console.log(`Fixing profile ${p._id}: converting userId string to ObjectId`);
                await db.collection('profiles').updateOne(
                    { _id: p._id },
                    { $set: { userId: new ObjectId(p.userId) } }
                );
            }
        }
        console.log('Done.');

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

fixDB();
