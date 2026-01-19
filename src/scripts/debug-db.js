const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/pdi-platform';

async function debugDB() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('pdi-platform');

        const users = await db.collection('users').find({}).toArray();
        console.log('--- Users ---');
        users.forEach(u => console.log(`ID: ${u._id} (${typeof u._id}), Email: ${u.email}`));

        const profiles = await db.collection('profiles').find({}).toArray();
        console.log('--- Profiles ---');
        profiles.forEach(p => {
            console.log('createdAt type:', p.createdAt ? p.createdAt.constructor.name : 'undefined');
            console.log(JSON.stringify(p, null, 2));
        });

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

debugDB();
