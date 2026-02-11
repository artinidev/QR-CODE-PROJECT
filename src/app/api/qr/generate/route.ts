import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const data = searchParams.get('data');
        const format = searchParams.get('format') || 'png';

        if (!data) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Configuration for high-quality QR
        const options: any = {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 1000,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        };

        let buffer: Buffer | string;
        let contentType: string;
        let extension: string;

        if (format === 'svg') {
            const svgString = await QRCode.toString(data, { ...options, type: 'svg' }) as unknown as string;
            return new NextResponse(svgString, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Content-Disposition': `attachment; filename="qrcode.svg"`,
                },
            });
        } else if (format === 'jpeg' || format === 'jpg') {
            const dataUrl = await QRCode.toDataURL(data, { ...options, type: 'image/jpeg' }) as unknown as string;
            if (dataUrl) {
                const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
                buffer = Buffer.from(base64Data, 'base64');
                contentType = 'image/jpeg';
                extension = 'jpg';
            } else {
                throw new Error('Failed to generate JPEG');
            }
        } else {
            // Default to PNG
            buffer = await QRCode.toBuffer(data, { ...options, type: 'png' }) as unknown as Buffer;
            contentType = 'image/png';
            extension = 'png';
        }

        return new NextResponse(buffer as any, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="qrcode.${extension}"`,
            },
        });

    } catch (error) {
        console.error('QR Generation API Error:', error);
        return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
    }
}
