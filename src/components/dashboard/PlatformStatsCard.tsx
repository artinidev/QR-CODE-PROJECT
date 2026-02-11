'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PlatformStatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: number; // percentage change
    iconBgColor: string;
    iconColor: string;
    delay?: number;
}

export default function PlatformStatsCard({
    title,
    value,
    icon: Icon,
    trend,
    iconBgColor,
    iconColor,
    delay = 0
}: PlatformStatsCardProps) {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${isPositive
                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
            </div>

            {/* Sparkline placeholder - can be enhanced later */}
            <div className="mt-4 h-8 flex items-end gap-1">
                {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                    <div
                        key={i}
                        className={`flex-1 ${iconBgColor} opacity-20 rounded-sm`}
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
