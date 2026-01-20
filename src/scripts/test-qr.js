const http = require('http');

// Helper to make requests
function request(options, postData) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: Buffer.concat(data)
            }));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function testQR() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, JSON.stringify({
            email: 'test_agent_1@example.com',
            password: 'password123'
        }));

        console.log('Login Status:', loginRes.statusCode);
        const setCookie = loginRes.headers['set-cookie'];
        if (!setCookie) throw new Error('No cookie returned');

        const cookie = setCookie[0].split(';')[0];
        console.log('Got Cookie:', cookie);

        // 2. Fetch QR
        console.log('Fetching QR...');
        const qrRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/qr/generate?format=png',
            method: 'GET',
            headers: {
                'Cookie': cookie
            }
        });

        console.log('QR Status:', qrRes.statusCode);
        console.log('QR Content-Type:', qrRes.headers['content-type']);
        console.log('QR Body Length:', qrRes.body.length);

        if (qrRes.statusCode === 200 && qrRes.body.length > 0) {
            console.log('✅ QR Code generation successful!');
        } else {
            console.log('❌ QR Code generation failed');
            console.log('Body:', qrRes.body.toString());
        }

    } catch (e) {
        console.error('Test failed:', e);
    }
}

testQR();
