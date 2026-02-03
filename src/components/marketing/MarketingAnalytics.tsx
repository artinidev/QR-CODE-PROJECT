'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, MapPin, Clock, ArrowRight, Smartphone, Zap,
    Download, FileText, BarChart3, X, ArrowUpRight, Loader2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Campaign {
    id: string;
    name: string;
    scans: number;
    targetUrl: string;
    shortUrl: string;
    createdAt: string;
    color: string;
    isDynamic: boolean;
    location?: string;
    lastScan?: string;
}

interface MarketingAnalyticsProps {
    campaigns: Campaign[];
}

interface AnalyticsData {
    stats: {
        totalScans: number;
        uniqueDevices: number;
        topLocation: string;
        scanTrend: number;
    };
    deviceBreakdown: { device: string; count: number }[];
    scanTimeline: { date: string; scans: number }[];
    recentScans: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

export default function MarketingAnalytics({ campaigns }: MarketingAnalyticsProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedCampaignId) {
            fetchAnalytics(selectedCampaignId);
        } else {
            setAnalyticsData(null);
        }
    }, [selectedCampaignId]);

    const fetchAnalytics = async (qrId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/analytics/${qrId}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();
            setAnalyticsData(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = (type: 'pdf' | 'excel', campaign: Campaign) => {
        if (!analyticsData) return;

        setIsExporting(true);
        try {
            if (type === 'pdf') {
                const doc = new jsPDF();

                // Header
                doc.setFontSize(20);
                doc.text('Campaign Analytics Report', 14, 22);

                doc.setFontSize(12);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

                // Campaign Details
                doc.setFontSize(16);
                doc.text('Campaign Details', 14, 45);

                const detailsData = [
                    ['Campaign Name', campaign.name],
                    ['Total Scans', analyticsData.stats.totalScans.toString()],
                    ['Unique Devices', analyticsData.stats.uniqueDevices.toString()],
                    ['Target URL', campaign.targetUrl],
                    ['Top Location', analyticsData.stats.topLocation],
                    ['Scan Trend', `${analyticsData.stats.scanTrend > 0 ? '+' : ''}${analyticsData.stats.scanTrend}%`]
                ];

                autoTable(doc, {
                    startY: 50,
                    head: [['Metric', 'Value']],
                    body: detailsData,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246] }
                });

                // Timeline Data
                doc.setFontSize(16);
                doc.text('Scan Activity (Last 30 Days)', 14, (doc as any).lastAutoTable.finalY + 15);

                const timelineRows = analyticsData.scanTimeline.map(d => [d.date, d.scans.toString()]);

                autoTable(doc, {
                    startY: (doc as any).lastAutoTable.finalY + 20,
                    head: [['Date', 'Scans']],
                    body: timelineRows,
                    theme: 'grid',
                    headStyles: { fillColor: [16, 185, 129] }
                });

                doc.save(`${campaign.name.replace(/\s+/g, '_')}_Report.pdf`);
            } else {
                // Excel Export
                const wb = XLSX.utils.book_new();

                // Sheet 1: Overview
                const overviewData = [
                    ['Campaign Analytics Report'],
                    ['Generated on', new Date().toLocaleString()],
                    [''],
                    ['Campaign Name', campaign.name],
                    ['Total Scans', analyticsData.stats.totalScans],
                    ['Unique Devices', analyticsData.stats.uniqueDevices],
                    ['Top Location', analyticsData.stats.topLocation],
                    ['Target URL', campaign.targetUrl]
                ];

                const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
                XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');

                // Sheet 2: Timeline
                const timelineData = [
                    ['Date', 'Scans'],
                    ...analyticsData.scanTimeline.map(d => [d.date, d.scans])
                ];

                const wsTimeline = XLSX.utils.aoa_to_sheet(timelineData);
                XLSX.utils.book_append_sheet(wb, wsTimeline, 'Timeline');

                // Sheet 3: Devices
                const deviceData = [
                    ['Device', 'Count'],
                    ...analyticsData.deviceBreakdown.map(d => [d.device, d.count])
                ];
                const wsDevices = XLSX.utils.aoa_to_sheet(deviceData);
                XLSX.utils.book_append_sheet(wb, wsDevices, 'Devices');

                XLSX.writeFile(wb, `${campaign.name.replace(/\s+/g, '_')}_Analytics.xlsx`);
            }

            setTimeout(() => {
                setIsExporting(false);
            }, 500);

        } catch (error) {
            console.error('Export failed:', error);
            setIsExporting(false);
            alert('Failed to export report. Please try again.');
        }
    };

    const getIconColor = (index: number) => {
        const colors = [
            { bg: 'bg-orange-100', text: 'text-orange-600' },
            { bg: 'bg-blue-100', text: 'text-blue-600' },
            { bg: 'bg-purple-100', text: 'text-purple-600' },
            { bg: 'bg-pink-100', text: 'text-pink-600' },
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Performance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into your QR campaign metrics</p>
                </div>
                {selectedCampaignId && (
                    <button
                        onClick={() => setSelectedCampaignId(null)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
                    >
                        <X className="w-4 h-4" /> Close View
                    </button>
                )}
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {campaigns.map((campaign, index) => {
                        const isExpanded = selectedCampaignId === campaign.id;
                        const isHidden = selectedCampaignId !== null && !isExpanded;
                        const iconColors = getIconColor(index);

                        if (isHidden) return null;

                        return (
                            <motion.div
                                key={campaign.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                                transition={{
                                    layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }, // The "Buttery Smooth" Standard Curve
                                    opacity: { duration: 0.3 }
                                }}
                                onClick={() => !isExpanded && setSelectedCampaignId(campaign.id)}
                                className={`
                                    bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group
                                    ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3 ring-2 ring-blue-500/20 shadow-xl' : 'hover:bg-gray-50 dark:hover:bg-zinc-700/50'}
                                `}
                            >
                                <div className="p-4">
                                    {/* Collapsed/Header View */}
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            layout="position"
                                            className={`w-12 h-12 rounded-xl ${iconColors.bg} flex items-center justify-center flex-shrink-0 transition-colors`}
                                        >
                                            <Megaphone className={`w-5 h-5 ${iconColors.text}`} />
                                        </motion.div>

                                        <div className="flex-1 min-w-0">
                                            {/* Header Row */}
                                            <motion.div layout="position" className="flex items-start justify-between mb-1">
                                                <h3 className={`font-bold text-gray-900 dark:text-white truncate ${isExpanded ? 'text-2xl mb-2' : 'text-sm'}`}>
                                                    {campaign.name}
                                                </h3>
                                                {!isExpanded && (
                                                    <motion.button
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="w-8 h-8 rounded-full bg-white dark:bg-zinc-600 border border-gray-200 dark:border-zinc-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                        <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                    </motion.button>
                                                )}
                                            </motion.div>

                                            {/* Sub-info Row */}
                                            <motion.p layout="position" className={`text-gray-600 dark:text-gray-400 mb-2 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                                                {isExpanded && analyticsData ? analyticsData.stats.totalScans : campaign.scans} Total Scans
                                            </motion.p>

                                            <motion.div layout="position" className="flex flex-wrap gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${campaign.scans > 0
                                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                                                    {campaign.scans > 0 ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${campaign.isDynamic
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                    : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'}`}>
                                                    {campaign.isDynamic ? 'Dynamic' : 'Static'}
                                                </span>
                                            </motion.div>

                                            <motion.div layout="position" className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>Top Location: {isExpanded && analyticsData ? analyticsData.stats.topLocation : (campaign.location || 'N/A')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Last scan: {campaign.lastScan || 'Never'}</span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Expanded Analytics View */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
                                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                                className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 space-y-8"
                                            >
                                                {isLoading ? (
                                                    <div className="flex justify-center items-center py-20">
                                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                                    </div>
                                                ) : error ? (
                                                    <div className="text-center py-10 text-red-500">
                                                        <p>{error}</p>
                                                        <button
                                                            onClick={() => fetchAnalytics(campaign.id)}
                                                            className="mt-2 text-sm text-blue-500 hover:underline"
                                                        >
                                                            Try Again
                                                        </button>
                                                    </div>
                                                ) : analyticsData && (
                                                    <>
                                                        {/* 1. Key Metrics Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {[
                                                                {
                                                                    label: 'Total Scans',
                                                                    value: analyticsData.stats.totalScans,
                                                                    sub: `${analyticsData.stats.scanTrend > 0 ? '+' : ''}${analyticsData.stats.scanTrend}% trend`,
                                                                    icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20'
                                                                },
                                                                {
                                                                    label: 'Unique Devices',
                                                                    value: analyticsData.stats.uniqueDevices,
                                                                    sub: 'Unique users',
                                                                    icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20'
                                                                },
                                                                {
                                                                    label: 'Last Scan',
                                                                    value: analyticsData.recentScans[0] ? new Date(analyticsData.recentScans[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                                                                    sub: analyticsData.recentScans[0] ? new Date(analyticsData.recentScans[0].timestamp).toLocaleDateString() : 'No scans yet',
                                                                    icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20'
                                                                },
                                                                {
                                                                    label: 'Top Location',
                                                                    value: analyticsData.stats.topLocation,
                                                                    sub: 'Most popular',
                                                                    icon: MapPin, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20'
                                                                },
                                                            ].map((stat, i) => (
                                                                <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                                                            <stat.icon className="w-4 h-4" />
                                                                        </div>
                                                                        {i === 0 && <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-3 h-3 mr-0.5" /> Trend</span>}
                                                                    </div>
                                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</div>
                                                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.sub}</div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* 2. Main Chart Area */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            <div className="lg:col-span-2 bg-gray-50 dark:bg-zinc-900/30 rounded-3xl p-6 border border-gray-100 dark:border-white/5">
                                                                <div className="flex items-center justify-between mb-6">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white">Scan Activity</h4>
                                                                        <p className="text-xs text-gray-500">Last 30 Days Performance</p>
                                                                    </div>
                                                                </div>
                                                                <div className="h-[250px] w-full">
                                                                    {analyticsData.scanTimeline.length > 0 ? (
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                            <AreaChart data={analyticsData.scanTimeline}>
                                                                                <defs>
                                                                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                                                                <XAxis
                                                                                    dataKey="date"
                                                                                    axisLine={false}
                                                                                    tickLine={false}
                                                                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                                                                    dy={10}
                                                                                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                                />
                                                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
                                                                                <Tooltip
                                                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                                                />
                                                                                <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                                                                            </AreaChart>
                                                                        </ResponsiveContainer>
                                                                    ) : (
                                                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                                            <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                                                                            <p className="text-sm">No scan history yet</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {/* Device Stats */}
                                                                <div className="bg-gray-50 dark:bg-zinc-900/30 rounded-3xl p-6 border border-gray-100 dark:border-white/5 h-full">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Devices</h4>
                                                                    <div className="relative h-[160px]">
                                                                        {analyticsData.deviceBreakdown.length > 0 ? (
                                                                            <>
                                                                                <ResponsiveContainer width="100%" height="100%">
                                                                                    <PieChart>
                                                                                        <Pie
                                                                                            data={analyticsData.deviceBreakdown}
                                                                                            innerRadius={50}
                                                                                            outerRadius={70}
                                                                                            paddingAngle={5}
                                                                                            dataKey="count"
                                                                                            nameKey="device"
                                                                                        >
                                                                                            {analyticsData.deviceBreakdown.map((entry, index) => (
                                                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                                                            ))}
                                                                                        </Pie>
                                                                                        <Tooltip />
                                                                                    </PieChart>
                                                                                </ResponsiveContainer>
                                                                                {/* Center Text */}
                                                                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.stats.totalScans}</span>
                                                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Total</span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                                                <Smartphone className="w-8 h-8 mb-2 opacity-50" />
                                                                                <p className="text-sm">No device data</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                                                                        {analyticsData.deviceBreakdown.map((d, i) => (
                                                                            <div key={i} className="flex items-center gap-1.5">
                                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                                                <span className="text-xs text-gray-500 font-medium">{d.device} ({d.count})</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* 3. Export & Actions Footer */}
                                                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                                                            <div className="text-sm text-gray-500">
                                                                Data updated <span className="font-semibold text-gray-900 dark:text-white">Just now</span>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleExport('excel', campaign); }}
                                                                    disabled={isExporting}
                                                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
                                                                >
                                                                    <FileText className="w-4 h-4 text-green-600" />
                                                                    Export Excel
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleExport('pdf', campaign); }}
                                                                    disabled={isExporting}
                                                                    className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-black dark:hover:bg-gray-100 flex items-center gap-2 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                                                                >
                                                                    {isExporting ? (
                                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                    ) : (
                                                                        <Download className="w-4 h-4" />
                                                                    )}
                                                                    Download Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {campaigns.length === 0 && (
                    <div className="col-span-3 text-center py-20 text-gray-400">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No marketing campaigns data available yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
