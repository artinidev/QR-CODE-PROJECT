'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function ProgressCard() {
    const metrics = [
        { label: 'Active QR Codes', value: 64, color: 'bg-gray-300' },
        { label: 'Links Updated', value: 12, color: 'bg-orange-400' },
        { label: 'Successful Redirects', value: 10, color: 'bg-gray-900' }
    ];

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
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">April 11, 2024</span>
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
                            {metric.value}
                        </div>

                        {/* Bar Chart */}
                        <div className="h-24 flex items-end justify-center gap-0.5 mb-3">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full ${metric.color}`}
                                    style={{
                                        height: `${Math.random() * 60 + 40}%`,
                                        opacity: i === 11 ? 1 : 0.3
                                    }}
                                />
                            ))}
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
