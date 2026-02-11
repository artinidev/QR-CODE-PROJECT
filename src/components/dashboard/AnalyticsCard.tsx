'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsCard() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [growth, setGrowth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<'week' | 'month' | 'year'>('week');
    const [showRangeMenu, setShowRangeMenu] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/top-profiles?range=${range}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.scansByDate) {
                        processChartData(data.scansByDate, range);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range]);

    const processChartData = (scansByDate: any[], currentRange: string) => {
        let processedData: any[] = [];
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

        let total = 0;

        if (currentRange === 'week') {
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = days[d.getDay()];

                const match = scansByDate.find((s: any) => s.date === dateStr);
                const count = match ? match.count : 0;
                total += count;

                processedData.push({
                    date: dateStr,
                    day: dayName,
                    value: count,
                    amount: count,
                    active: i === 0
                });
            }
        } else if (currentRange === 'month') {
            processedData = scansByDate.map((d: any) => ({
                date: d.date,
                day: d.date.slice(8), // Just day number
                value: d.count,
                amount: d.count,
                active: false
            }));
            if (processedData.length > 0) processedData[processedData.length - 1].active = true;
            total = processedData.reduce((acc, curr) => acc + curr.value, 0);

        } else if (currentRange === 'year') {
            processedData = scansByDate.map((d: any) => {
                const date = new Date(d.date + '-02');
                return {
                    date: d.date,
                    day: monthNames[date.getMonth()],
                    value: d.count,
                    amount: d.count,
                    active: false
                };
            });
            if (processedData.length > 0) processedData[processedData.length - 1].active = true;
            total = processedData.reduce((acc, curr) => acc + curr.value, 0);
        }

        const maxVal = Math.max(...processedData.map(d => d.value), 1);
        const finalData = processedData.map(d => ({
            ...d,
            height: (d.value / maxVal) * 100
        }));

        setChartData(finalData);
        setGrowth(total > 0 ? 100 : 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-white/5 h-full flex flex-col relative z-20"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-8 z-20 relative">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-white/5">
                            <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Platform Analytics
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {range === 'week' ? 'Last 7 days' : range === 'month' ? 'Last 30 days' : 'Last 1 year'}
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowRangeMenu(!showRangeMenu)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group bg-white dark:bg-zinc-900"
                    >
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize min-w-[3rem] w-auto text-left">
                            {range}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showRangeMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showRangeMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden z-50 p-1"
                            >
                                {['week', 'month', 'year'].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            setRange(r as any);
                                            setShowRangeMenu(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${range === r
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Chart */}
            <div className={`relative mb-6 flex-1 min-h-[180px] overflow-x-auto overflow-y-hidden custom-scrollbar ${range === 'month' ? 'pr-4' : ''}`}>
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                        Loading data...
                    </div>
                ) : (
                    <div className="flex items-end justify-between gap-1 h-full" style={{ minWidth: range === 'month' ? '600px' : 'auto' }}>
                        {chartData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar">
                                {/* Bar Container */}
                                <div className="w-full flex flex-col justify-end items-center relative h-full px-[1px]">
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded-md whitespace-nowrap font-bold shadow-xl z-30 pointer-events-none mb-1">
                                        {item.amount}
                                    </div>

                                    {/* Actual Bar */}
                                    <div
                                        className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out ${item.active
                                            ? 'bg-gray-900 dark:bg-white'
                                            : 'bg-gray-200 dark:bg-zinc-800 group-hover/bar:bg-primary/50'
                                            }`}
                                        style={{ height: `${Math.max(item.height, 4)}%` }} // Min height for viz
                                    />
                                </div>

                                {/* Day Label */}
                                {(range !== 'month' || index % 2 === 0) && (
                                    <div className={`text-[10px] font-bold transition-colors ${item.active
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-400 dark:text-zinc-500'
                                        }`}>
                                        {item.day}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50 dark:border-white/5">
                <div className="text-4xl font-bold text-gray-900 dark:text-white table-nums">
                    {loading ? '-' : `+${growth}%`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
                    Engagement for this {range}<br />
                    <span className="text-green-600 font-medium">trending up</span>
                </div>
            </div>
        </motion.div>
    );
}
