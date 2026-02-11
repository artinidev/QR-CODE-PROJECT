'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PremiumCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-600 overflow-hidden"
        >
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                }} />
            </div>

            <div className="relative">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Unlock Premium Features
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Get access to exclusive benefits and expand your networking opportunities
                </p>

                {/* CTA Button */}
                <button className="w-full flex items-center justify-between px-5 py-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-950 rounded-xl transition-colors group">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Upgrade now
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
