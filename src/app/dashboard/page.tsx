'use client';

import React from 'react';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import RecentProjectsCard from '@/components/dashboard/RecentProjectsCard';
import ConnectionsCard from '@/components/dashboard/ConnectionsCard';
import PremiumCard from '@/components/dashboard/PremiumCard';
import ProgressCard from '@/components/dashboard/ProgressCard';

export default function DashboardOverview() {
    return (
        <div className="min-h-screen p-6 dark:bg-slate-950">
            <div className="max-w-[1400px] mx-auto">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Analytics (2/3 width) */}
                    <div className="lg:col-span-2">
                        <AnalyticsCard />
                    </div>

                    {/* Right Column - Recent Projects (1/3 width) */}
                    <div className="lg:col-span-1">
                        <RecentProjectsCard />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Connections */}
                    <ConnectionsCard />

                    {/* Premium */}
                    <PremiumCard />

                    {/* Progress */}
                    <ProgressCard />
                </div>
            </div>
        </div>
    );
}
