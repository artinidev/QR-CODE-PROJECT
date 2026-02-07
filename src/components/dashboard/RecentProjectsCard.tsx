'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Megaphone } from 'lucide-react';
import Link from 'next/link';

interface Campaign {
    id: string;
    name: string;
    scans: string;
    badges: string[];
    location?: string;
    lastScan?: string;
}

export default function RecentProjectsCard() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/analytics/dashboard-stats?range=month');
                if (response.ok) {
                    const data = await response.json();
                    if (data.metrics?.gadgets?.marketingCampaigns) {
                        setCampaigns(data.metrics.gadgets.marketingCampaigns);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch marketing campaigns', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Helper to get consistent styling based on index
    const getStyle = (index: number) => {
        const styles = [
            { icon: <Megaphone className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
            { icon: <Megaphone className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
            { icon: <Megaphone className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
        ];
        return styles[index % styles.length];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-gray-100 dark:border-white/10 h-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Marketing Campaigns
                </h3>
                <Link href="/dashboard/marketing-qr" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    See all Campaigns
                </Link>
            </div>

            {/* Campaigns List */}
            <div className="space-y-3">
                {loading ? (
                    // Loading Skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-600 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                            </div>
                        </div>
                    ))
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No marketing campaigns found.
                    </div>
                ) : (
                    campaigns.map((campaign, index) => {
                        const style = getStyle(index);
                        return (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="group relative bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl p-4 transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
                                        {style.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {campaign.name}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{campaign.scans}</p>

                                        {/* Badges */}
                                        {campaign.badges.length > 0 && (
                                            <div className="flex gap-2 mb-2">
                                                {campaign.badges.map((badge, i) => (
                                                    <span
                                                        key={i}
                                                        className={`px-2 py-1 rounded-lg text-xs font-medium border ${badge === 'Active'
                                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                            : badge === 'Dynamic'
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                                                            }`}
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Meta */}
                                        {(campaign.location || campaign.lastScan) && (
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                {campaign.location && campaign.location !== 'No data' && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>Top Location: {campaign.location}</span>
                                                    </div>
                                                )}
                                                {campaign.lastScan && campaign.lastScan !== 'Never' && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>Last scan: {campaign.lastScan}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <button className="w-8 h-8 rounded-full bg-white dark:bg-zinc-600 border border-gray-200 dark:border-zinc-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
