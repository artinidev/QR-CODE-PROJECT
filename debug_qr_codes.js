
const { MongoClient } = require('mongodb');

async function checkQRCodes() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/pdi-platform";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        console.log('--- Recent QR Codes ---');
        const recentQRs = await db.collection('qr_codes').find({}).sort({ createdAt: -1 }).limit(5).toArray();
        if (recentQRs.length === 0) {
            console.log('No QR codes found in the database.');
        } else {
            recentQRs.forEach(qr => {
                console.log(`ID: ${qr._id}, Name: ${qr.name}, Type: ${qr.type}`);
                console.log(`User ID: ${qr.userId} (Type: ${typeof qr.userId})`);
                if (qr.userId && qr.userId.constructor.name) {
                    console.log(`User ID Constructor: ${qr.userId.constructor.name}`);
                }
                console.log('---');
            });
        }

        console.log('\n--- Users ---');
        const users = await db.collection('users').find({}).limit(3).toArray();
        users.forEach(u => {
            console.log(`User: ${u.email}, ID: ${u._id} (Type: ${typeof u._id}, Constructor: ${u._id.constructor.name})`);
        });

    } finally {
        await client.close();
    }
}

checkQRCodes();
