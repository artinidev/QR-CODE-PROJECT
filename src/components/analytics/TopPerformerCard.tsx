import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface TopPerformer {
    name: string;
    scans: number;
    rank: number;
}

interface TopPerformerCardProps {
    performers: TopPerformer[];
}

export default function TopPerformerCard({ performers }: TopPerformerCardProps) {
    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-100 text-yellow-700';
            case 2:
                return 'bg-gray-100 text-gray-700';
            case 3:
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-blue-50 text-blue-700';
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank <= 3) {
            return <TrophyIcon className="w-4 h-4" />;
        }
        return <span className="text-xs font-semibold">#{rank}</span>;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>

            <div className="space-y-3">
                {performers.map((performer) => (
                    <div
                        key={performer.rank}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRankColor(performer.rank)}`}>
                                {getRankIcon(performer.rank)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                                <p className="text-xs text-gray-500">{performer.scans.toLocaleString()} scans</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(100, (performer.scans / performers[0].scans) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
