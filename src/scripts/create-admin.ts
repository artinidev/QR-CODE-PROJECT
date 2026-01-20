import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function createAdmin() {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI as string);
    const db = client.db();

    const email = 'admin@pdi.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Creating/Updating admin user: ${email}`);

    // Update or insert the admin user
    const result = await db.collection('users').updateOne(
        { email },
        {
            $set: {
                email,
                password: hashedPassword,
                role: 'admin', // Critical: This triggers the visibility in Settings
                status: 'active',
                limits: { maxQrCodes: 9999, maxProfiles: 9999 },
                features: { analytics: true, customThemes: true, bulkGeneration: true, apiAccess: true },
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        },
        { upsert: true }
    );

    // Ensure profile exists
    const user = await db.collection('users').findOne({ email });
    if (user) {
        await db.collection('profiles').updateOne(
            { userId: user._id },
            {
                $set: {
                    userId: user._id,
                    email: user.email,
                    fullName: 'Super Admin',
                    username: 'admin',
                    showEmail: true,
                    showPhone: false,
                    phoneNumbers: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    console.log('Admin user setup complete.');
    console.log('Login credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    await client.close();
}

createAdmin().catch(console.error);
