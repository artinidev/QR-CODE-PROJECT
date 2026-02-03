'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type QRCodeStyling from 'qr-code-styling';

interface QRCodeDisplayProps {
    data: string;
    width?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
    dotsType?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    image?: string;
}

export interface QRCodeHandle {
    download: (extension: 'png' | 'jpeg' | 'webp' | 'svg', name?: string) => Promise<void>;
}

const QRCodeDisplay = forwardRef<QRCodeHandle, QRCodeDisplayProps>(({
    data,
    width = 200,
    height = 200,
    color = '#000000',
    backgroundColor = '#ffffff',
    dotsType = 'square',
    image
}, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useImperativeHandle(ref, () => ({
        download: async (extension, name) => {
            if (qrCode.current) {
                // Manually handle download to ensure cross-browser compatibility
                const blob = await qrCode.current.getRawData(extension);
                if (blob) {
                    const url = URL.createObjectURL(blob as Blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    // Ensure extension is present
                    anchor.download = name && name.endsWith(`.${extension}`) ? name : `${name || 'qr-code'}.${extension}`;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                    URL.revokeObjectURL(url);
                }
            }
        }
    }));

    useEffect(() => {
        let mounted = true;

        const initQRCode = async () => {
            const QRCodeStylingModule = await import('qr-code-styling');
            const QRCodeStyling = QRCodeStylingModule.default;

            if (!mounted) return;

            // Initialize if not already done
            if (!qrCode.current) {
                qrCode.current = new QRCodeStyling({
                    width,
                    height,
                    data,
                    image,
                    dotsOptions: {
                        color,
                        type: dotsType
                    },
                    backgroundOptions: {
                        color: backgroundColor,
                    },
                    imageOptions: {
                        crossOrigin: 'anonymous',
                        margin: 10
                    }
                });

                if (divRef.current) {
                    divRef.current.innerHTML = '';
                    qrCode.current.append(divRef.current);
                }
            } else {
                // Update existing instance
                qrCode.current.update({
                    width,
                    height,
                    data,
                    image,
                    dotsOptions: {
                        color,
                        type: dotsType
                    },
                    backgroundOptions: {
                        color: backgroundColor,
                    },
                });
            }
        };

        initQRCode();

        return () => {
            mounted = false;
        };
    }, [data, width, height, color, backgroundColor, dotsType, image]);

    return <div ref={divRef} className="flex items-center justify-center" />;
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;
