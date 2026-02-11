const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Default to the docker-compose service name 'mongo'
// If running locally against localhost, used: MONGODB_URI=mongodb://localhost:27017/pdi-platform node scripts/create-admin.js ...
const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017/pdi-platform';
const client = new MongoClient(uri);

async function run() {
    try {
        const email = process.argv[2];
        const password = process.argv[3];

        if (!email || !password) {
            console.log('\nUsage: node scripts/create-admin.js <email> <password>');
            console.log('Example: node scripts/create-admin.js admin@scanex.com mySecurePass123\n');
            process.exit(1);
        }

        console.log(`Connecting to MongoDB at ${uri}...`);
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db();
        const usersCollection = db.collection('users');

        // Check if user exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            console.log(`User ${email} already exists.`);
            // Update password if provided, and ensure admin role
            const hashedPassword = await bcrypt.hash(password, 10);

            await usersCollection.updateOne(
                { email },
                {
                    $set: {
                        password: hashedPassword,
                        role: 'admin',
                        status: 'active',
                        plan: 'enterprise',
                        features: { analytics: true, customThemes: true, bulkGeneration: true, apiAccess: true },
                        limits: { maxQrCodes: 99999, maxProfiles: 99999 },
                        updatedAt: new Date()
                    }
                }
            );
            console.log('User updated to Admin with new password and full features.');
            return;
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = {
            email,
            password: hashedPassword,
            role: 'admin', // Critical
            plan: 'enterprise',
            credits: {
                scans: 999999,
                static_qr: 999999,
                dynamic_qr: 999999
            },
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            // Ensure all features are enabled
            features: {
                analytics: true,
                customThemes: true,
                bulkGeneration: true,
                apiAccess: true
            },
            // High limits
            limits: {
                maxQrCodes: 99999,
                maxProfiles: 99999
            }
        };

        const result = await usersCollection.insertOne(adminUser);
        console.log(`\nSUCCESS: Admin user created: ${email}`);
        console.log(`ID: ${result.insertedId}`);
        console.log(`You can now login at /auth/login with these credentials.\n`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

run();
