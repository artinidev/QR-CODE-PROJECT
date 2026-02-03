'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface RecentItem {
    id: string;
    type: 'profile' | 'qr' | 'theme';
    title: string;
    subtitle?: string;
    image?: string;
    href: string;
}

interface RecentItemsCarouselProps {
    title?: string;
}

export default function RecentItemsCarousel({ title = 'Recent Items' }: RecentItemsCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock data - will be replaced with real API data
    const recentItems: RecentItem[] = [
        {
            id: '1',
            type: 'profile',
            title: "Selena's Portfolio",
            subtitle: '1,240 views',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selena',
            href: '/dashboard/profiles/1'
        },
        {
            id: '2',
            type: 'qr',
            title: 'Summer Event',
            subtitle: '856 scans',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDAwIi8+PC9zdmc+',
            href: '/dashboard/qr/2'
        },
        {
            id: '3',
            type: 'profile',
            title: 'Business Card',
            subtitle: '432 views',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Business',
            href: '/dashboard/profiles/3'
        },
        {
            id: '4',
            type: 'theme',
            title: 'Modern Dark',
            subtitle: 'Custom theme',
            image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            href: '/dashboard/themes/4'
        }
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/5"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {recentItems.map((item, index) => (
                    <motion.a
                        key={item.id}
                        href={item.href}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="flex-shrink-0 w-48 bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group border border-gray-100 dark:border-white/5"
                    >
                        <div className="relative mb-3">
                            {item.type === 'theme' ? (
                                <div
                                    className="w-full h-32 rounded-lg"
                                    style={{ background: item.image }}
                                />
                            ) : (
                                <div className="w-full h-32 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {item.title}
                        </h4>
                        {item.subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.subtitle}
                            </p>
                        )}
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
}
