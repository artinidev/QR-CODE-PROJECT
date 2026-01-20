'use client';

import React, { useState, useEffect } from 'react';
import AdvancedQRGenerator from '@/components/dashboard/AdvancedQRGenerator';
import { Trash2, Smartphone, MapPin, Clock, BarChart3, QrCode, Download, Share2, Eye, Settings, Copy, CheckCircle } from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
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
            url: data.url,
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
        // Switch to manage tab to see the new QR
        setActiveTab('manage');
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

    const processDownload = async (qr: SavedQR, extension: 'png' | 'jpeg' | 'svg' | 'pdf') => {
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

            if (extension === 'pdf') {
                const blob = await qrCode.getRawData('png');
                if (!blob) throw new Error('Failed to generate PNG for PDF');

                const { jsPDF } = await import('jspdf');
                const doc = new jsPDF();
                const imgData = URL.createObjectURL(blob as Blob);

                // Add title
                doc.setFontSize(20);
                doc.text(qr.name, 105, 20, { align: 'center' });

                // Add QR Image
                doc.addImage(imgData, 'PNG', 55, 40, 100, 100);

                // Add URL text
                doc.setFontSize(12);
                doc.setTextColor(100);
                const url = qr.isDynamic && qr.shortUrl ? qr.shortUrl : qr.url;
                doc.text(url, 105, 150, { align: 'center' });

                doc.save(`${qr.name.replace(/\s+/g, '_')}_qr.pdf`);
            } else {
                await qrCode.download({
                    name: `${qr.name.replace(/\s+/g, '_')}_qr`,
                    extension: extension
                });
            }

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
        <div className="space-y-8 pb-10">

            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">QR Studio</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Design, customize, and track your intelligent QR codes.</p>
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

            {/* Content Views */}
            {activeTab === 'create' ? (
                /* Editor Section */
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AdvancedQRGenerator onSave={handleSaveQR} />
                </section>
            ) : (
                /* Management Section */
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white hidden md:block">Your Active QR Codes</h2>

                        {/* Search & Filter Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search QR codes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="dynamic">Dynamic</option>
                                <option value="static">Static</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-zinc-950/50 text-xs text-gray-500 uppercase">
                                        <th className="px-6 py-4 font-bold">QR Details</th>
                                        <th className="px-6 py-4 font-bold">Destination</th>
                                        <th className="px-6 py-4 font-bold text-center">Analytics</th>
                                        <th className="px-6 py-4 font-bold text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {filteredQRs.map((qr) => (
                                        <tr key={qr.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            {/* QR Details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/5 p-1 shrink-0">
                                                        {qr.imageBlob ? (
                                                            <img
                                                                src={qr.imageBlob instanceof Blob ? URL.createObjectURL(qr.imageBlob) : qr.imageBlob as string}
                                                                alt={qr.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <QrCode className="w-5 h-5" style={{ color: qr.color }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{qr.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {qr.isDynamic && (
                                                                <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Dynamic</span>
                                                            )}
                                                            <span className="text-[10px] text-gray-400 font-mono">#{qr.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Destination */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 max-w-[200px]">
                                                        <span className="font-bold text-gray-400 text-[10px] uppercase w-10 shrink-0">Target</span>
                                                        <a href={qr.url} target="_blank" rel="noreferrer" className="truncate hover:text-blue-500 underline decoration-dotted decoration-gray-300 dark:decoration-gray-600">
                                                            {qr.url}
                                                        </a>
                                                    </div>
                                                    {qr.isDynamic && qr.shortUrl && (
                                                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 max-w-[200px]">
                                                            <span className="font-bold text-green-500/70 text-[10px] uppercase w-10 shrink-0">Short</span>
                                                            <span className="truncate font-mono bg-green-50 dark:bg-green-500/10 px-1 rounded">{qr.shortUrl}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Analytics */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{qr.scans}</span>
                                                    <span className="text-[10px] text-gray-400">Total Scans</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-200 dark:border-green-900/50">
                                                    Active
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => setDownloadingQR(qr)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleShare(qr)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-purple-500 transition-colors" title="Share">
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                    {qr.isDynamic ? (
                                                        <button onClick={() => setEditingQR(qr)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-blue-600 transition-colors" title="Edit Target">
                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Analytics">
                                                            <BarChart3 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => setVisualizingQR(qr)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Visualize">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteQR(qr.id)} className="p-2 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredQRs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <QrCode className="w-8 h-8 opacity-20" />
                                                    <p className="text-sm font-medium">No QR codes found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* Edit Modal */}
            {editingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Edit Target URL</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Dynamic Short Link</label>
                                <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-white/5 px-4 py-3 rounded-xl text-xs font-mono text-gray-600 dark:text-gray-300 flex items-center justify-between">
                                    {editingQR.shortUrl}
                                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">New Destination URL</label>
                                <input
                                    type="text"
                                    defaultValue={editingQR.url}
                                    id="edit-url-input"
                                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 dark:text-white transition-all"
                                    placeholder="https://new-destination.com"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditingQR(null)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('edit-url-input') as HTMLInputElement;
                                        if (input) handleUpdateTarget(editingQR.id, input.value);
                                    }}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setDownloadingQR(null)}>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Download Format</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select the best format for your needs.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 mx-auto w-full flex items-center justify-center">
                            {qrPreview ? (
                                <img
                                    src={qrPreview}
                                    alt={downloadingQR.name}
                                    className="w-48 h-48 object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center bg-gray-50 text-gray-300">
                                    <div className="animate-pulse w-16 h-16 bg-gray-200 rounded" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {['png', 'jpeg', 'svg', 'pdf'].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => processDownload(downloadingQR, format as any)}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:bg-blue-500 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors shadow-sm">
                                        <Download className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{format}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setDownloadingQR(null)}
                            className="w-full py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Visualize Modal */}
            {visualizingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setVisualizingQR(null)}>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{visualizingQR.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium break-all max-w-[250px] mx-auto truncate opacity-80">{visualizingQR.isDynamic ? visualizingQR.shortUrl : visualizingQR.url}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
                            {qrPreview ? (
                                <img
                                    src={qrPreview}
                                    alt={visualizingQR.name}
                                    className="w-64 h-64 object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center bg-gray-50 text-gray-300">
                                    <div className="animate-pulse w-24 h-24 bg-gray-200 rounded" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 w-full">
                            {['png', 'jpeg', 'svg', 'pdf'].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => processDownload(visualizingQR, format as any)}
                                    className="py-2 bg-gray-50 dark:bg-zinc-950 hover:bg-blue-600 hover:text-white hover:border-transparent dark:text-gray-300 text-gray-700 rounded-xl font-bold transition-all text-[10px] uppercase border border-gray-200 dark:border-white/10"
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
