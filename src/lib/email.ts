import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(to: string, code: string) {
    const isPlaceholder = process.env.SMTP_USER?.includes('YOUR_EMAIL');
    if (!process.env.SMTP_USER || isPlaceholder) {
        console.log('----------------------------------------');
        console.log(`[DEV MODE] Email to ${to}`);
        console.log(`[DEV MODE] Verification Code: ${code}`);
        console.log('----------------------------------------');
        return true;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"PDI Platform" <noreply@pdiplatform.com>',
            to,
            subject: 'Verify your email address',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Verify your email</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4F46E5; letter-spacing: 5px;">${code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
