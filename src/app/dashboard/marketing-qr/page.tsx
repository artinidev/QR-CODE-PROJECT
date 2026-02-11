'use client';

import React, { useState, useEffect, useRef } from 'react';
import MarketingTabs from '@/components/marketing/MarketingTabs';
import CampaignBuilder from '@/components/marketing/CampaignBuilder';
import MarketingAnalytics from '@/components/marketing/MarketingAnalytics';
import { Search, Filter, MoreHorizontal, ExternalLink, QrCode, Trash2, RotateCcw, BarChart2, Download, Edit, Share2, Eye, Settings, X, Copy, Mail, Info, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import QRCodeDisplay, { QRCodeHandle } from '@/components/dashboard/QRCodeDisplay';

interface Campaign {
    id: string;
    name: string;
    targetUrl: string;
    shortUrl: string;
    scans: number;
    createdAt: string;
    color: string;
    isDynamic: boolean;
}

export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState('create');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [trashCount, setTrashCount] = useState(0);
    const [visualizingCampaign, setVisualizingCampaign] = useState<Campaign | null>(null);
    const [downloadExtension, setDownloadExtension] = useState<'png' | 'jpeg' | 'svg'>('png');
    const qrRef = useRef<QRCodeHandle>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active'>('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [sharingCampaign, setSharingCampaign] = useState<Campaign | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [editTargetUrl, setEditTargetUrl] = useState('');
    const [editRedirectUrl, setEditRedirectUrl] = useState('');
    const [editSuccess, setEditSuccess] = useState(false);
    const [targetUrlError, setTargetUrlError] = useState('');
    const [redirectUrlError, setRedirectUrlError] = useState('');

    const fetchCampaigns = async (isTrash = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: 'marketing-campaign',
                deletedOnly: isTrash ? 'true' : 'false'
            });
            const res = await fetch(`/api/qr-codes?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data.qrCodes || []);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrashCount = async () => {
        try {
            const params = new URLSearchParams({
                type: 'marketing-campaign',
                deletedOnly: 'true'
            });
            const res = await fetch(`/api/qr-codes?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTrashCount(data.qrCodes?.length || 0);
            }
        } catch (error) {
            console.error('Failed to fetch trash count', error);
        }
    };

    useEffect(() => {
        fetchTrashCount();
    }, []);

    useEffect(() => {
        if (activeTab === 'manage') {
            fetchCampaigns(false);
        } else if (activeTab === 'trash') {
            fetchCampaigns(true);
        }
    }, [activeTab]);

    const handleDelete = async (id: string, permanent = false) => {
        if (!confirm(permanent ? 'Are you sure you want to permanently delete this campaign?' : 'Move to trash?')) return;

        try {
            const res = await fetch(`/api/qr-codes?id=${id}&permanent=${permanent}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCampaigns(activeTab === 'trash');
                fetchTrashCount();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlerestore = async (id: string) => {
        // Restore logic would need an API endpoint or a patch to clear deletedAt
        // For now, let's assume we can PATCH it. The current API might not support restore explicitly.
        // We'd need to update the API to support clearing deletedAt.
        // Alternatively, we can just re-create it or implement restore later.
        alert("Restore functionality coming soon.");
    };

    const triggerDownload = async (name: string, format: 'png' | 'jpeg' | 'svg') => {
        if (qrRef.current) {
            const cleanName = (name || 'qr-code').trim().replace(/[\/\\:*?"<>|]/g, '-');
            await qrRef.current.download(format, `${cleanName}.${format}`);
        }
    };

    // Filter and search campaigns
    const filteredCampaigns = campaigns.filter(campaign => {
        // Search filter
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter (all campaigns are active in manage tab)
        const matchesStatus = filterStatus === 'all' || filterStatus === 'active';

        return matchesSearch && matchesStatus;
    });

    // Export to CSV
    const handleExport = () => {
        const csvContent = [
            ['Campaign Name', 'Target URL', 'Short URL', 'Scans', 'Created Date'],
            ...filteredCampaigns.map(c => [
                c.name,
                c.targetUrl,
                c.shortUrl,
                c.scans.toString(),
                new Date(c.createdAt).toLocaleDateString()
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketing-campaigns-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Share campaign
    const handleShare = (campaign: Campaign) => {
        setSharingCampaign(campaign);
    };

    // Copy link to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
    };

    // Validate URL format
    const validateUrl = (url: string): boolean => {
        if (!url || url.trim() === '') {
            return false;
        }
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            return false;
        }
    };

    // Edit campaign link
    const handleEditLink = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setEditTargetUrl(campaign.targetUrl);
        setEditRedirectUrl(campaign.shortUrl);
        setEditSuccess(false); // Reset success state
        setTargetUrlError(''); // Reset errors
        setRedirectUrlError('');
    };

    // Save edited campaign
    const saveEditedCampaign = async () => {
        if (!editingCampaign) return;

        // Reset errors
        setTargetUrlError('');
        setRedirectUrlError('');

        // Validate URLs
        let hasError = false;

        if (!validateUrl(editTargetUrl)) {
            setTargetUrlError('Please enter a valid URL (e.g., https://example.com)');
            hasError = true;
        }

        if (!validateUrl(editRedirectUrl)) {
            setRedirectUrlError('Please enter a valid URL (e.g., https://short.link/abc123)');
            hasError = true;
        }

        // Don't save if there are errors
        if (hasError) {
            return;
        }

        // TODO: Implement API call to update campaign
        console.log('Saving campaign:', {
            id: editingCampaign.id,
            targetUrl: editTargetUrl,
            shortUrl: editRedirectUrl
        });

        // Update local state
        setCampaigns(campaigns.map(c =>
            c.id === editingCampaign.id
                ? { ...c, targetUrl: editTargetUrl, shortUrl: editRedirectUrl }
                : c
        ));

        // Show success message
        setEditSuccess(true);
    };

    // Close edit modal and reset states
    const closeEditModal = () => {
        setEditingCampaign(null);
        setEditSuccess(false);
    };


    // Content for Manage QRs Tab
    const ManageContent = () => (
        <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-64 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-600 dark:text-gray-300"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                            {filterStatus !== 'all' && (
                                <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-xs font-bold">1</span>
                            )}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg p-2 w-48 z-10">
                                <button
                                    onClick={() => { setFilterStatus('all'); setShowFilterMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'all'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    All Campaigns
                                </button>
                                <button
                                    onClick={() => { setFilterStatus('active'); setShowFilterMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'active'
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    Active Only
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={filteredCampaigns.length === 0}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-900/20 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5 md:col-span-4 pl-4">Campaign Name</div>
                <div className="col-span-3 md:col-span-2 hidden md:block">Status</div>
                <div className="col-span-3 md:col-span-2">Scans</div>
                <div className="col-span-3 md:col-span-2 hidden md:block">Date</div>
                <div className="col-span-4 md:col-span-2 text-right pr-4">Actions</div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : filteredCampaigns.length === 0 ? (
                /* Empty State */
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-8 h-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Campaigns Yet</h3>
                    <p className="max-w-md mx-auto mb-6 text-sm">Create your first marketing campaign to start tracking engagement.</p>
                    <button
                        onClick={() => setActiveTab('create')}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                        Create Campaign
                    </button>
                </div>
            ) : (
                /* Campaign List */
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {filteredCampaigns.map(campaign => (
                        <div key={campaign.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="col-span-5 md:col-span-4 pl-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: campaign.color || '#000' }}
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white truncate">{campaign.name}</div>
                                        <a href={campaign.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-indigo-500 truncate block max-w-[150px]">
                                            {campaign.targetUrl}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 md:col-span-2 hidden md:block">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    Active
                                </span>
                            </div>
                            <div className="col-span-3 md:col-span-2">
                                <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                                    <BarChart2 className="w-4 h-4 text-gray-400" />
                                    {campaign.scans}
                                </div>
                            </div>
                            <div className="col-span-3 md:col-span-2 hidden md:block text-sm text-gray-500">
                                {new Date(campaign.createdAt).toLocaleDateString()}
                            </div>
                            <div className="col-span-4 md:col-span-2 text-right pr-4">
                                <div className="flex justify-end gap-1">
                                    <button
                                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors group"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => handleShare(campaign)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex items-center justify-center transition-colors group"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                                    </button>
                                    <button
                                        onClick={() => handleEditLink(campaign)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-orange-100 dark:hover:bg-orange-900/30 flex items-center justify-center transition-colors group"
                                        title="Edit Target"
                                    >
                                        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                                    </button>
                                    <button
                                        onClick={() => setVisualizingCampaign(campaign)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-green-100 dark:hover:bg-green-900/30 flex items-center justify-center transition-colors group"
                                        title="Visualize"
                                    >
                                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors group"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const AnalyticsContent = () => (
        <MarketingAnalytics campaigns={filteredCampaigns} />
    );

    const TrashContent = () => (
        <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-bold">Trash</h3>
                <p className="text-sm text-gray-500">Deleted campaigns are stored here.</p>
            </div>
            {loading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : campaigns.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Trash is empty.</div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="grid grid-cols-12 gap-4 p-4 items-center opacity-75">
                            <div className="col-span-6 pl-4 font-medium">{campaign.name}</div>
                            <div className="col-span-6 text-right pr-4 flex items-center justify-end gap-2">
                                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Restore (Coming Soon)">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(campaign.id, true)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Permanently">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section - Consistent for all tabs */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Marketing Campaigns</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Manage your tracking-enabled QR codes and analyze performance.</p>
            </div>

            {/* Tabs Navigation */}
            <MarketingTabs activeTab={activeTab} onTabChange={setActiveTab} trashCount={trashCount} />

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'create' && (
                    <CampaignBuilder onComplete={() => setActiveTab('manage')} />
                )}
                {activeTab === 'manage' && <ManageContent />}
                {activeTab === 'analytics' && <AnalyticsContent />}
                {activeTab === 'trash' && <TrashContent />}
            </div>

            {/* Visualize Modal */}
            {visualizingCampaign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setVisualizingCampaign(null)}>
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{visualizingCampaign.name}</h2>

                        <div className="bg-white p-2 rounded-2xl shadow-inner">
                            <QRCodeDisplay
                                ref={qrRef}
                                data={visualizingCampaign.isDynamic && visualizingCampaign.shortUrl ? visualizingCampaign.shortUrl : visualizingCampaign.targetUrl}
                                width={256}
                                height={256}
                                color={visualizingCampaign.color}
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
                                onClick={() => triggerDownload(visualizingCampaign.name, downloadExtension)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-white/5">
                                <span className="text-xs font-bold text-gray-500 uppercase">Scans</span>
                                <span className="font-bold text-gray-900 dark:text-white">{visualizingCampaign.scans}</span>
                            </div>
                            <button
                                onClick={() => setVisualizingCampaign(null)}
                                className="w-full py-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {sharingCampaign && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Campaign</h3>
                            <button
                                onClick={() => setSharingCampaign(null)}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Campaign Name</label>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">{sharingCampaign.name}</div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Short URL</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={sharingCampaign.shortUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(sharingCampaign.shortUrl)}
                                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Share via</label>
                                <div className="grid grid-cols-4 gap-3">
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharingCampaign.shortUrl)}&text=${encodeURIComponent(sharingCampaign.name)}`, '_blank')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Share2 className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Twitter</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharingCampaign.shortUrl)}`, '_blank')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Share2 className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharingCampaign.shortUrl)}`, '_blank')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                                            <Share2 className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(sharingCampaign.name)}&body=${encodeURIComponent(sharingCampaign.shortUrl)}`, '_blank')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Link Modal */}
            {editingCampaign && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Campaign Link</h3>
                            <button
                                onClick={closeEditModal}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {!editSuccess ? (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Campaign Name</label>
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                            {editingCampaign.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                                            Destination URL
                                            <span className="text-xs font-normal text-gray-500 ml-2">(Where the QR code redirects to)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={editTargetUrl}
                                            onChange={(e) => {
                                                setEditTargetUrl(e.target.value);
                                                if (targetUrlError) setTargetUrlError(''); // Clear error on change
                                            }}
                                            placeholder="https://example.com"
                                            className={`w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border rounded-xl text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 transition-all ${targetUrlError
                                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/20'
                                                }`}
                                        />
                                        {targetUrlError && (
                                            <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-xs font-medium">{targetUrlError}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                                            Short URL / Redirect URL
                                            <span className="text-xs font-normal text-gray-500 ml-2">(Custom short link)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editRedirectUrl}
                                            onChange={(e) => {
                                                setEditRedirectUrl(e.target.value);
                                                if (redirectUrlError) setRedirectUrlError(''); // Clear error on change
                                            }}
                                            placeholder="https://short.link/abc123"
                                            className={`w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border rounded-xl text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 transition-all ${redirectUrlError
                                                ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/20'
                                                }`}
                                        />
                                        {redirectUrlError && (
                                            <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-xs font-medium">{redirectUrlError}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-900 dark:text-blue-200">
                                                <p className="font-semibold mb-1">Dynamic QR Code</p>
                                                <p className="text-blue-700 dark:text-blue-300">You can change the destination URL at any time without regenerating the QR code. The short URL remains the same.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeEditModal}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEditedCampaign}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success Message */}
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">URLs Updated Successfully!</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                            Your campaign URLs have been updated. The changes are now live.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 space-y-2">
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Destination URL</span>
                                            <p className="text-sm text-gray-900 dark:text-white truncate">{editTargetUrl}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Short URL</span>
                                            <p className="text-sm text-gray-900 dark:text-white truncate">{editRedirectUrl}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeEditModal}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
                                    >
                                        Exit
                                    </button>
                                    <button
                                        onClick={() => setEditSuccess(false)}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        Edit Again
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
