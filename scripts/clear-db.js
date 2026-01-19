
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db("pdi-platform");

        // Delete all profiles
        const profiles = await db.collection("profiles").deleteMany({});
        console.log(`Deleted ${profiles.deletedCount} profiles`);

        // Delete all QR codes
        const qrcodes = await db.collection("qrcodes").deleteMany({});
        console.log(`Deleted ${qrcodes.deletedCount} qr codes`);

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
