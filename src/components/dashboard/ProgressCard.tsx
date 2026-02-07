'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface MetricData {
    value: number;
    timeline: number[];
}

interface DashboardStats {
    metrics: {
        gadgets: {
            activeQrCodes: MetricData;
            linksUpdated: MetricData;
            successfulRedirects: MetricData;
        };
    };
}

export default function ProgressCard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/analytics/dashboard-stats?range=month');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getMetrics = () => {
        if (!stats) return [
            { label: 'Active QR Codes', value: '-', color: 'bg-gray-300', data: [] },
            { label: 'Links Updated', value: '-', color: 'bg-orange-400', data: [] },
            { label: 'Successful Redirects', value: '-', color: 'bg-gray-900', data: [] }
        ];

        const { activeQrCodes, linksUpdated, successfulRedirects } = stats.metrics.gadgets;

        return [
            {
                label: 'Active QR Codes',
                value: activeQrCodes.value,
                color: 'bg-gray-300',
                data: activeQrCodes.timeline
            },
            {
                label: 'Links Updated',
                value: linksUpdated.value,
                color: 'bg-orange-400',
                data: linksUpdated.timeline
            },
            {
                label: 'Successful Redirects',
                value: successfulRedirects.value,
                color: 'bg-gray-900',
                data: successfulRedirects.timeline
            }
        ];
    };

    const metrics = getMetrics();

    // Helper to normalize bar height
    const getBarHeight = (value: number, data: number[]) => {
        const max = Math.max(...data, 1);
        const percentage = (value / max) * 100;
        return Math.max(percentage, 10); // Min height 10%
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-gray-100 dark:border-white/10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    QR Analytics
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center"
                    >
                        {/* Value */}
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {loading ? (
                                <div className="h-9 w-12 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse mx-auto" />
                            ) : (
                                metric.value
                            )}
                        </div>

                        {/* Bar Chart */}
                        <div className="h-24 flex items-end justify-center gap-0.5 mb-3">
                            {loading ? (
                                Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1 rounded-full bg-gray-100 dark:bg-zinc-700`}
                                        style={{ height: '20%' }}
                                    />
                                ))
                            ) : (
                                // Use actual data if available, else placeholders (or previously 12 bars)
                                // API returns timeline data (e.g. 30 days or 12 months). 
                                // UI design shows ~12 bars. Let's slice or sample if data is too long, or use as is if short?
                                // Let's just use the last 12 points to fit the design.
                                (metric.data && metric.data.length > 0 ? metric.data.slice(-12) : Array(12).fill(0)).map((val: number, i: number, arr: number[]) => (
                                    <div
                                        key={i}
                                        className={`w-1 rounded-full ${metric.color}`}
                                        style={{
                                            height: `${getBarHeight(val, arr)}%`,
                                            opacity: i === arr.length - 1 ? 1 : 0.3
                                        }}
                                    />
                                ))
                            )}
                        </div>

                        {/* Label */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {metric.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
