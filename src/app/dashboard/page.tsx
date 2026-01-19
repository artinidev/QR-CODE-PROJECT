import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    MousePointerClick,
    TrendingUp,
    QrCode,
    Eye,
    Plus,
    Share2,
    Activity,
    User,
    Calendar,
    Download,
    Filter,
    ChevronDown,
    FileText
} from 'lucide-react';

export const metadata = {
    title: 'Dashboard - PDI Platform',
};

// Reusable Card Component from New Design
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-white/5 p-6 ${className}`}>
        {children}
    </div>
);

// Mock Data for PDI Context
const recentActivity = [
    { type: 'scan', profile: 'Personal Brand', location: 'New York, USA', time: '2 mins ago', device: 'iPhone 14' },
    { type: 'view', profile: 'Business Card', location: 'London, UK', time: '15 mins ago', device: 'Desktop' },
    { type: 'click', profile: 'Portfolio 2024', link: 'Behance', time: '1 hour ago', device: 'Android' },
    { type: 'scan', profile: 'Event Pass', location: 'Berlin, DE', time: '3 hours ago', device: 'iPhone 13' },
];

const profiles = [
    { name: 'Main Business Card', views: 1240, scans: 856, status: 'Active', trend: '+12%' },
    { name: 'Creative Portfolio', views: 856, scans: 432, status: 'Active', trend: '+5%' },
    { name: 'Conference ID', views: 120, scans: 115, status: 'Inactive', trend: '-2%' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            {/* --- Greeting & Actions Row (New Design Style) --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">Overview</h1>
                    <p className="text-blue-500 font-medium mt-1">Welcome back! Here's how your digital identities are performing.</p>
                </div>

                <div className="flex gap-3">
                    <Link href="/dashboard/profiles">
                        <button className="bg-[#3B82F6] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5" />
                            New Profile
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- Filters Row (New Design Style) --- */}
            <div className="flex flex-wrap items-center gap-4 py-2">
                <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                    <Calendar className="w-4 h-4" /> Monthly <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
                <div className="flex-1"></div>
                <button className="flex items-center gap-2 bg-transparent px-4 py-2.5 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                    <Download className="w-4 h-4" /> Export Data
                </button>
            </div>

            {/* --- Main Stats Grid (New Design Cards) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Stat 1 */}
                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" /> +12.5%
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-1">Total Views</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">24.5k</h3>
                    </div>
                </Card>

                {/* Stat 2 */}
                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-2xl">
                            <QrCode className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" /> +8.1%
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-1">QR Scans</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">8,234</h3>
                    </div>
                </Card>

                {/* Stat 3 */}
                <Card className="relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-2xl">
                            <MousePointerClick className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3 rotate-180" /> -2.4%
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-1">Link Clicks</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1,240</h3>
                    </div>
                </Card>

                {/* Stat 4 - Top Performing (Blue Card Style) */}
                <div className="bg-[#3B82F6] rounded-[1.5rem] p-6 text-white flex flex-col justify-between shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                    {/* Blob Background */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

                    <div>
                        <p className="text-blue-100 font-medium mb-1 text-sm">Top Performing</p>
                        <h3 className="text-2xl font-bold">Personal Brand</h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 relative z-10">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#3B82F6] bg-white/20 backdrop-blur-sm" />
                            ))}
                        </div>
                        <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Content Grid (New Design Cards) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active Profiles List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Profiles</h3>
                            <Link href="/dashboard/profiles" className="text-sm font-bold text-blue-500 hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {profiles.map((profile, i) => (
                                <div key={i} className="group p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-2xl border border-gray-100/50 dark:border-white/5 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {profile.views}</span>
                                                <span className="flex items-center gap-1"><QrCode className="w-3 h-3" /> {profile.scans}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${profile.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            {profile.status}
                                        </div>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className={`text-sm font-bold ${profile.trend.includes('+') ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>{profile.trend}</span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">vs last month</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Recent Activity Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Activity</h3>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>

                    <Card>
                        <div className="space-y-6">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== recentActivity.length - 1 && (
                                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-gray-100 dark:bg-zinc-800" />
                                    )}
                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-zinc-900 shadow-sm">
                                        {activity.type === 'scan' ? <QrCode className="w-4 h-4 text-blue-500 dark:text-blue-400" /> :
                                            activity.type === 'view' ? <Eye className="w-4 h-4 text-purple-500 dark:text-purple-400" /> :
                                                <MousePointerClick className="w-4 h-4 text-orange-500 dark:text-orange-400" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 dark:text-gray-300">
                                            <span className="font-bold text-gray-900 dark:text-white">{activity.profile}</span> was {activity.type === 'scan' ? 'scanned' : 'viewed'}.
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {activity.location} • {activity.device}
                                        </p>
                                        <span className="text-[10px] bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 mt-2 inline-block font-medium">
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Pro Plan Card */}
                    <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-[1.5rem] p-6 text-white text-center space-y-4 shadow-xl shadow-purple-500/20">
                        <h4 className="font-bold text-lg">Pro Analytics</h4>
                        <p className="text-sm opacity-90">Unlock detailed visitor demographics and heatmaps.</p>
                        <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm">
                            View Plans
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
