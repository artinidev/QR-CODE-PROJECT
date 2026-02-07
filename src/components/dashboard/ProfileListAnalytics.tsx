'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Eye, ArrowLeft, ChevronDown, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import ProfileAnalyticsDetail from './ProfileAnalyticsDetail';
import { Profile } from '@/types/models';

import { useRouter, useSearchParams } from 'next/navigation';

interface AnalyticsData {
    topProfiles: {
        _id: string;
        totalScans: number;
        profileName: string;
        profileRole: string;
        profilePhoto?: string;
        profileId: string;
    }[];
    stats: {
        totalScans: number;
        activeCount: number;
    };
    scansByDate?: { date: string; count: number }[];
}

interface ProfileListAnalyticsProps {
    profiles: Profile[];
}

export default function ProfileListAnalytics({ profiles }: ProfileListAnalyticsProps) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const pid = searchParams.get('profileId');
        if (pid) {
            setSelectedProfileId(pid);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics/top-profiles');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedProfile = profiles.find(p => String(p._id) === selectedProfileId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) return <div className="p-8 text-center text-muted-foreground">Failed to load data.</div>;

    const { topProfiles, stats } = data;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Filter Control */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold">Analytics Overview</h2>
                    <p className="text-xs text-muted-foreground">Track performance across your profiles</p>
                </div>

                <div className="relative min-w-[240px]">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <select
                        value={selectedProfileId || ''}
                        onChange={(e) => setSelectedProfileId(e.target.value || null)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                        <option value="">All Profiles (Aggregate)</option>
                        {profiles.map(profile => (
                            <option key={String(profile._id)} value={String(profile._id)}>
                                {profile.fullName}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {selectedProfileId && selectedProfile ? (
                <ProfileAnalyticsDetail
                    profileId={selectedProfileId}
                    profileName={selectedProfile.fullName}
                    onBack={() => setSelectedProfileId(null)}
                />
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Total Scans</span>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold">{stats.totalScans}</div>
                            <div className="text-xs text-muted-foreground mt-1">Accept aggregate lifetime scans</div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Active Profiles</span>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold">{stats.activeCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">Profiles with at least 1 scan</div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Top Performer</span>
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="text-xl font-bold truncate">
                                {topProfiles[0]?.profileName || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {topProfiles[0] ? `${topProfiles[0].totalScans} scans` : 'No activity yet'}
                            </div>
                        </div>
                    </div>

                    {/* Aggregate Timeline Chart (Added) */}
                    {data.scansByDate && (
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Platform Growth</h3>
                                    <p className="text-xs text-muted-foreground">Scan activity over the last 30 days</p>
                                </div>
                            </div>

                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.scansByDate}>
                                        <defs>
                                            <linearGradient id="colorScansAgg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(dateStr) => {
                                                const d = new Date(dateStr);
                                                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                            }}
                                            tick={{ fontSize: 10, fill: '#888' }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={4}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fontSize: 10, fill: '#888' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [value, 'Scans']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                            cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#2563eb"
                                            fillOpacity={1}
                                            fill="url(#colorScansAgg)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Top Profiles List */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-white/5">
                                <h3 className="font-bold text-lg">Top Performing Profiles</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-xs uppercase text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-6 py-3">Rank</th>
                                            <th className="px-6 py-3">Profile</th>
                                            <th className="px-6 py-3 text-right">Scans</th>
                                            <th className="px-6 py-3 text-right">Share</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {topProfiles.map((profile, index) => (
                                            <tr key={profile._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-muted-foreground">
                                                    #{index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden text-xs font-bold shrink-0">
                                                            {profile.profilePhoto ? (
                                                                <img src={profile.profilePhoto} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                profile.profileName?.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-foreground">{profile.profileName}</div>
                                                            <div className="text-xs text-muted-foreground">{profile.profileRole}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-medium">
                                                    {profile.totalScans}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 min-w-[60px] inline-block align-middle overflow-hidden">
                                                        <div
                                                            className="bg-primary h-full rounded-full"
                                                            style={{ width: `${(profile.totalScans / stats.totalScans) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        {Math.round((profile.totalScans / stats.totalScans) * 100)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProfileId(profile.profileId);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {topProfiles.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                    No scan data available yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Vertical Chart */}
                        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col">
                            <h3 className="font-bold text-lg mb-6">Scan Distribution</h3>
                            <div className="flex-1 min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topProfiles.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="profileName"
                                            type="category"
                                            width={100}
                                            tick={{ fontSize: 10, fill: '#888' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="totalScans" radius={[0, 4, 4, 0]} barSize={20}>
                                            {topProfiles.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
