'use client';

import React, { useState, useEffect } from 'react';
import { Download, QrCode, Loader2, ChevronDown, Check, Link as LinkIcon, Share2 } from 'lucide-react';
import QRCode from 'qrcode'; // Use client-side lib for flexibility

interface QRDownloadProps {
    profileId?: string | null;
}

interface ProfileData {
    _id: string;
    username: string;
    fullName: string;
}

interface QRCodeData {
    code: string;
    url: string;
    fullUrl: string;
}

export default function QRDownload({ profileId }: QRDownloadProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
    const [loading, setLoading] = useState(false);
    const [qrImageSrc, setQrImageSrc] = useState<string>('');
    const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpeg' | 'svg'>('png');
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fetch Profile & Data
    useEffect(() => {
        if (!profileId) {
            setProfile(null);
            setQrCodeData(null);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Get Profile
                const pRes = await fetch(`/api/profiles/${profileId}`);
                if (!pRes.ok) throw new Error('Failed to load profile');
                const pData = await pRes.json();
                setProfile(pData);

                // 2. Get/Create QR Code
                const qRes = await fetch(`/api/qr-codes?profileId=${profileId}`);
                let qData;

                if (qRes.ok) {
                    const listData = await qRes.json();
                    if (listData.qrCodes && listData.qrCodes.length > 0) {
                        qData = listData.qrCodes[0];
                    }
                }

                // If not found or empty list, create new one
                if (!qData) {
                    const createRes = await fetch('/api/qr-codes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            profileId: pData._id,
                            targetUrl: `/u/${pData.username}`, // Set correct target URL
                            name: `${pData.fullName} Profile QR`
                        })
                    });

                    if (!createRes.ok) throw new Error('Failed to create QR');
                    qData = await createRes.json();
                }

                // 3. Use Configured Public URL (ngrok) or fall back to origin
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
                qData.fullUrl = `${baseUrl}/q/${qData.code}`;

                setQrCodeData(qData);

                // 4. Generate Visual immediately for display
                const dataUrl = await QRCode.toDataURL(qData.fullUrl, {
                    width: 400,
                    margin: 2,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });
                setQrImageSrc(dataUrl);

            } catch (err) {
                console.error("QR Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [profileId]);


    // Handle Action based on capability
    const handleAction = async () => {
        if (!qrCodeData || !profile) return;

        try {
            const safeUsername = profile.username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `qr-${safeUsername}.${selectedFormat === 'jpeg' ? 'jpg' : selectedFormat}`;

            // 1. Generate Blob locally (No Server round-trip)
            let blob: Blob;
            if (selectedFormat === 'svg') {
                const svgString = await QRCode.toString(qrCodeData.fullUrl, {
                    type: 'svg', margin: 2, width: 1024,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });
                blob = new Blob([svgString], { type: 'image/svg+xml' });
            } else {
                const dataUrl = await QRCode.toDataURL(qrCodeData.fullUrl, {
                    type: selectedFormat === 'jpeg' ? 'image/jpeg' : 'image/png',
                    margin: 2, width: 1024,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });
                const res = await fetch(dataUrl);
                blob = await res.blob();
            }

            // 2. Try Native Share (Mobile)
            // @ts-ignore
            if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
                const file = new File([blob], filename, { type: blob.type });
                // @ts-ignore
                if (navigator.canShare({ files: [file] })) {
                    try {
                        // @ts-ignore
                        await navigator.share({
                            files: [file],
                            title: 'My Profile QR',
                            text: `Scan to view ${profile.fullName}'s profile`
                        });
                        return; // Done if shared
                    } catch (shareError) {
                        console.warn('Share failed or dismissed, using fallback download:', shareError);
                        // Fall through to download logic
                    }
                }
            }

            // 3. Fallback: Open in New Tab (Universal)
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');

            // Also try to trigger a download for Desktop browsers
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

        } catch (error) {
            console.error('Action failed:', error);
            alert('Could not download or share. Please manually save the image.');
        }
    };

    const copyToClipboard = () => {
        if (!qrCodeData) return;
        navigator.clipboard.writeText(qrCodeData.fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!profileId) {
        return (
            <div className="bg-white dark:bg-zinc-900 text-card-foreground rounded-[2rem] border border-border/80 shadow-sm p-6 flex flex-col items-center justify-center text-center h-[300px]">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">My QR Code</h3>
                <p className="text-muted-foreground text-sm max-w-[200px]">
                    Select a profile to view its QR code.
                </p>
            </div>
        );
    }

    if (loading || !profile || !qrCodeData) {
        return (
            <div className="bg-white dark:bg-zinc-900 text-card-foreground rounded-[2rem] border border-border/80 shadow-sm p-6 flex flex-col items-center justify-center h-[300px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground mt-4">Generating Code...</p>
            </div>
        );
    }

    // NEW COMPACT DESIGN
    return (
        <div className="bg-white dark:bg-zinc-900 text-card-foreground rounded-[2rem] border border-border/80 shadow-sm p-5 flex flex-col items-center relative overflow-hidden transition-all animate-in fade-in slide-in-from-right-4 w-full">

            {/* Header / Meta Info */}
            <div className="w-full text-center mb-4">
                <h2 className="text-xl font-bold tracking-tight">{profile.fullName}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                        @{profile.username}
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                        title="Copy Link"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                </div>
            </div>

            {/* Main QR Display */}
            <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-primary/10 shadow-sm relative group hover:border-primary/30 transition-all">
                {qrImageSrc ? (
                    <img
                        src={qrImageSrc}
                        alt="QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain mix-blend-multiply"
                    />
                ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-muted/20">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* URL Display */}
            <div className="mt-4 mb-5 w-full text-center">
                <p className="text-[10px] text-muted-foreground/60 font-mono truncate max-w-[200px] mx-auto bg-muted/30 py-1 px-2 rounded">
                    {qrCodeData.fullUrl.replace(/^https?:\/\//, '')}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex rounded-xl shadow-sm overflow-hidden ring-1 ring-border/50">
                <button
                    onClick={handleAction}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all text-sm"
                >
                    <Download className="w-4 h-4" />
                    Share {selectedFormat.toUpperCase()}
                </button>

                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="bg-primary/90 text-primary-foreground px-3 border-l border-primary/80 hover:bg-primary transition-colors cursor-pointer"
                >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Dropdown */}
            {showOptions && (
                <div className="absolute bottom-16 left-5 right-5 mb-2 bg-popover text-popover-foreground border border-border shadow-2xl rounded-xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                    {(['png', 'jpeg', 'svg'] as const).map(format => (
                        <button
                            key={format}
                            onClick={() => {
                                setSelectedFormat(format);
                                setShowOptions(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between ${selectedFormat === format ? 'bg-primary/5 text-primary' : ''}`}
                        >
                            {format.toUpperCase()}
                            {selectedFormat === format && <Check className="w-3 h-3 text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
