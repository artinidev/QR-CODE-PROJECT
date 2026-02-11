import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'png';
    const filename = searchParams.get('filename') || 'qr-code';

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        let buffer: Buffer;
        let contentType: string;
        let extension: string;

        if (format === 'svg') {
            const svgString = await QRCode.toString(url, {
                type: 'svg',
                margin: 2,
                width: 512,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
            buffer = Buffer.from(svgString);
            contentType = 'image/svg+xml';
            extension = 'svg';
        } else if (format === 'jpeg') {
            const dataUrl = await QRCode.toDataURL(url, {
                type: 'image/jpeg',
                margin: 2,
                width: 1024,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
            const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
            buffer = Buffer.from(base64Data, 'base64');
            contentType = 'image/jpeg';
            extension = 'jpg';
        } else {
            // Default to PNG
            buffer = await QRCode.toBuffer(url, {
                type: 'png',
                margin: 2,
                width: 1024,
                color: { dark: '#000000', light: '#FFFFFF' }
            });
            contentType = 'image/png';
            extension = 'png';
        }

        const safeFilename = filename.replace(/[^a-z0-9-_]/gi, '_');

        return new NextResponse(buffer as any, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${safeFilename}.${extension}"`,
            },
        });
    } catch (error) {
        console.error('Error generating QR download:', error);
        return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
    }
}
