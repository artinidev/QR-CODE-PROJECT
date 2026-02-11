
const { MongoClient } = require('mongodb');

async function getUserId() {
    const uri = "mongodb://localhost:27017/pdi-platform";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('pdi-platform');
        const user = await db.collection('users').findOne({});
        if (user) {
            console.log(`USER_ID:${user._id}`);
        } else {
            console.log('NO_USERS_FOUND');
        }
    } finally {
        await client.close();
    }
}

getUserId();
