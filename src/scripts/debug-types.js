const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/pdi-platform';

async function debugDB() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('pdi-platform');

        const profiles = await db.collection('profiles').find({}).toArray();
        console.log('--- Profiles ---');
        profiles.forEach(p => {
            console.log(`Profile ID: ${p._id} (Type: ${p._id.constructor.name})`);
            console.log(`UserID: ${p.userId} (Type: ${p.userId ? p.userId.constructor.name : 'undefined'})`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

debugDB();
