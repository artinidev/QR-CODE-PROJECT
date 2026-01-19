const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/pdi-platform';

async function testConnection() {
    console.log('Testing connection to:', uri);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected successfully to server');

        const db = client.db('pdi-platform');
        const profiles = await db.collection('profiles').find({}).toArray();
        console.log('✅ Found profiles:', profiles.length);

    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await client.close();
    }
}

testConnection();
