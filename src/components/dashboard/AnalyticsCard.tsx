'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsCard() {
    const weekData = [
        { day: 'S', value: 40, amount: '$2,340' },
        { day: 'M', value: 60, amount: '$3,120' },
        { day: 'T', value: 85, amount: '$4,560', active: true },
        { day: 'W', value: 50, amount: '$2,890' },
        { day: 'T', value: 70, amount: '$3,670' },
        { day: 'F', value: 55, amount: '$2,980' },
        { day: 'S', value: 65, amount: '$3,450' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-gray-100 dark:border-white/10"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Platform Analytics
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track engagement over time and across each platform feature
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Week</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Chart */}
            <div className="relative mb-6">
                <div className="flex items-end justify-between gap-4 h-48">
                    {weekData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3">
                            {/* Bar */}
                            <div className="w-full flex flex-col justify-end items-center flex-1 relative group">
                                {/* Tooltip */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                                    {item.amount}
                                </div>
                                {/* Dot */}
                                <div
                                    className={`w-2 h-2 rounded-full mb-1 ${item.active ? 'bg-gray-900 dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'
                                        }`}
                                />
                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-lg transition-all ${item.active
                                        ? 'bg-gray-900 dark:bg-white'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                    style={{ height: `${item.value}%` }}
                                />
                            </div>
                            {/* Day Label */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${item.active
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                {item.day}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">+20%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    This week's engagement is<br />higher than last week's
                </div>
            </div>
        </motion.div>
    );
}
