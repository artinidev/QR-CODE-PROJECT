'use client';

import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface TopPerformerCardProps {
    performers: {
        name: string;
        scans: number;
        rank: number;
        id?: string;
    }[];
}

export default function TopPerformerCard({ performers }: TopPerformerCardProps) {
    const maxScans = Math.max(...performers.map(p => p.scans), 1);

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/10 h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-sans">Top Performers</h3>

            <div className="space-y-6">
                {performers.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-zinc-500">No data available</div>
                ) : (
                    performers.map((performer, index) => (
                        <div key={index} className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm
                                    ${index === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                        index === 1 ? 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300' :
                                            index === 2 ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                                'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}
                                `}>
                                    {index === 0 ? <TrophyIcon className="w-4 h-4" /> : `#${performer.rank}`}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{performer.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{performer.scans} scans</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 w-full bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-blue-500' : 'bg-blue-400/70'
                                        }`}
                                    style={{ width: `${(performer.scans / maxScans) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
