'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Rocket, ArrowRight } from 'lucide-react';

// --- NEXO STYLE MEGA MENU COMPONENT ---
// Reusable component extracted from DashboardHeader for use in Landing Page
export function MegaMenuDropdown({ label, menuData, cta, transparentMode = false }: { label: string; menuData: any[]; cta?: any; transparentMode?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 
                ${isOpen
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/10'
                    : transparentMode
                        ? 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800'
                }
            `}>
                {label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[calc(100%+1rem)] left-0 w-[650px] bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-gray-100 dark:border-white/5 p-6 z-[200] grid grid-cols-12 gap-8 overflow-hidden origin-top-left"
                    >
                        {/* Main Categories (Nexo-style Grid) */}
                        <div className="col-span-8 grid grid-cols-2 gap-8">
                            {menuData.map((section: any, idx: number) => (
                                <div key={idx} className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{section.category}</h4>
                                    <div className="space-y-1">
                                        {section.items.map((item: any, i: number) => (
                                            <Link key={i} href={item.href} className="group flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-zinc-800/50 transition-all duration-200">
                                                <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                                                        {item.label}
                                                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section (Right Rail - Nexo Style) */}
                        <div className="col-span-4 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl p-6 flex flex-col justify-between border border-gray-100 dark:border-white/5">
                            <div>
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/20">
                                    <Rocket className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{cta.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{cta.desc}</p>
                            </div>
                            <Link
                                href={cta.href}
                                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {cta.label} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
