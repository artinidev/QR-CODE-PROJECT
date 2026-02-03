'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Connection {
    id: string;
    name: string;
    role: string;
    avatar: string;
    badge?: string;
    badgeColor?: string;
}

export default function ConnectionsCard() {
    const connections: Connection[] = [
        {
            id: '1',
            name: 'Randy Gouse',
            role: 'Cybersecurity specialist',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Randy',
            badge: 'HIRING',
            badgeColor: 'bg-orange-500'
        },
        {
            id: '2',
            name: 'Giana Schleifer',
            role: 'UX/UI Designer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giana',
            badge: 'HIRING',
            badgeColor: 'bg-blue-500'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-gray-100 dark:border-white/10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Let's Connect
                </h3>
                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    See all
                </button>
            </div>

            {/* Connections List */}
            <div className="space-y-3">
                {connections.map((connection, index) => (
                    <motion.div
                        key={connection.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer group"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                                src={connection.avatar}
                                alt={connection.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {connection.name}
                                </h4>
                                {connection.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${connection.badgeColor}`}>
                                        {connection.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{connection.role}</p>
                        </div>

                        {/* Add Button */}
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 group-hover:bg-gray-900 dark:group-hover:bg-white flex items-center justify-center transition-colors flex-shrink-0">
                            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
