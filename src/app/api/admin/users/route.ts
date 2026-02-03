import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Use environment variables for SMTP, fallback to console logging if not present
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

function verifyAdminToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        throw new Error('Unauthorized');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    if (decoded.role !== 'admin') {
        throw new Error('Forbidden');
    }
    return decoded;
}

export async function GET(request: NextRequest) {
    try {
        verifyAdminToken(request);

        const db = await getDatabase();
        const usersCollection = db.collection('users');
        const profilesCollection = db.collection('profiles');
        const scansCollection = db.collection('qr_scans');

        // Get all users
        const users = await usersCollection
            .find({}, { projection: { password: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

        const usersWithDetails = await Promise.all(
            users.map(async (user) => {
                const profileCount = await profilesCollection.countDocuments({ userId: user._id });
                const scanCount = await scansCollection.countDocuments({ userId: user._id });

                return {
                    ...user,
                    _id: user._id.toString(),
                    stats: {
                        profileCount,
                        scanCount
                    }
                };
            })
        );

        return NextResponse.json({ users: usersWithDetails });
    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        verifyAdminToken(request);
        const { email, role, limits, features, subscription, password } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Generate Invitation Token
        const invitationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const newUser: any = {
            email,
            role: role || 'user',
            status: password ? 'active' : 'pending', // If password is provided, they are active immediately
            invitationToken: password ? null : invitationToken, // No token needed if password provided
            invitationExpires: password ? null : invitationExpires,
            limits: limits || { maxQrCodes: 5, maxProfiles: 1 },
            features: features || { analytics: true, customThemes: false, bulkGeneration: false, apiAccess: false },
            subscription: subscription || { plan: 'free', status: 'active', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (password) {
            const bcrypt = require('bcryptjs');
            newUser.password = await bcrypt.hash(password, 10);
        }

        await db.collection('users').insertOne(newUser);

        // --- EMAIL SENDING LOGIC ---
        try {
            if (SMTP_USER && SMTP_PASS) {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    host: SMTP_HOST,
                    port: SMTP_PORT,
                    secure: SMTP_PORT === 465, // true for 465, false for others
                    auth: {
                        user: SMTP_USER,
                        pass: SMTP_PASS,
                    },
                });

                let emailSubject = 'Welcome to SCANEX';
                let emailHtml = '';

                if (password) {
                    // Scenario: Pre-set password
                    emailHtml = `
                        <h2>Welcome to SCANEX!</h2>
                        <p>You have been invited to join SCANEX.</p>
                        <p><strong>Available Features:</strong> ${Object.keys(newUser.features).filter(k => newUser.features[k]).join(', ') || 'Standard Access'}</p>
                        <hr />
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p><em>You should change this password after your first login.</em></p>
                        <p><a href="${NEXT_PUBLIC_URL}/auth/login" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Login Now</a></p>
                    `;
                } else {
                    // Scenario: User sets password via link
                    const inviteLink = `${NEXT_PUBLIC_URL}/invite/${invitationToken}`;
                    emailHtml = `
                        <h2>You're Invited!</h2>
                        <p>You have been invited to join SCANEX.</p>
                        <p>Please click the link below to verify your email and set your password.</p>
                        <p><a href="${inviteLink}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
                        <p>Or copy this link: ${inviteLink}</p>
                        <p>This link will expire in 24 hours.</p>
                    `;
                }

                const info = await transporter.sendMail({
                    from: `"SCANEX" <${SMTP_USER}>`,
                    to: email,
                    subject: emailSubject,
                    html: emailHtml,
                });
                console.log(`[EMAIL SENT] To: ${email} via ${SMTP_HOST}`);

                // Log Ethereal Preview URL if available
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log(`[EMAIL PREVIEW] 📬 View email here: ${previewUrl}`);
                }
            } else {
                console.warn('[EMAIL SKIP] SMTP credentials missing. Logging to console instead.');
                // Fallback logging for development
                if (password) {
                    console.log(`[MOCK EMAIL] Credentials -> Email: ${email}, Password: ${password}`);
                } else {
                    console.log(`[MOCK EMAIL] Link: ${NEXT_PUBLIC_URL}/invite/${invitationToken}`);
                }
            }
        } catch (emailErr) {
            console.error('Failed to send email:', emailErr);
            // Don't fail the request, just log it. The user exists now.
        }

        return NextResponse.json({
            message: 'Invitation processed successfully',
            token: invitationToken
        }, { status: 201 });

    } catch (error: any) {
        if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        console.error('Error inviting user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
