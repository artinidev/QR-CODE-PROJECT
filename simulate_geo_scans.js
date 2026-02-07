
const { MongoClient, ObjectId } = require('mongodb');

async function simulateGeoScans() {
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

        // Get a QR code from this user
        const qr = await db.collection('qr_codes').findOne({ userId: user._id });
        if (!qr) {
            console.log('No QR codes found for user.');
            return;
        }

        console.log(`Simulating scans for QR: ${qr.name} (${qr.code})`);

        // Mock Locations
        const locations = [
            { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, count: 5 },
            { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, count: 3 },
            { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, count: 4 },
            { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, count: 2 },
            { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, count: 1 }
        ];

        for (const loc of locations) {
            for (let i = 0; i < loc.count; i++) {
                const scanEvent = {
                    qrCodeId: qr._id,
                    timestamp: new Date(),
                    device: 'Desktop',
                    browser: 'Chrome',
                    os: 'Mac',
                    location: {
                        city: loc.city,
                        country: loc.country,
                        latitude: loc.lat,
                        longitude: loc.lng,
                        ip: '127.0.0.1'
                    },
                    referrer: 'Direct',
                    userAgent: 'Simulation Script'
                };
                await db.collection('scans').insertOne(scanEvent);
            }
            console.log(`Added ${loc.count} scans for ${loc.city}`);
        }

        // Update QR scan count
        const totalNewScans = locations.reduce((acc, curr) => acc + curr.count, 0);
        await db.collection('qr_codes').updateOne(
            { _id: qr._id },
            {
                $inc: { scans: totalNewScans },
                $set: { lastScan: new Date() }
            }
        );

        console.log(`Simulation complete. Added ${totalNewScans} scans.`);

    } finally {
        await client.close();
    }
}

simulateGeoScans();
