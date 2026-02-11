'use client';

import React from 'react';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview'; // Adjust path if needed

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <AnalyticsOverview />
            </div>
        </div>
    );
}
