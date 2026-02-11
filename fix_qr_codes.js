
const { MongoClient, ObjectId } = require('mongodb');

async function fixQRCodes() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/pdi-platform";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        // Target User: free_plan_final@example.com
        const targetUserEmail = 'free_plan_final@example.com';
        const user = await db.collection('users').findOne({ email: targetUserEmail });

        if (!user) {
            console.log('Target user not found!');
            return;
        }

        console.log(`Found target user: ${user.email} (${user._id})`);

        // Find orphaned QR codes (no userId)
        const orphanQRs = await db.collection('qr_codes').find({
            $or: [
                { userId: { $exists: false } },
                { userId: null }
            ]
        }).toArray();

        console.log(`Found ${orphanQRs.length} orphaned QR codes.`);

        if (orphanQRs.length > 0) {
            const result = await db.collection('qr_codes').updateMany(
                {
                    $or: [
                        { userId: { $exists: false } },
                        { userId: null }
                    ]
                },
                { $set: { userId: user._id } }
            );
            console.log(`Updated ${result.modifiedCount} QR codes to belong to ${user.email}`);
        }

    } finally {
        await client.close();
    }
}

fixQRCodes();
