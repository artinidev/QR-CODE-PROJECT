'use client';

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import Sparkline from './Sparkline';

interface KpiCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    iconBgColor?: string;
    trendData?: number[]; // For sparkline
}

export default function KpiCard({
    title,
    value,
    change,
    icon,
    iconBgColor = 'bg-blue-100',
    trendData
}: KpiCardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
                </div>
                {icon && (
                    <div className={`${iconBgColor} p-3 rounded-xl`}>
                        {icon}
                    </div>
                )}
                {/* Fallback if sparkline is used instead of large icon on right */}
                {!icon && trendData && (
                    <Sparkline data={trendData} isPositive={isPositive} />
                )}
            </div>

            <div className="flex items-center gap-2 mt-auto">
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPositive ? (
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                        ) : (
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                        )}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
                <span className="text-sm text-slate-400 dark:text-zinc-500">vs last period</span>
            </div>
        </div>
    );
}
