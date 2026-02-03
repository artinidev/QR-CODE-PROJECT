'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Smartphone, Globe, Calendar, BarChart3, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
    qrCode: {
        id: string;
        name: string;
        url: string;
        shortUrl: string;
        createdAt: string;
    };
    stats: {
        totalScans: number;
        uniqueDevices: number;
        topLocation: string;
        scanTrend: number;
    };
    deviceBreakdown: Array<{ device: string; count: number }>;
    browserBreakdown: Array<{ browser: string; count: number }>;
    osBreakdown: Array<{ os: string; count: number }>;
    locationBreakdown: Array<{ country: string; city: string; count: number }>;
    scanTimeline: Array<{ date: string; scans: number }>;
    recentScans: Array<{
        timestamp: string;
        device: string;
        browser: string;
        os: string;
        location: string;
        referrer: string;
    }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface AnalyticsModalProps {
    qrId: string;
    qrName: string;
    onClose: () => void;
}

export default function AnalyticsModal({ qrId, qrName, onClose }: AnalyticsModalProps) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [qrId]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`/api/analytics/${qrId}`);
            if (res.ok) {
                const analyticsData = await res.json();
                setData(analyticsData);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md">
                    <p className="text-gray-600 dark:text-gray-400 text-center">Failed to load analytics</p>
                    <button onClick={onClose} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-xl">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10 my-8"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 p-6 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{qrName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analytics Dashboard</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Scans</span>
                                    <BarChart3 className="w-4 h-4 text-blue-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.totalScans}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {data.stats.scanTrend >= 0 ? (
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                    )}
                                    <span className={`text-xs font-bold ${data.stats.scanTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {data.stats.scanTrend >= 0 ? '+' : ''}{data.stats.scanTrend}%
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Devices</span>
                                    <Smartphone className="w-4 h-4 text-purple-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.uniqueDevices}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Top Location</span>
                                    <Globe className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{data.stats.topLocation}</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Created</span>
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {new Date(data.qrCode.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Device Breakdown */}
                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
                                {data.deviceBreakdown.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={data.deviceBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry: any) => `${entry.device} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={70}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {data.deviceBreakdown.map((entry, index) => (
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

                            {/* Browser Distribution */}
                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Browser Distribution</h3>
                                {data.browserBreakdown.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={data.browserBreakdown}>
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

                        {/* Scan Timeline */}
                        <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Scan Timeline (Last 30 Days)</h3>
                            {data.scanTimeline.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={data.scanTimeline}>
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
                        <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-white/5">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Scans</h3>
                            </div>
                            <div className="overflow-x-auto max-h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-zinc-900">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Time</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Device</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Browser</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                        {data.recentScans.length > 0 ? (
                                            data.recentScans.slice(0, 10).map((scan, index) => (
                                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-zinc-900">
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
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
