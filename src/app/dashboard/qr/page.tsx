'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [savedQRs, setSavedQRs] = useState<SavedQR[]>([]);
    const [deletedQRs, setDeletedQRs] = useState<SavedQR[]>([]);
    const [showTrash, setShowTrash] = useState(false); // Start empty, fetch on load
    const [isLoading, setIsLoading] = useState(false);

    // Fetch QRs from API
    const fetchQRs = async () => {
        try {
            const res = await fetch('/api/qr-codes');
            if (res.ok) {
                const data = await res.json();
                setSavedQRs(data.qrCodes.map((qr: any) => ({
                    id: qr.id,
                    name: qr.name,
                    url: qr.targetUrl, // The destination
                    shortUrl: qr.shortUrl, // The proxy
                    isDynamic: qr.isDynamic,
                    color: qr.color,
                    scans: qr.scans,
                    lastScan: 'N/A', // Not tracking time yet
                    createdAt: new Date(qr.createdAt).toLocaleDateString()
                })));
            }
        } catch (err) {
            console.error('Failed to load QRs:', err);
        }
    };

    useEffect(() => {
        fetchQRs();
        fetchDeletedQRs();
    }, []);

    const fetchDeletedQRs = async () => {
        try {
            const res = await fetch('/api/qr-codes?deletedOnly=true');
            const data = await res.json();
            setDeletedQRs(data.qrCodes || []);
        } catch (err) {
            console.error('Error fetching deleted QR codes:', err);
        }
    };

    const handleSaveQR = async (data: { url: string; name: string; color: string; image: string | Blob; isDynamic?: boolean; targetUrl?: string }) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/qr-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: data.url, // The user input destination
                    name: data.name,
                    color: data.color,
                    isDynamic: data.isDynamic
                })
            });

            if (res.ok) {
                await fetchQRs(); // Refresh list
                setActiveTab('manage');
            } else {
                alert('Failed to save QR code');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving QR code');
        } finally {
            setIsLoading(false);
        }
    };

    const [deletingQR, setDeletingQR] = useState<SavedQR | null>(null);

    const handleDeleteQR = async (id: string) => {
        try {
            const res = await fetch(`/api/qr-codes?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSavedQRs(savedQRs.filter(qr => qr.id !== id));
                fetchDeletedQRs(); // Refresh trash
                setDeletingQR(null);
            } else {
                alert('Failed to delete QR');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const res = await fetch('/api/qr-codes/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                fetchQRs();
                fetchDeletedQRs();
            } else {
                alert('Failed to restore QR');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/qr-codes?id=${id}&permanent=true`, { method: 'DELETE' });
            if (res.ok) {
                fetchDeletedQRs();
            } else {
                alert('Failed to permanently delete QR');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'dynamic' | 'static'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filteredQRs = savedQRs.filter(qr => {
        const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) || qr.url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all'
            ? true
            : filterType === 'dynamic' ? qr.isDynamic
                : !qr.isDynamic;
        return matchesSearch && matchesType;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredQRs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQRs = filteredQRs.slice(startIndex, endIndex);

    // Reset to page 1 when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    const [editingQR, setEditingQR] = useState<SavedQR | null>(null);

    const handleUpdateTarget = async (id: string, newUrl: string) => {
        try {
            const res = await fetch('/api/qr-codes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, targetUrl: newUrl })
            });

            if (res.ok) {
                setSavedQRs(savedQRs.map(qr =>
                    qr.id === id ? { ...qr, url: newUrl } : qr
                ));
                setEditingQR(null);
            } else {
                alert('Failed to update target URL');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating target URL');
        }
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
            // Generate fresh preview using latest data
            try {
                const QRCodeStyling = (await import('qr-code-styling')).default;
                const qrCode = new QRCodeStyling({
                    width: 1000,
                    height: 1000,
                    // IMPORANT: PROD change -> use shortUrl if dynamic
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
                <button
                    onClick={() => setShowTrash(true)}
                    className="relative px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Trash
                    {deletedQRs.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {deletedQRs.length}
                        </span>
                    )}
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
                                    <AnimatePresence mode="wait">
                                        {paginatedQRs.map((qr, index) => (
                                            <motion.tr
                                                key={qr.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }}
                                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors group"
                                            >
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
                                                                <span className="truncate font-mono bg-green-50 dark:bg-green-500/10 px-1 rounded flex-1">{qr.shortUrl}</span>
                                                                <button
                                                                    onClick={() => window.open(qr.shortUrl, '_blank')}
                                                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 transition-colors"
                                                                    title="Test Redirect"
                                                                >
                                                                    <Share2 className="w-3 h-3" />
                                                                </button>
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
                                                        <button onClick={() => setDeletingQR(qr)} className="p-2 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {paginatedQRs.length === 0 && filteredQRs.length === 0 && (
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

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-bold text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(endIndex, filteredQRs.length)}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredQRs.length}</span> QR codes
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-bold rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <motion.button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                animate={{
                                                    scale: currentPage === page ? 1 : 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {page}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-bold rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeletingQR(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-white/10"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Move to Trash?</h3>
                                        <p className="text-orange-100 text-sm">You can restore it later</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{deletingQR.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{deletingQR.url}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                        <p>The QR code will be moved to trash</p>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                        <p>You can restore it anytime from the trash</p>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                        <p>The QR code will stop working until restored</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setDeletingQR(null)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDeleteQR(deletingQR.id)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all"
                                    >
                                        Move to Trash
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trash View Modal */}
            <AnimatePresence>
                {showTrash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTrash(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-white/10"
                        >
                            {/* Header */}
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]"></div>
                                <div className="relative px-8 py-6 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-white/10 shadow-lg">
                                                    <Trash2 className="w-7 h-7 text-blue-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Trash</h3>
                                                <p className="text-slate-400 text-sm mt-0.5">
                                                    {deletedQRs.length} {deletedQRs.length === 1 ? 'item' : 'items'} • Can be restored anytime
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowTrash(false)}
                                            className="w-11 h-11 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all group border border-white/5"
                                        >
                                            <span className="text-2xl text-slate-400 group-hover:text-white transition-colors">×</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 overflow-y-auto max-h-[calc(85vh-140px)] bg-gray-50/50 dark:bg-zinc-950/50">
                                {deletedQRs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
                                            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-lg">
                                                <Trash2 className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trash is empty</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Deleted QR codes will appear here and can be restored anytime</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {deletedQRs.map((qr, index) => (
                                            <motion.div
                                                key={qr.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5"
                                            >
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="relative shrink-0">
                                                            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-xl group-hover:bg-blue-500/30 transition-all"></div>
                                                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                                                                <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 dark:text-white truncate text-lg">{qr.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{qr.url}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => {
                                                                handleRestore(qr.id);
                                                                setShowTrash(false);
                                                            }}
                                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20 transition-all text-sm"
                                                        >
                                                            Restore
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => {
                                                                if (confirm('Permanently delete this QR code? This cannot be undone.')) {
                                                                    handlePermanentDelete(qr.id);
                                                                }
                                                            }}
                                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all text-sm"
                                                        >
                                                            Delete Forever
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
