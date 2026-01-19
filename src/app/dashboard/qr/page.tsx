'use client';

import React, { useState, useEffect } from 'react';
import AdvancedQRGenerator from '@/components/dashboard/AdvancedQRGenerator';
import { Trash2, Smartphone, MapPin, Clock, BarChart3, QrCode, Download, Share2, Eye } from 'lucide-react';

// Mock Type for saved QR
interface SavedQR {
    id: string;
    name: string;
    url: string; // The Real Destination
    shortUrl?: string; // The Proxy/Short URL
    isDynamic?: boolean;
    color: string;
    scans: number;
    lastScan: string;
    location: string;
    device: string;
    createdAt: string;
    imageBlob?: Blob | string; // In real app, this would be a URL
}

export default function QRStudioPage() {
    const [savedQRs, setSavedQRs] = useState<SavedQR[]>([
        {
            id: '1',
            name: 'Personal Portfolio',
            url: 'https://ayoub.design',
            isDynamic: true,
            shortUrl: 'https://qr.ayoub.link/pfolio',
            color: '#2563eb',
            scans: 124,
            lastScan: '2 mins ago',
            location: 'New York, USA',
            device: 'iPhone 14 Pro',
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            name: 'Business Card',
            url: 'https://linkedin.com/in/ayoub',
            isDynamic: false,
            color: '#7c3aed',
            scans: 85,
            lastScan: '1 hour ago',
            location: 'London, UK',
            device: 'Chrome Desktop',
            createdAt: '2024-01-10'
        }
    ]);

    const handleSaveQR = (data: { url: string; name: string; color: string; image: string | Blob; isDynamic?: boolean; targetUrl?: string }) => {
        const newQR: SavedQR = {
            id: Date.now().toString(),
            name: data.name || 'Untitled QR',
            url: data.url, // This is the Long/Real URL
            // Wait, in the generator we passed targetUrl as the short one? 
            // Let's re-verify:
            // In Generator: onSave passes: url (Real), targetUrl (Short) IF Dynamic?
            // Actually in generator: onSave({ url: isDynamic ? targetUrl : url, ... targetUrl: isDynamic ? url : undefined })
            // Wait, previous logic was:
            // "url": isDynamic ? targetUrl (real input) : url (real input)
            // "targetUrl": isDynamic ? url (short link) : undefined.
            // So data.url = Real Link. data.targetUrl = Short Link (if dynamic).
            shortUrl: data.targetUrl,
            isDynamic: data.isDynamic,
            color: data.color,
            scans: 0,
            lastScan: 'Never',
            location: 'N/A',
            device: 'N/A',
            createdAt: new Date().toLocaleDateString(),
            imageBlob: data.image
        };
        setSavedQRs([newQR, ...savedQRs]);
        // Scroll to the list so user sees the new item
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const handleDeleteQR = (id: string) => {
        setSavedQRs(savedQRs.filter(qr => qr.id !== id));
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'dynamic' | 'static'>('all');

    const filteredQRs = savedQRs.filter(qr => {
        const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) || qr.url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all'
            ? true
            : filterType === 'dynamic' ? qr.isDynamic
                : !qr.isDynamic;
        return matchesSearch && matchesType;
    });

    const [editingQR, setEditingQR] = useState<SavedQR | null>(null);

    const handleUpdateTarget = (id: string, newUrl: string) => {
        setSavedQRs(savedQRs.map(qr =>
            qr.id === id ? { ...qr, url: newUrl } : qr
        ));
        setEditingQR(null);
    };

    const [visualizingQR, setVisualizingQR] = useState<SavedQR | null>(null);

    const [downloadingQR, setDownloadingQR] = useState<SavedQR | null>(null);

    const [qrPreview, setQrPreview] = useState<string>('');

    useEffect(() => {
        const targetQR = visualizingQR || downloadingQR;
        if (!targetQR) {
            setQrPreview('');
            return;
        }

        const generatePreview = async () => {
            if (targetQR.imageBlob) {
                const url = targetQR.imageBlob instanceof Blob ? URL.createObjectURL(targetQR.imageBlob) : targetQR.imageBlob as string;
                setQrPreview(url);
            } else {
                // Generate on fly for mock data
                try {
                    const QRCodeStyling = (await import('qr-code-styling')).default;
                    const qrCode = new QRCodeStyling({
                        width: 1000,
                        height: 1000,
                        data: targetQR.isDynamic && targetQR.shortUrl ? targetQR.shortUrl : targetQR.url,
                        dotsOptions: {
                            color: targetQR.color,
                            type: 'square'
                        },
                        backgroundOptions: {
                            color: '#ffffff',
                        },
                        imageOptions: {
                            crossOrigin: 'anonymous',
                            margin: 20
                        }
                    });
                    const blob = await qrCode.getRawData('png');
                    if (blob) {
                        setQrPreview(URL.createObjectURL(blob as Blob));
                    }
                } catch (e) {
                    console.error("Failed to generate preview", e);
                }
            }
        };

        generatePreview();
    }, [visualizingQR, downloadingQR]);

    const processDownload = async (qr: SavedQR, extension: 'png' | 'jpeg' | 'svg') => {
        try {
            const QRCodeStyling = (await import('qr-code-styling')).default;
            const qrCode = new QRCodeStyling({
                width: 1000,
                height: 1000,
                data: qr.isDynamic && qr.shortUrl ? qr.shortUrl : qr.url,
                dotsOptions: {
                    color: qr.color,
                    type: 'square'
                },
                backgroundOptions: {
                    color: '#ffffff',
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 20
                }
            });

            await qrCode.download({
                name: `${qr.name.replace(/\s+/g, '_')}_qr`,
                extension: extension
            });

            setDownloadingQR(null);
        } catch (err) {
            console.error('Error generating QR for download:', err);
            alert('Failed to generate QR code for download.');
        }
    };

    const handleShare = async (qr: SavedQR) => {
        const shareData = {
            title: qr.name,
            text: `Check out this QR code for ${qr.name}`,
            url: qr.isDynamic && qr.shortUrl ? qr.shortUrl : qr.url
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="space-y-6 pb-8">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">QR Studio</h1>
                    <p className="text-sm text-blue-500 font-medium mt-1">Design, customize, and track your intelligent QR codes.</p>
                </div>
            </div>

            {/* Editor Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">1</div>
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Create New QR</h2>
                </div>
                <AdvancedQRGenerator onSave={handleSaveQR} />
            </section>

            {/* Management Section */}
            <section className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">2</div>
                        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Your Active QR Codes</h2>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search QR codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 dark:text-white"
                            />
                            {/* Search Icon placeholder if needed, usually passed as prop or separate icon */}
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value="dynamic">Dynamic</option>
                            <option value="static">Static</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredQRs.map((qr) => (
                        <div key={qr.id} className="bg-white dark:bg-zinc-900 rounded-[1.25rem] p-4 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col lg:flex-row gap-4 hover:shadow-md transition-shadow relative overflow-hidden group">
                            {qr.isDynamic && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] uppercase font-bold px-2.5 py-1 rounded-bl-lg">
                                    Dynamic
                                </div>
                            )}

                            {/* Left: QR Icon/Image */}
                            <div className="shrink-0">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/5 overflow-hidden">
                                    {qr.imageBlob ? (
                                        <img
                                            src={qr.imageBlob instanceof Blob ? URL.createObjectURL(qr.imageBlob) : qr.imageBlob as string}
                                            alt={qr.name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    ) : (
                                        <QrCode className="w-8 h-8" style={{ color: qr.color }} />
                                    )}
                                </div>
                            </div>

                            {/* Middle: Info */}
                            <div className="flex-1 space-y-2">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{qr.name}</h3>

                                    {/* Link Display */}
                                    <div className="flex flex-col gap-0.5 mt-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 w-10">TARGET</span>
                                            <a href={qr.url} target="_blank" rel="noreferrer" className="text-xs text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:underline truncate block max-w-sm font-medium">
                                                {qr.url}
                                            </a>
                                        </div>
                                        {qr.isDynamic && qr.shortUrl && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-green-500 w-10">SHORT</span>
                                                <span className="text-xs text-green-600 dark:text-green-400 font-mono bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded">
                                                    {qr.shortUrl}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-full">
                                        <Smartphone className="w-3 h-3" /> {qr.device}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-full">
                                        <MapPin className="w-3 h-3" /> {qr.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-full">
                                        <Clock className="w-3 h-3" /> {qr.lastScan}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Stats & Actions */}
                            <div className="w-full lg:w-56 border-l border-gray-100 dark:border-white/5 pl-0 lg:pl-4 flex flex-col justify-between">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Scans</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{qr.scans}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Trend</p>
                                        <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                                            <BarChart3 className="w-3 h-3" /> +12%
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setDownloadingQR(qr)}
                                            className="flex-1 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5 border border-gray-100 dark:border-white/5"
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>
                                        <button
                                            onClick={() => handleShare(qr)}
                                            className="flex-1 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5 border border-gray-100 dark:border-white/5"
                                        >
                                            <Share2 className="w-3 h-3" /> Share
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        {qr.isDynamic ? (
                                            <button
                                                onClick={() => setEditingQR(qr)}
                                                className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                            >
                                                Edit Target
                                            </button>
                                        ) : (
                                            <button className="flex-1 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                                                Analytics
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setVisualizingQR(qr)}
                                            className="p-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors border border-gray-100 dark:border-white/5" title="Visualize"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQR(qr.id)}
                                            className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {savedQRs.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 dark:bg-zinc-900 rounded-[1.25rem] border border-dashed border-gray-200 dark:border-white/10">
                            <QrCode className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No QR codes created yet.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-600">Create one above to start tracking.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Edit Modal */}
            {editingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Target URL</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Dynamic Short Link</label>
                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300">
                                    {editingQR.shortUrl}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">New Destination URL</label>
                                <input
                                    type="text"
                                    defaultValue={editingQR.url}
                                    id="edit-url-input"
                                    className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    placeholder="https://new-destination.com"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditingQR(null)}
                                    className="flex-1 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('edit-url-input') as HTMLInputElement;
                                        if (input) handleUpdateTarget(editingQR.id, input.value);
                                    }}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Options Modal */}
            {downloadingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setDownloadingQR(null)}>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">Download Format</h3>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mt-2">Select the best format for your needs.</p>

                        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mx-auto">
                            {qrPreview ? (
                                <img
                                    src={qrPreview}
                                    alt={downloadingQR.name}
                                    className="w-48 h-48 object-contain"
                                />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center bg-gray-50 text-gray-300">
                                    <div className="animate-pulse w-16 h-16 bg-gray-200 rounded" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {['png', 'jpeg', 'svg'].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => processDownload(downloadingQR, format as any)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mb-2 group-hover:bg-blue-500 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{format}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setDownloadingQR(null)}
                            className="w-full py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Visualize Modal */}
            {visualizingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setVisualizingQR(null)}>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{visualizingQR.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium break-all">{visualizingQR.isDynamic ? visualizingQR.shortUrl : visualizingQR.url}</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                            {qrPreview ? (
                                <img
                                    src={qrPreview}
                                    alt={visualizingQR.name}
                                    className="w-64 h-64 object-contain"
                                />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center bg-gray-50 text-gray-300">
                                    <div className="animate-pulse w-24 h-24 bg-gray-200 rounded" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 w-full">
                            {['png', 'jpeg', 'svg'].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => processDownload(visualizingQR, format as any)}
                                    className="py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white hover:border-transparent dark:text-gray-300 text-gray-700 rounded-lg font-bold transition-all text-xs uppercase border border-gray-200 dark:border-white/10"
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
