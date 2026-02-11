// MongoDB Database Indexes Setup Script
// Run this script to create indexes for optimal query performance

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createIndexes() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in environment variables');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();

        // Indexes for scans collection
        console.log('\nCreating indexes for scans collection...');

        await db.collection('scans').createIndex({ qrCodeId: 1 });
        console.log('✓ Created index on qrCodeId');

        await db.collection('scans').createIndex({ timestamp: -1 });
        console.log('✓ Created index on timestamp');

        await db.collection('scans').createIndex({ qrCodeId: 1, timestamp: -1 });
        console.log('✓ Created compound index on qrCodeId + timestamp');

        // Indexes for qr_codes collection
        console.log('\nCreating indexes for qr_codes collection...');

        await db.collection('qr_codes').createIndex({ code: 1 }, { unique: true });
        console.log('✓ Created unique index on code');

        await db.collection('qr_codes').createIndex({ profileId: 1 });
        console.log('✓ Created index on profileId');

        await db.collection('qr_codes').createIndex({ createdAt: -1 });
        console.log('✓ Created index on createdAt');

        await db.collection('qr_codes').createIndex({ deletedAt: 1 });
        console.log('✓ Created index on deletedAt');

        console.log('\n✅ All indexes created successfully!');

    } catch (error) {
        console.error('Error creating indexes:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

createIndexes();
