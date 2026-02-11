'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, QrCode, User, TrendingUp } from 'lucide-react';

interface StatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string;
    delay?: number;
}

function StatBadge({ icon: Icon, label, value, delay = 0 }: StatBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.3 }}
            className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
        >
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-600" strokeWidth={2} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
            </div>
        </motion.div>
    );
}

export default function SoftStatsBar() {
    const stats = [
        { icon: Eye, label: 'Views', value: '24.5k' },
        { icon: QrCode, label: 'Scans', value: '8.2k' },
        { icon: User, label: 'Profiles', value: '7' },
        { icon: TrendingUp, label: 'QR Codes', value: '12' }
    ];

    return (
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {stats.map((stat, index) => (
                <StatBadge
                    key={stat.label}
                    {...stat}
                    delay={0.6 + index * 0.1}
                />
            ))}
        </div>
    );
}
