'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Smartphone, Globe, Calendar, BarChart3, Clock } from 'lucide-react';
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

export default function QRAnalyticsPage() {
    const params = useParams();
    const router = useRouter();
    const qrId = params.qrId as string;

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
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
                    <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard/qr')}
                            className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.qrCode.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analytics Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Scans</span>
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats.totalScans}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {data.stats.scanTrend >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-xs font-bold ${data.stats.scanTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.stats.scanTrend >= 0 ? '+' : ''}{data.stats.scanTrend}% vs last week
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Unique Devices</span>
                            <Smartphone className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats.uniqueDevices}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Different user agents</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Top Location</span>
                            <Globe className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{data.stats.topLocation}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Most scans from here</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Created</span>
                            <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {new Date(data.qrCode.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">QR code age</p>
                    </motion.div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Device Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
                        {data.deviceBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.deviceBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry: any) => `${entry.device} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
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
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No device data yet
                            </div>
                        )}
                    </motion.div>

                    {/* Browser Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Browser Distribution</h3>
                        {data.browserBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.browserBreakdown}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="browser" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No browser data yet
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Scan Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-white/10"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scan Timeline (Last 30 Days)</h3>
                    {data.scanTimeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.scanTimeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">
                            No scan history yet
                        </div>
                    )}
                </motion.div>

                {/* Recent Scans Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Scans</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-950/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Browser</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Referrer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {data.recentScans.length > 0 ? (
                                    data.recentScans.map((scan, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20">
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    {new Date(scan.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{scan.device}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{scan.browser}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{scan.location}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{scan.referrer}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No scans recorded yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
