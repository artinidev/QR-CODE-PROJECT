'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, QrCode, Palette, BarChart3, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
    userName?: string;
    userAvatar?: string;
}

export default function WelcomeBanner({ userName = 'Selena', userAvatar }: WelcomeBannerProps) {
    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quickActions = [
        {
            label: 'Create Profile',
            icon: User,
            href: '/dashboard/profiles/new',
            gradient: 'from-purple-500 to-purple-600',
            hoverGradient: 'hover:from-purple-600 hover:to-purple-700'
        },
        {
            label: 'Generate QR',
            icon: QrCode,
            href: '/dashboard/qr',
            gradient: 'from-blue-500 to-blue-600',
            hoverGradient: 'hover:from-blue-600 hover:to-blue-700'
        },
        {
            label: 'Design Theme',
            icon: Palette,
            href: '/dashboard/themes',
            gradient: 'from-pink-500 to-pink-600',
            hoverGradient: 'hover:from-pink-600 hover:to-pink-700'
        },
        {
            label: 'View Analytics',
            icon: BarChart3,
            href: '/dashboard/analytics',
            gradient: 'from-orange-500 to-orange-600',
            hoverGradient: 'hover:from-orange-600 hover:to-orange-700'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-white/5 mb-8"
        >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Greeting Section */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Selena"
                                alt={userName}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {getGreeting()}, {userName}! 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here's what's happening with your digital presence today
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    {quickActions.map((action, index) => (
                        <motion.a
                            key={action.label}
                            href={action.href}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold
                                bg-gradient-to-r ${action.gradient} ${action.hoverGradient}
                                shadow-lg shadow-${action.gradient.split('-')[1]}-500/25
                                transition-all duration-200 group
                            `}
                        >
                            <action.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{action.label}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
