
const { MongoClient } = require('mongodb');

async function repairScanLocations() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/pdi-platform";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const scansCollection = db.collection('scans');

        // Find scans with missing lat/long but having an IP
        const scansToFix = await scansCollection.find({
            "location.ip": { $exists: true, $ne: "127.0.0.1" },
            $or: [
                { "location.latitude": { $exists: false } },
                { "location.latitude": 0 }
            ]
        }).toArray();

        console.log(`Found ${scansToFix.length} scans to repair...`);

        for (const scan of scansToFix) {
            const ip = scan.location.ip;
            console.log(`Fetching location for IP: ${ip}`);

            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.latitude && data.longitude) {
                        await scansCollection.updateOne(
                            { _id: scan._id },
                            {
                                $set: {
                                    "location.latitude": data.latitude,
                                    "location.longitude": data.longitude,
                                    "location.country": data.country_name || scan.location.country,
                                    "location.city": data.city || scan.location.city
                                }
                            }
                        );
                        console.log(`Updated scan ${scan._id} -> ${data.city}, ${data.country}`);
                    }
                }
                // Rate limit niceness
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`Failed to repair scan ${scan._id}:`, err.message);
            }
        }

        console.log('Repair complete.');

    } finally {
        await client.close();
    }
}

repairScanLocations();
