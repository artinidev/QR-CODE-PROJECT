import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ArrowLeft, RefreshCw, BarChart2, Users, Calendar } from 'lucide-react';

interface ProfileAnalyticsDetailProps {
    profileId: string;
    profileName: string;
    onBack: () => void;
}

interface AnalyticsDetailData {
    totalScans: number;
    uniqueScans: number;
    scansByDate: { date: string; count: number }[];
    qrCodeId?: string;
}

export default function ProfileAnalyticsDetail({ profileId, profileName, onBack }: ProfileAnalyticsDetailProps) {
    const [data, setData] = useState<AnalyticsDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/analytics/profile/${profileId}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to fetch analytics');
            }
            const jsonData = await res.json();
            setData(jsonData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profileId) {
            fetchData();
        }
    }, [profileId]);

    // Format date for chart
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Back to Overview"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">{profileName}</h2>
                        <p className="text-sm text-muted-foreground">Detailed Analytics</p>
                    </div>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="p-6 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl">
                    Error: {error}
                </div>
            ) : !data ? (
                <div className="p-12 text-center text-muted-foreground">No data available</div>
            ) : (
                <div className="space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                    <BarChart2 className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Total Scans</span>
                            </div>
                            <div className="text-2xl font-bold">{data.totalScans}</div>
                        </div>

                        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Unique Scans</span>
                            </div>
                            <div className="text-2xl font-bold">{data.uniqueScans}</div>
                        </div>

                        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Last 30 Days</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {data.scansByDate.reduce((acc, curr) => acc + curr.count, 0)}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Chart */}
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                        <h3 className="text-base font-semibold mb-6">Scan Timeline</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.scansByDate}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 12, fill: '#888' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                        }}
                                        formatter={(value) => [value, 'Scans']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#2563eb"
                                        fillOpacity={1}
                                        fill="url(#colorScans)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
