import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConnectionsCard() {
    const [topProfiles, setTopProfiles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const fetchTopProfiles = async () => {
            try {
                const res = await fetch('/api/analytics/top-profiles');
                if (res.ok) {
                    const data = await res.json();
                    setTopProfiles(data.topProfiles || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProfiles();
    }, []);

    const displayedProfiles = topProfiles.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm h-full flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Top Profiles
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-xs text-muted-foreground">Most scanned this month</p>
                </div>
                <Link
                    href="/dashboard/profiles?tab=analytics"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* List */}
            <div className="space-y-4 flex-1">
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground text-xs animate-pulse">Loading stats...</div>
                ) : displayedProfiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">No activity yet</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[150px]">
                            Share your profiles to start tracking scans.
                        </p>
                    </div>
                ) : (
                    displayedProfiles.map((item, index) => (
                        <Link
                            href={`/dashboard/profiles?tab=analytics&profileId=${item.profileId}`}
                            key={item._id}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-gray-100 dark:hover:border-white/5 transition-all cursor-pointer group mb-3 last:mb-0"
                            >
                                {/* Rank */}
                                <div className="text-xs font-bold text-muted-foreground w-4 text-center">
                                    {index + 1}
                                </div>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 dark:border-white/10 relative">
                                    {item.profilePhoto ? (
                                        <img src={item.profilePhoto} alt={item.profileName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                                            {item.profileName?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate pr-2">
                                            {item.profileName}
                                        </h4>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            {item.totalScans}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground truncate">{item.profileRole || 'No Title'}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                )}
            </div>
        </motion.div>
    );
}
