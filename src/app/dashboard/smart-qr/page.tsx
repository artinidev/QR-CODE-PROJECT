'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Smartphone, Download, Copy, RefreshCw, BarChart3, Globe,
    Share2, QrCode, ArrowRight, Settings, Plus, ExternalLink,
    Apple, PlaySquare, CheckCircle, AlertCircle
} from 'lucide-react';

interface SmartMetric {
    ios: number;
    android: number;
    desktop: number;
    total: number;
}

interface SmartQR {
    id: string;
    appName: string;
    description?: string;
    appStoreUrl: string;
    playStoreUrl: string;
    redirectUrl: string; // The "magic" link
    metrics: SmartMetric;
    status: 'active' | 'disabled';
    createdAt: string;
}

export default function SmartQRPage() {
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
    const [smartQRs, setSmartQRs] = useState<SmartQR[]>([]); // Mock list

    // Form State
    const [appName, setAppName] = useState('');
    const [description, setDescription] = useState('');
    const [appStoreUrl, setAppStoreUrl] = useState('');
    const [playStoreUrl, setPlayStoreUrl] = useState('');
    const [generatedQR, setGeneratedQR] = useState<SmartQR | null>(null);
    const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');

    // Refs for preview generation
    const qrRef = useRef<any>(null);

    // Mock initial data
    useEffect(() => {
        setSmartQRs([
            {
                id: 'sqr_123',
                appName: 'My Awesome App',
                appStoreUrl: 'https://apps.apple.com/app/id123456',
                playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
                redirectUrl: 'https://qr.pdi.com/r/sqr_123',
                metrics: { ios: 120, android: 85, desktop: 45, total: 250 },
                status: 'active',
                createdAt: '2023-10-25'
            }
        ]);
    }, []);

    // Generate Logic
    const handleGenerate = async () => {
        if (!appStoreUrl && !playStoreUrl) {
            alert('Please provide at least one store URL.');
            return;
        }

        const newId = `sqr_${Math.random().toString(36).substr(2, 9)}`;
        const redirectLink = `https://qr.pdi.com/r/${newId}`; // Mock redirect domain

        const newQR: SmartQR = {
            id: newId,
            appName: appName || 'Untitled App',
            description,
            appStoreUrl,
            playStoreUrl,
            redirectUrl: redirectLink,
            metrics: { ios: 0, android: 0, desktop: 0, total: 0 },
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };

        setSmartQRs([newQR, ...smartQRs]);
        setGeneratedQR(newQR);

        // Generate Preview
        try {
            const QRCodeStyling = (await import('qr-code-styling')).default;
            const qrCode = new QRCodeStyling({
                width: 1000,
                height: 1000,
                data: redirectLink,
                dotsOptions: { color: '#2563EB', type: 'rounded' }, // Blue branding
                backgroundOptions: { color: '#ffffff' },
                imageOptions: { crossOrigin: 'anonymous', margin: 10 }
            });
            const blob = await qrCode.getRawData('png');
            if (blob) {
                setQrPreviewUrl(URL.createObjectURL(blob as Blob));
            }
            qrRef.current = qrCode; // Save instance for downloads
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownload = (ext: 'png' | 'svg' | 'jpeg') => {
        if (qrRef.current && generatedQR) {
            qrRef.current.download({ name: `${generatedQR.appName.replace(/\s+/g, '_')}_smart_qr`, extension: ext });
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart App Store QR</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                    Generate a single intelligent QR code that automatically redirects users to the Apple App Store or Google Play Store based on their device.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900/50 rounded-xl w-fit border border-gray-200 dark:border-white/5">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Create New
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Manage QRs
                </button>
            </div>

            {activeTab === 'create' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-400" /> App Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">App Name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. My Super App"
                                        value={appName}
                                        onChange={e => setAppName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">Description (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Brief tagline..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-white/5" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Store Destinations</h3>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                        <Apple className="w-4 h-4" /> iOS App Store URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://apps.apple.com/app/..."
                                        value={appStoreUrl}
                                        onChange={e => setAppStoreUrl(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                        <PlaySquare className="w-4 h-4" /> Google Play Store URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://play.google.com/store/apps/..."
                                        value={playStoreUrl}
                                        onChange={e => setPlayStoreUrl(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleGenerate}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <QrCode className="w-5 h-5" /> Generate Smart QR Code
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-1">
                        <div className={`bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm sticky top-32 ${generatedQR ? '' : 'opacity-50 grayscale pointer-events-none'}`}>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Live Preview</h2>

                            <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 mb-6 flex items-center justify-center min-h-[250px]">
                                {qrPreviewUrl ? (
                                    <img src={qrPreviewUrl} alt="QR Preview" className="w-full max-w-[220px] object-contain" />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-2">
                                        <QrCode className="w-16 h-16" />
                                        <span className="text-sm">Preview will appear here</span>
                                    </div>
                                )}
                            </div>

                            {generatedQR && (
                                <div className="space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase">Redirect URL</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs text-blue-800 dark:text-blue-300 truncate flex-1">{generatedQR.redirectUrl}</code>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(generatedQR.redirectUrl)}
                                                className="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => handleDownload('png')} className="py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors">PNG</button>
                                        <button onClick={() => handleDownload('svg')} className="py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors">SVG</button>
                                        <button onClick={() => handleDownload('jpeg')} className="py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors">JPEG</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'manage' && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Active Smart QRs</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-zinc-950/50 text-xs text-gray-500 uppercase">
                                        <th className="px-6 py-4 font-bold rounded-tl-lg">App Details</th>
                                        <th className="px-6 py-4 font-bold">Redirects</th>
                                        <th className="px-6 py-4 font-bold text-center">Analytics</th>
                                        <th className="px-6 py-4 font-bold text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-right rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {smartQRs.map((qr) => (
                                        <tr key={qr.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">{qr.appName}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                    <Copy className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">{qr.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {qr.appStoreUrl && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                            <Apple className="w-3.5 h-3.5" />
                                                            <span className="truncate max-w-[150px]">App Store</span>
                                                        </div>
                                                    )}
                                                    {qr.playStoreUrl && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                            <PlaySquare className="w-3.5 h-3.5" />
                                                            <span className="truncate max-w-[150px]">Google Play</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{qr.metrics.total}</span>
                                                    <div className="flex gap-1 mt-1">
                                                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded" title="iOS">{qr.metrics.ios}</span>
                                                        <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded" title="Android">{qr.metrics.android}</span>
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded" title="Other">{qr.metrics.desktop}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-900/50">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-green-500 transition-colors" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
