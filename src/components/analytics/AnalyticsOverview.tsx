'use client';

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    EyeIcon,
    QrCodeIcon,
    ChartBarIcon,
    CursorArrowRaysIcon,
    ArrowPathIcon,
    GlobeAmericasIcon
} from '@heroicons/react/24/solid';

import KpiCard from './KpiCard';
import MapCard from './MapCard'; // New Map Component
import TopPerformerCard from './TopPerformerCard';

export default function AnalyticsOverview() {
    const [range, setRange] = useState<'week' | 'month' | 'year'>('month');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(range);
    }, [range]);

    const fetchData = async (selectedRange: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/dashboard-stats?range=${selectedRange}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-96">
                <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const { metrics, topPerformers, deviceStats, osStats, locationStats } = data || {};

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 18 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header & Controls */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Overview</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Track your QR code performance and engagement</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center">
                    {['week', 'month', 'year'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${range === r
                                ? 'bg-slate-900 dark:bg-zinc-950 text-white shadow-md'
                                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* KPI Cards */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants}>
                    <KpiCard
                        title="Total Scans"
                        value={metrics?.totalScans?.value || 0}
                        change={metrics?.totalScans?.change}
                        icon={<EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <KpiCard
                        title="QR Codes"
                        value={metrics?.totalQrCodes?.value || 0}
                        change={metrics?.totalQrCodes?.change}
                        icon={<QrCodeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <KpiCard
                        title="Avg Scans/QR"
                        value={metrics?.avgScansPerQr?.value || 0}
                        change={metrics?.avgScansPerQr?.change}
                        icon={<ChartBarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <KpiCard
                        title="Active QR Codes"
                        value={metrics?.activeQrCodes?.value || 0}
                        change={metrics?.activeQrCodes?.change}
                        icon={<CursorArrowRaysIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                        iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
                    />
                </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Interactive Map (Replaces Line Chart) */}
                <motion.div variants={itemVariants} className="lg:col-span-2 min-h-[500px]">
                    <MapCard title="Global Scan Distribution" />
                </motion.div>

                {/* Right Column Stats */}
                <motion.div variants={itemVariants} className="space-y-8">
                    <TopPerformerCard performers={topPerformers || []} />

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Device & OS */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Device & OS</h3>
                            <div className="space-y-6">
                                {/* Device Type */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Device Type</h4>
                                    <div className="space-y-3">
                                        {(deviceStats && deviceStats.length > 0) ? deviceStats.map((d: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${d.label === 'Mobile' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                                    {d.label || 'Unknown'}
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{d.value}</span>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-slate-400 text-center py-2">No device data</p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-zinc-800" />

                                {/* OS */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Operating System</h4>
                                    <div className="space-y-3">
                                        {(osStats && osStats.length > 0) ? osStats.map((d: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    {d.label || 'Unknown'}
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{d.value}</span>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-slate-400 text-center py-2">No OS data</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Locations */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Locations</h3>
                            <div className="space-y-4">
                                {(locationStats && locationStats.length > 0) ? locationStats.map((l: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-zinc-400">
                                                #{i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{l.city}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-500">{l.country}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                            {l.count}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                        <GlobeAmericasIcon className="w-12 h-12 mb-2 opacity-20" />
                                        <p className="text-sm">No location data yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
