'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface MarketingTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    trashCount?: number;
}

export default function MarketingTabs({ activeTab, onTabChange, trashCount = 0 }: MarketingTabsProps) {
    const tabs = [
        { id: 'create', label: 'Create New' },
        { id: 'manage', label: 'Manage QRs' },
        { id: 'analytics', label: 'Analytics' },
    ];

    return (
        <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl w-fit border border-gray-200 dark:border-white/5">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-md'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
            <button
                onClick={() => onTabChange('trash')}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'trash'
                        ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-md'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                <Trash2 className="w-4 h-4" />
                Trash
                {trashCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {trashCount}
                    </span>
                )}
            </button>
        </div>
    );
}
