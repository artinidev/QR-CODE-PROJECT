'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, Globe, Smartphone, Clock, ChevronsUpDown, Check, Search } from 'lucide-react';

const data = [
    { name: 'Mon', scans: 400 },
    { name: 'Tue', scans: 300 },
    { name: 'Wed', scans: 600 },
    { name: 'Thu', scans: 800 },
    { name: 'Fri', scans: 500 },
    { name: 'Sat', scans: 900 },
    { name: 'Sun', scans: 700 },
];

export default function AnalyticsPage() {
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [profiles, setProfiles] = React.useState<any[]>([]);
    const [selectedProfileId, setSelectedProfileId] = React.useState<string>('');

    // Combobox state
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredProfiles = profiles.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fetch user profiles for the dropdown
    React.useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch('/api/profiles?status=active');
                if (res.ok) {
                    const data = await res.json();
                    setProfiles(data);
                    if (data.length > 0) {
                        setSelectedProfileId(data[0]._id);
                    }
                }
            } catch (err) {
                console.error("Error fetching profiles", err);
            }
        };
        fetchProfiles();
    }, []);

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            if (!selectedProfileId && profiles.length > 0) return; // Wait for selection if profiles exist

            setLoading(true);
            try {
                const url = selectedProfileId
                    ? `/api/analytics?profileId=${selectedProfileId}`
                    : '/api/analytics';

                const res = await fetch(url);
                if (res.ok) {
                    const json = await res.json();
                    setStats(json);
                } else {
                    // Fallback to mock data for demo/dev if auth fails
                    console.log('Using mock data due to API error (likely unauthorized in dev)');
                    setStats({
                        totalScans: 12450,
                        uniqueDevices: 8320,
                        recentScans: [
                            { scannedAt: new Date().toISOString(), location: { lat: 36.75, lng: 3.05 }, ipAddress: '105.101.x.x', deviceType: 'mobile' },
                            { scannedAt: new Date(Date.now() - 60000).toISOString(), location: { lat: 35.69, lng: -0.63 }, ipAddress: '129.45.x.x', deviceType: 'desktop' },
                            { scannedAt: new Date(Date.now() - 120000).toISOString(), location: { lat: 36.36, lng: 6.61 }, ipAddress: '41.101.x.x', deviceType: 'mobile' },
                        ]
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 5000); // Live update
        return () => clearInterval(interval);
    }, [selectedProfileId]);

    const recentScans = stats?.recentScans || [];

    // Mock breakdown data for visualization (in real app, this comes from API aggregation)
    const deviceData = [
        { name: 'Mobile', value: 65, color: '#3b82f6' },
        { name: 'Desktop', value: 25, color: '#8b5cf6' },
        { name: 'Tablet', value: 10, color: '#f59e0b' },
    ];

    const osData = [
        { name: 'iOS', value: 45 },
        { name: 'Android', value: 35 },
        { name: 'Windows', value: 15 },
        { name: 'MacOS', value: 5 },
    ];

    const cityData = [
        { name: 'Algiers', count: 420 },
        { name: 'Oran', count: 210 },
        { name: 'Constantine', count: 150 },
        { name: 'Setif', count: 80 },
        { name: 'Annaba', count: 65 },
    ];

    return (
        <div className="flex-1 overflow-auto p-4 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Real-time insights into your digital footprint.</p>
                </div>

                {/* Custom searchable combobox for 200+ profiles */}
                <div className="relative z-50 w-full md:w-[280px]">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 text-foreground text-xs font-medium rounded-xl px-4 py-2.5 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <span className="truncate">
                                {selectedProfileId
                                    ? profiles.find(p => p._id === selectedProfileId)?.fullName || 'Select Profile'
                                    : 'All Profiles'}
                            </span>
                            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                        </button>

                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setIsOpen(false)}
                                />
                                <div className="absolute top-full mt-2 w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                placeholder="Search profiles..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-[240px] overflow-y-auto p-1 custom-scrollbar">
                                        <button
                                            onClick={() => {
                                                setSelectedProfileId('');
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors text-left hover:bg-gray-100 dark:hover:bg-zinc-800 text-foreground font-medium mb-1"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-[10px]"><Globe className="w-3 h-3" /></span>
                                            All Profiles
                                        </button>
                                        {filteredProfiles.map((p) => (
                                            <button
                                                key={p._id}
                                                onClick={() => {
                                                    setSelectedProfileId(p._id);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors text-left ${selectedProfileId === p._id
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                                    : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-foreground'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${selectedProfileId === p._id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {p.fullName.charAt(0)}
                                                </div>
                                                <span className="truncate flex-1">{p.fullName}</span>
                                                {selectedProfileId === p._id && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Scans</p>
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold tracking-tight">{stats?.totalScans?.toLocaleString() || '...'}</h3>
                        <span className="text-xs font-bold text-green-500 flex items-center mb-1 bg-green-50 px-1.5 py-0.5 rounded">
                            <ArrowUp className="w-3 h-3 mr-0.5" /> 12%
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Unique Visitors</p>
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Smartphone className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold tracking-tight">{stats?.uniqueScans?.toLocaleString() || 8320}</h3>
                        <span className="text-xs font-bold text-green-500 flex items-center mb-1 bg-green-50 px-1.5 py-0.5 rounded">
                            <ArrowUp className="w-3 h-3 mr-0.5" /> 5%
                        </span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Avg. Time</p>
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold tracking-tight">1m 42s</h3>
                        <span className="text-xs font-bold text-gray-400 flex items-center mb-1 px-1.5 py-0.5 rounded">
                            - 2%
                        </span>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Top Location</p>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold tracking-tight truncate">Algiers, DZ</h3>
                        <span className="text-xs font-bold text-emerald-600 flex items-center mb-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                            45%
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Chart (Span 2) */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Scan Performance</h3>
                        <div className="flex gap-2">
                            {['7d', '30d', '90d'].map(d => (
                                <button key={d} className="px-3 py-1 text-[10px] font-bold bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 transition-colors uppercase">{d}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Feed (Span 1) */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col h-[350px]">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center justify-between">
                        <span>Live Activity</span>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {recentScans.length === 0 ? (
                            <div className="text-center text-muted-foreground text-xs py-10">No recent activity</div>
                        ) : (
                            recentScans.map((scan: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group border border-transparent hover:border-blue-100">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-gray-500">
                                        {scan.deviceType === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
                                                {scan.location?.lat ? `Algiers` : 'New Visit'}
                                            </h4>
                                            <span className="text-[10px] text-gray-400 font-medium">Just now</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                            {scan.deviceType === 'mobile' ? 'iPhone 14 Pro' : 'Chrome Desktop'} • Algeria
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Deep Dive Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Device Distribution */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6 text-sm">Device Breakdown</h3>
                    <div className="space-y-4">
                        {deviceData.map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        {item.name}
                                    </span>
                                    <span className="font-bold">{item.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OS Stats */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6 text-sm">Operating System</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {osData.map((os) => (
                            <div key={os.name} className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100/50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{os.name}</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{os.value}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geographic Top Cities */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6 text-sm">Top Cities</h3>
                    <div className="space-y-3">
                        {cityData.map((city, index) => (
                            <div key={city.name} className="flex items-center gap-3 text-xs">
                                <span className="w-5 text-gray-400 font-mono font-medium">0{index + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1 text-gray-600 font-medium">
                                        <span>{city.name}</span>
                                        <span>{city.count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-800 rounded-full"
                                            style={{ width: `${(city.count / 420) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
