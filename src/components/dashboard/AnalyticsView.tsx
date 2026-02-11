'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Smartphone, Globe, Calendar, BarChart3, Clock, ArrowRight, QrCode, Activity, Zap, Users } from 'lucide-react';
import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SavedQR {
    id: string;
    name: string;
    url: string;
    shortUrl?: string;
    isDynamic?: boolean;
    color: string;
    scans: number;
    lastScan: string;
    createdAt: string;
    location: string;
    device: string;
    imageBlob?: Blob | string;
}

interface AnalyticsViewProps {
    qrs: SavedQR[];
    onSelectQR: (qr: SavedQR) => void;
    selectedQR: SavedQR | null;
}

interface AnalyticsData {
    stats: {
        totalScans: number;
        uniqueDevices: number;
        topLocation: string;
        scanTrend: number;
    };
    deviceBreakdown: Array<{ device: string; count: number }>;
    browserBreakdown: Array<{ browser: string; count: number }>;
    scanTimeline: Array<{ date: string; scans: number }>;
    recentScans: Array<{
        timestamp: string;
        device: string;
        browser: string;
        location: string;
    }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsView({ qrs, onSelectQR, selectedQR }: AnalyticsViewProps) {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedQR) {
            fetchAnalytics(selectedQR.id);
        }
    }, [selectedQR]);

    const fetchAnalytics = async (qrId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/${qrId}`);
            if (res.ok) {
                const data = await res.json();
                setAnalyticsData(data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate overview stats
    const totalScans = qrs.reduce((sum, qr) => sum + qr.scans, 0);
    const activeQRs = qrs.filter(qr => qr.scans > 0).length;
    const topQR = qrs.reduce((max, qr) => qr.scans > max.scans ? qr : max, qrs[0] || { scans: 0, name: 'None' });
    const avgScansPerQR = qrs.length > 0 ? Math.round(totalScans / qrs.length) : 0;

    // Mock timeline data for overview
    const mockTimelineData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        scans: Math.floor(Math.random() * 50) + 10
    }));

    return (
        <div className="flex h-full">
            {/* Blue Sidebar */}
            <div className="w-20 bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-4 flex flex-col items-center gap-6 shadow-xl">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <QrCode className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 flex flex-col gap-4 mt-8">
                    <button className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all group">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                        <Activity className="w-5 h-5 text-white/70" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                        <Zap className="w-5 h-5 text-white/70" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                        <Users className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                <div className="w-10 h-10 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-6">
                {!selectedQR ? (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your QR code performance</p>
                        </div>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Column - Large Chart */}
                            <div className="col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Scan Activity (7 Days)</h3>
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={mockTimelineData}>
                                        <defs>
                                            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Middle Column - Stats Cards */}
                            <div className="col-span-4 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Scans</span>
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalScans.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all QR codes</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Active QRs</span>
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeQRs}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">With scans</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Avg per QR</span>
                                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgScansPerQR}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Scans per code</p>
                                </motion.div>
                            </div>

                            {/* Right Column - Featured Card + Progress */}
                            <div className="col-span-3 space-y-4">
                                {/* Top Performer Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative z-10">
                                        <p className="text-xs font-bold uppercase opacity-90 mb-2">Top Performer</p>
                                        <h3 className="text-xl font-bold mb-1 truncate">{topQR.name}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold">{topQR.scans}</span>
                                            <span className="text-sm opacity-75">scans</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Scan Rate Progress */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm"
                                >
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">Engagement Rate</p>
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-32 h-32">
                                            <svg className="transform -rotate-90 w-32 h-32">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    className="text-gray-200 dark:text-gray-700"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    strokeDasharray={`${(activeQRs / qrs.length) * 351.86} 351.86`}
                                                    className="text-blue-600 dark:text-blue-400"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {qrs.length > 0 ? Math.round((activeQRs / qrs.length) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">QR codes with activity</p>
                                </motion.div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-2">
                                            <QrCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{qrs.length}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total QRs</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-2">
                                            <TrendingUp className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">+12%</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">This week</p>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code List - Full Width */}
                            <div className="col-span-12 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your QR Codes</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to view detailed analytics</p>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {qrs.map((qr, index) => (
                                        <motion.button
                                            key={qr.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => onSelectQR(qr)}
                                            className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                                                        {qr.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{qr.url}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{qr.scans}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${qr.scans > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                                    {qr.scans > 0 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Individual QR Analytics - Keep existing detailed view */}
                        <button
                            onClick={() => onSelectQR(null as any)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to Overview
                        </button>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                                </div>
                            </div>
                        ) : analyticsData ? (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedQR.name}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedQR.url}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-white rounded-lg p-0.5 border border-gray-100 flex items-center justify-center overflow-hidden">
                                        <QRCodeDisplay
                                            data={selectedQR.isDynamic && selectedQR.shortUrl ? selectedQR.shortUrl : selectedQR.url}
                                            width={60}
                                            height={60}
                                            color={selectedQR.color}
                                        />
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Scans</span>
                                            <BarChart3 className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.stats.totalScans}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {analyticsData.stats.scanTrend >= 0 ? (
                                                <TrendingUp className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 text-red-500" />
                                            )}
                                            <span className={`text-xs font-bold ${analyticsData.stats.scanTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {analyticsData.stats.scanTrend >= 0 ? '+' : ''}{analyticsData.stats.scanTrend}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Devices</span>
                                            <Smartphone className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.stats.uniqueDevices}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique</p>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Top Location</span>
                                            <Globe className="w-4 h-4 text-green-500" />
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{analyticsData.stats.topLocation}</p>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Created</span>
                                            <Calendar className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {new Date(selectedQR.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
                                        {analyticsData.deviceBreakdown.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={analyticsData.deviceBreakdown}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={(entry: any) => `${entry.device} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                                        outerRadius={70}
                                                        fill="#8884d8"
                                                        dataKey="count"
                                                    >
                                                        {analyticsData.deviceBreakdown.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                                                No device data yet
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Browser Distribution</h3>
                                        {analyticsData.browserBreakdown.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={analyticsData.browserBreakdown}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                                    <XAxis dataKey="browser" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                                    <Tooltip />
                                                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                                                No browser data yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Scan Timeline (Last 30 Days)</h3>
                                    {analyticsData.scanTimeline.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={analyticsData.scanTimeline}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                                            No scan history yet
                                        </div>
                                    )}
                                </div>

                                {/* Recent Scans */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-white/10">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Scans</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-zinc-950">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Time</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Device</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Browser</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Location</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                                {analyticsData.recentScans.length > 0 ? (
                                                    analyticsData.recentScans.slice(0, 10).map((scan, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-950">
                                                            <td className="px-4 py-2 text-gray-900 dark:text-white">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs">{new Date(scan.timestamp).toLocaleString()}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300">{scan.device}</td>
                                                            <td className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300">{scan.browser}</td>
                                                            <td className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300">{scan.location}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">
                                                            No scans recorded yet
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
