'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Home,
    Activity,
    Bell,
    BarChart3,
    Users,
    Settings as SettingsIcon,
    QrCode,
    User,
    HelpCircle,
    Layers,
    FileText,
    Link2,
    Palette
} from 'lucide-react';

export default function DashboardSidebar() {
    const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);

    return (
        <div className="relative flex">
            {/* Main Sidebar - Always Narrow with Icons Only */}
            <div className="w-20 bg-gradient-to-b from-blue-700 to-blue-800 text-white flex flex-col relative z-20">
                {/* Logo */}
                <div className="p-6 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-blue-700" />
                    </div>
                </div>

                {/* Icon Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* Home/Dashboard Icon */}
                    <Link href="/dashboard">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-800/50 text-white hover:bg-blue-800 transition-colors cursor-pointer">
                            <Activity className="w-5 h-5" />
                        </div>
                    </Link>

                    {/* QR/Features Icon - Opens Secondary Menu */}
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowFeaturesMenu(true)}
                            onClick={() => setShowFeaturesMenu(!showFeaturesMenu)}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${showFeaturesMenu ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800/30'
                                }`}
                        >
                            <QrCode className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Other Icons */}
                    <Link href="/dashboard/analytics">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-blue-100 hover:bg-blue-800/30 transition-colors cursor-pointer">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </Link>

                    <Link href="/dashboard/profiles">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-blue-100 hover:bg-blue-800/30 transition-colors cursor-pointer">
                            <Layers className="w-5 h-5" />
                        </div>
                    </Link>

                    <Link href="/dashboard/contacts">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-blue-100 hover:bg-blue-800/30 transition-colors cursor-pointer">
                            <Users className="w-5 h-5" />
                        </div>
                    </Link>

                    <div className="relative">
                        <Link href="/dashboard/notifications">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl text-blue-100 hover:bg-blue-800/30 transition-colors cursor-pointer relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-blue-700 text-xs font-bold rounded-full flex items-center justify-center">10</span>
                            </div>
                        </Link>
                    </div>
                </nav>

                {/* Bottom Icons */}
                <div className="px-4 py-6 space-y-4 border-t border-blue-600/30">
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl text-blue-100 hover:bg-blue-800/30 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-blue-600/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full cursor-pointer hover:ring-2 ring-white/20 transition-all"></div>
                </div>
            </div>

            {/* Dark Overlay Backdrop - Appears when secondary menu is open */}
            <AnimatePresence>
                {showFeaturesMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[5]"
                        onClick={() => setShowFeaturesMenu(false)}
                    />
                )}
            </AnimatePresence>

            {/* Secondary Features Menu - Slides from behind narrow sidebar */}
            <AnimatePresence>
                {showFeaturesMenu && (
                    <motion.div
                        initial={{ x: -256, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -256, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="absolute left-20 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white border-l border-blue-600/30 shadow-2xl z-10"
                        onMouseLeave={() => setShowFeaturesMenu(false)}
                    >
                        <motion.div
                            className="p-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <h3 className="text-lg font-bold mb-1">Platform Features</h3>
                            <p className="text-xs text-blue-200">Access all tools</p>
                        </motion.div>

                        <nav className="px-4 space-y-1">
                            {[
                                { href: '/dashboard', icon: Activity, label: 'Overview' },
                                { href: '/dashboard/qr', icon: QrCode, label: 'QR Studio' },
                                { href: '/dashboard/profiles', icon: User, label: 'Profiles' },
                                { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
                                { href: '/dashboard/contacts', icon: Users, label: 'Contacts' },
                                { href: '/dashboard/themes', icon: Palette, label: 'Themes' },
                                { href: '/dashboard/smart-qr', icon: Link2, label: 'Smart Links' },
                                { href: '/dashboard/settings', icon: SettingsIcon, label: 'Settings' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.05 + index * 0.03,
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                    }}
                                >
                                    <Link href={item.href}>
                                        <motion.div
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 cursor-pointer"
                                            whileHover={{
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                x: 4,
                                                transition: { duration: 0.2, ease: "easeOut" }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            className="p-4 mt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-blue-800/50 rounded-xl p-4"
                                whileHover={{
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <p className="text-xs font-semibold text-blue-100 mb-2">Need Help?</p>
                                <p className="text-xs text-blue-200 mb-3">Check our documentation</p>
                                <motion.button
                                    className="w-full bg-white text-blue-700 text-xs font-bold py-2 rounded-lg"
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "#f0fdf4",
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Docs
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
