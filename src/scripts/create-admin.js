const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/pdi-platform';
const client = new MongoClient(uri);

async function createAdmin() {
    try {
        await client.connect();
        const db = client.db('pdi-platform');
        const users = db.collection('users');

        const email = 'admin@pdi.com';
        const password = 'AdminPassword123!';

        // Check if exists
        const existing = await users.findOne({ email });
        if (existing) {
            console.log('Admin user already exists.');
            console.log('Email:', email);
            console.log('If you need to reset the password, delete the user manually first.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await users.insertOne({
            email,
            password: hashedPassword,
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Admin user created successfully!');
        console.log('------------------------');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('------------------------');
        console.log('Please login at /auth/login');

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await client.close();
    }
}

createAdmin();
