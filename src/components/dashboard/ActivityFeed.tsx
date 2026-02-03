'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Eye, QrCode, User, Palette, Users,
    Share2, TrendingUp, Clock, CheckCircle
} from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'view' | 'scan' | 'update' | 'contact' | 'theme' | 'share';
    title: string;
    description: string;
    timestamp: string;
}

interface ActivityFeedProps {
    maxItems?: number;
}

export default function ActivityFeed({ maxItems = 5 }: ActivityFeedProps) {
    // Mock activity data - will be replaced with real API data
    const activities: ActivityItem[] = [
        {
            id: '1',
            type: 'update',
            title: "Updated Profile: Selena's Portfolio",
            description: 'Changed profile picture and bio',
            timestamp: '2 hours ago'
        },
        {
            id: '2',
            type: 'scan',
            title: 'Generated new QR for Summer Event',
            description: 'QR code created and downloaded',
            timestamp: '5 hours ago'
        },
        {
            id: '3',
            type: 'contact',
            title: 'New Contact added: John Smith',
            description: 'Contact saved from profile scan',
            timestamp: 'Yesterday, 4:30 PM'
        },
        {
            id: '4',
            type: 'theme',
            title: "Created new theme: 'Modern Dark'",
            description: 'Custom color palette applied',
            timestamp: 'Yesterday, 2:15 PM'
        },
        {
            id: '5',
            type: 'share',
            title: "Shared Profile: Selena's Portfolio",
            description: 'Shared via LinkedIn',
            timestamp: '2 days ago'
        }
    ];

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'view': return { icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' };
            case 'scan': return { icon: QrCode, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' };
            case 'update': return { icon: User, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' };
            case 'contact': return { icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' };
            case 'theme': return { icon: Palette, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/20' };
            case 'share': return { icon: Share2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
            default: return { icon: CheckCircle, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20' };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/5 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Activity Feed
                </h3>
                <a
                    href="/dashboard/activity"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                    View All
                </a>
            </div>

            <div className="space-y-4">
                {activities.slice(0, maxItems).map((activity, index) => {
                    const { icon: Icon, color, bg } = getActivityIcon(activity.type);

                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                        >
                            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {activity.description}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {activity.timestamp}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {activities.length === 0 && (
                <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No recent activity
                    </p>
                </div>
            )}
        </motion.div>
    );
}
