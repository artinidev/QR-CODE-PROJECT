'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import AdvancedQRGenerator from '@/components/dashboard/AdvancedQRGenerator';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import QRCodeDisplay, { QRCodeHandle } from '@/components/dashboard/QRCodeDisplay';
import { Trash2, Smartphone, MapPin, Clock, BarChart3, QrCode, Download, Share2, Eye, Settings, Copy, CheckCircle, Search } from 'lucide-react';
import { usePageTutorial } from '@/hooks/useTutorial';
import { qrGeneratorSteps } from '@/components/onboarding/tutorialSteps';

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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'analytics'>('create');
    const [selectedAnalyticsQR, setSelectedAnalyticsQR] = useState<SavedQR | null>(null);
    const [savedQRs, setSavedQRs] = useState<SavedQR[]>([]);
    const [deletedQRs, setDeletedQRs] = useState<SavedQR[]>([]);
    const [showTrash, setShowTrash] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Tutorial State
    const { runPageTutorial, completePageTutorial, skipPageTutorial } = usePageTutorial('qr-generator');

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'dynamic' | 'static'>('all');

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
                    lastScan: qr.lastScan ? new Date(qr.lastScan).toLocaleString() : 'Never',
                    createdAt: new Date(qr.createdAt).toLocaleDateString(),
                    location: 'Various', // Will be enhanced with analytics
                    device: 'Various' // Will be enhanced with analytics
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

    const handleRestoreQR = async (id: string) => {
        try {
            const res = await fetch(`/api/qr-codes?id=${id}&restore=true`, { method: 'POST' });
            if (res.ok) {
                fetchDeletedQRs();
                fetchQRs();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('Are you surely want to permanently delete this QR code? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/qr-codes?id=${id}&permanent=true`, { method: 'DELETE' });
            if (res.ok) {
                setDeletedQRs(deletedQRs.filter(qr => qr.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [editingQR, setEditingQR] = useState<SavedQR | null>(null);
    const [downloadingQR, setDownloadingQR] = useState<SavedQR | null>(null);
    const [visualizingQR, setVisualizingQR] = useState<SavedQR | null>(null);

    // Download Logic
    const qrRef = useRef<QRCodeHandle>(null);
    const [downloadExtension, setDownloadExtension] = useState<'png' | 'jpeg' | 'svg'>('png');

    const triggerDownload = async (name: string, format: 'png' | 'jpeg' | 'svg') => {
        if (qrRef.current) {
            // Sanitize filename but preserve spaces and case for better UX
            const cleanName = (name || 'qr-code').trim().replace(/[\/\\:*?"<>|]/g, '-');
            await qrRef.current.download(format, `${cleanName}.${format}`);
        }
    };

    const handleUpdateQR = async (id: string, newUrl: string) => {
        try {
            const res = await fetch(`/api/qr-codes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    targetUrl: newUrl
                })
            });

            if (res.ok) {
                fetchQRs();
                setEditingQR(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = async (qr: SavedQR) => {
        if (navigator.share) {
            try {
                // If it's dynamic, share the short URL. If static, share the destination.
                // Or maybe share the QR image? For now let's share the URL.
                await navigator.share({
                    title: `QR Code: ${qr.name}`,
                    text: `Check out this QR code for ${qr.name}`,
                    url: qr.isDynamic ? qr.shortUrl : qr.url
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(qr.isDynamic ? qr.shortUrl! : qr.url);
            alert('Link copied to clipboard!');
        }
    };

    // Replaced with triggerDownload
    const handleDownload = (qr: SavedQR, format: 'png' | 'svg' | 'jpeg') => {
        // Legacy shim if needed, or unused now
    };

    // Filter Logic
    const filteredQRs = savedQRs.filter(qr => {
        const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            qr.url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all'
            ? true
            : filterType === 'dynamic' ? qr.isDynamic : !qr.isDynamic;
        return matchesSearch && matchesType;
    });

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredQRs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQRs = filteredQRs.slice(startIndex, endIndex);

    // Tutorial Callback Handler
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            if (status === STATUS.FINISHED) {
                completePageTutorial();
            } else if (status === STATUS.SKIPPED) {
                skipPageTutorial();
            }
        }
    };

    return (
        <div className="space-y-8 pb-10">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Studio</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Design, customize, and track your intelligent QR codes.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl w-fit border border-gray-200 dark:border-white/5">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Create New
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Manage QRs
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    Analytics
                </button>
                <button
                    onClick={() => setShowTrash(true)}
                    className="relative px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2"
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
            ) : activeTab === 'analytics' ? (
                /* Analytics Section */
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AnalyticsView
                        qrs={savedQRs}
                        onSelectQR={setSelectedAnalyticsQR}
                        selectedQR={selectedAnalyticsQR}
                    />
                </section>
            ) : (
                /* Management Section */
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white hidden md:block">Your Active QR Codes</h2>

                        {/* Search & Filter Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search QR codes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="dynamic">Dynamic</option>
                                <option value="static">Static</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-white/5">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">QR Code</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Stats</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
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
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors group"
                                            >
                                                {/* Details */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                                                            {qr.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white text-sm">{qr.name}</div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                {qr.isDynamic && (
                                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wide">
                                                                        Dynamic
                                                                    </span>
                                                                )}
                                                                <a href={qr.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 truncate max-w-[150px]">
                                                                    {qr.url}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* QR Code */}
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-white/5 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
                                                        <QRCodeDisplay
                                                            data={qr.isDynamic && qr.shortUrl ? qr.shortUrl : qr.url}
                                                            width={48}
                                                            height={48}
                                                            color={qr.color}
                                                        />
                                                    </div>
                                                </td>

                                                {/* Stats */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{qr.scans}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Scans</span>
                                                    </div>
                                                </td>

                                                {/* Last Activity */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-white font-medium">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                            {qr.lastScan}
                                                        </div>
                                                        {qr.lastScan !== 'Never' && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5 pointer-events-none">
                                                                <MapPin className="w-3 h-3" />
                                                                {qr.device || 'Unknown'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => setDownloadingQR(qr)}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors group"
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(qr)}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex items-center justify-center transition-colors group"
                                                            title="Share"
                                                        >
                                                            <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                                        </button>
                                                        {qr.isDynamic ? (
                                                            <button
                                                                onClick={() => setEditingQR(qr)}
                                                                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-orange-100 dark:hover:bg-orange-900/30 flex items-center justify-center transition-colors group"
                                                                title="Edit Target"
                                                            >
                                                                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900/50 flex items-center justify-center cursor-not-allowed opacity-50"
                                                                title="Static QR (Cannot Edit)"
                                                                disabled
                                                            >
                                                                <Settings className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setVisualizingQR(qr)}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-green-100 dark:hover:bg-green-900/30 flex items-center justify-center transition-colors group"
                                                            title="Visualize"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingQR(qr)}
                                                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors group"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {paginatedQRs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                                                        <QrCode className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">No QR codes found</p>
                                                        <p className="text-xs mt-1">
                                                            {searchQuery || filterType !== 'all'
                                                                ? 'Try adjusting your filters'
                                                                : 'Create your first QR code to get started'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-900/30">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-bold text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(endIndex, filteredQRs.length)}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredQRs.length}</span> results
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingQR(null)}>
                    <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit QR Destination</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Target URL</label>
                                <input
                                    type="url"
                                    defaultValue={editingQR.url}
                                    id="edit-url-input"
                                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setEditingQR(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-bold">Cancel</button>
                                <button
                                    onClick={() => handleUpdateQR(editingQR.id, (document.getElementById('edit-url-input') as HTMLInputElement).value)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Modal */}
            {downloadingQR && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDownloadingQR(null)}>
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Download QR</h2>
                            <p className="text-gray-500 text-sm">Select your preferred format</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <QRCodeDisplay
                                ref={qrRef}
                                data={downloadingQR.isDynamic && downloadingQR.shortUrl ? downloadingQR.shortUrl : downloadingQR.url}
                                width={200}
                                height={200}
                                color={downloadingQR.color}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <select
                                value={downloadExtension}
                                onChange={(e) => setDownloadExtension(e.target.value as any)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="svg">SVG</option>
                            </select>
                            <button
                                onClick={() => triggerDownload(downloadingQR.name, downloadExtension)}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visualize Modal */}
            {visualizingQR && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setVisualizingQR(null)}>
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{visualizingQR.name}</h2>

                        <div className="bg-white p-2 rounded-2xl shadow-inner">
                            <QRCodeDisplay
                                ref={qrRef}
                                data={visualizingQR.isDynamic && visualizingQR.shortUrl ? visualizingQR.shortUrl : visualizingQR.url}
                                width={256}
                                height={256}
                                color={visualizingQR.color}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <select
                                value={downloadExtension}
                                onChange={(e) => setDownloadExtension(e.target.value as any)}
                                className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="svg">SVG</option>
                            </select>
                            <button
                                onClick={() => triggerDownload(visualizingQR.name, downloadExtension)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-white/5">
                                <span className="text-xs font-bold text-gray-500 uppercase">Scans</span>
                                <span className="font-bold text-gray-900 dark:text-white">{visualizingQR.scans}</span>
                            </div>
                            <button
                                onClick={() => setVisualizingQR(null)}
                                className="w-full py-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingQR && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeletingQR(null)}>
                    <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete QR Code?</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deletingQR.name}"</span>?
                                <br />It will be moved to trash.
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-white/10">
                            <button
                                onClick={() => setDeletingQR(null)}
                                className="flex-1 py-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteQR(deletingQR.id)}
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trash Modal */}
            {showTrash && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTrash(false)}>
                    <div className="bg-white dark:bg-zinc-800 rounded-3xl w-full max-w-2xl h-[600px] shadow-2xl flex flex-col border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-gray-400" />
                                Trash ({deletedQRs.length})
                            </h2>
                            <button onClick={() => setShowTrash(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {deletedQRs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Trash2 className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Trash is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {deletedQRs.map(qr => (
                                        <div key={qr.id} className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/5 opacity-50">
                                                    <QrCode className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm line-through opacity-70">{qr.name}</p>
                                                    <p className="text-xs text-gray-400">Deleted {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRestoreQR(qr.id)}
                                                    className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(qr.id)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                                >
                                                    Delete Forever
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial Component */}
            <Joyride
                steps={qrGeneratorSteps}
                run={runPageTutorial}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                disableOverlayClose
                disableCloseOnEsc
                spotlightClicks
                styles={{
                    options: {
                        primaryColor: '#6366f1',
                        textColor: '#e2e8f0',
                        backgroundColor: '#1e293b',
                        overlayColor: 'rgba(0, 0, 0, 0.7)',
                        arrowColor: '#1e293b',
                        zIndex: 10000,
                    },
                    tooltip: {
                        borderRadius: 12,
                        padding: 0,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    },
                    buttonNext: {
                        backgroundColor: '#6366f1',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    },
                    buttonBack: {
                        color: '#94a3b8',
                        marginRight: 10,
                    },
                    buttonSkip: {
                        color: '#64748b',
                    },
                }}
            />
        </div>
    );
}
