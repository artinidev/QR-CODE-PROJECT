'use client';

import React from 'react';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import RecentProjectsCard from '@/components/dashboard/RecentProjectsCard';
import ConnectionsCard from '@/components/dashboard/ConnectionsCard';
import PremiumCard from '@/components/dashboard/PremiumCard';
import ProgressCard from '@/components/dashboard/ProgressCard';

import { motion } from 'framer-motion';

export default function DashboardOverview() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08 // Fast cascade
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 18 } // Snappy
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="min-h-screen p-6 dark:bg-slate-950"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Main Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Analytics (2/3 width) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
                        <AnalyticsCard />
                    </motion.div>

                    {/* Right Column - Recent Projects (1/3 width) */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
                        <RecentProjectsCard />
                    </motion.div>
                </motion.div>

                {/* Bottom Row */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Connections */}
                    <motion.div variants={itemVariants} className="h-full">
                        <ConnectionsCard />
                    </motion.div>

                    {/* Premium */}
                    <motion.div variants={itemVariants} className="h-full">
                        <PremiumCard />
                    </motion.div>

                    {/* Progress */}
                    <motion.div variants={itemVariants} className="h-full">
                        <ProgressCard />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
