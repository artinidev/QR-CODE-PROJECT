'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface SoftActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    accentColor: string;
    href: string;
    delay?: number;
}

export default function SoftActionCard({
    title,
    description,
    icon: Icon,
    accentColor,
    href,
    delay = 0
}: SoftActionCardProps) {
    return (
        <motion.a
            href={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group block"
        >
            <div className="relative bg-white rounded-2xl p-8 h-full min-h-[280px] flex flex-col justify-between transition-all duration-300 border border-gray-200 hover:border-gray-300"
                style={{
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                }}
            >
                {/* Icon Container */}
                <div>
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                        style={{
                            backgroundColor: `${accentColor}15`,
                        }}
                    >
                        <Icon
                            className="w-8 h-8"
                            style={{ color: accentColor }}
                            strokeWidth={1.5}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-end mt-6">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                        style={{
                            backgroundColor: `${accentColor}10`,
                        }}
                    >
                        <ArrowRight
                            className="w-5 h-5"
                            style={{ color: accentColor }}
                            strokeWidth={2}
                        />
                    </div>
                </div>
            </div>
        </motion.a>
    );
}
