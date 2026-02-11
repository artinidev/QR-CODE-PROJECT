import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageTransition from '@/components/dashboard/PageTransition';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F8F9FE] dark:bg-zinc-950 text-foreground font-sans transition-colors duration-300">
            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 overflow-y-auto">
                <DashboardHeader />
                <PageTransition>{children}</PageTransition>
            </div>
        </div>
    );
}
