'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, LayoutGrid, Users, Palette, QrCode, BarChart3, Settings,
    X, LogOut, User, Check, ChevronRight, CreditCard, Smartphone, ChevronDown,
    Wallet, Shield, Rocket, ArrowRight, Briefcase, Share2, Zap
} from 'lucide-react';

import { MegaMenuDropdown } from '@/components/navigation/MegaMenu';

export default function DashboardHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
    }, [isSearchOpen]);

    const notifications = [
        { id: 1, title: 'New Subscriber', desc: 'Sarah J. subscribed to your newsletter', time: '2m ago', unread: true },
        { id: 2, title: 'Export Complete', desc: 'Your analytics report is ready', time: '1h ago', unread: true },
        { id: 3, title: 'Security Alert', desc: 'New login from Mac OS', time: '5h ago', unread: false },
    ];

    // Mega Menu Data Structure (Nexo-style)
    const personalMegaMenu = [
        {
            category: 'Build Identity',
            items: [
                { label: 'My Profiles', desc: 'Manage public pages', icon: User, href: '/dashboard/profile' },
                { label: 'Smart Resume', desc: 'CV & Portfolio builder', icon: Briefcase, href: '/dashboard/resume' },
                { label: 'Digital Card', desc: 'NFC & QR Business Card', icon: CreditCard, href: '/dashboard/card' },
            ]
        },
        {
            category: 'Grow & Connect',
            items: [
                { label: 'Analytics', desc: 'Track your reach', icon: BarChart3, href: '/dashboard/analytics' },
                { label: 'Contacts', desc: 'Manage leads', icon: Users, href: '/dashboard/contacts' },
                { label: 'Share', desc: 'Social integrations', icon: Share2, href: '/dashboard/share' },
            ]
        }
    ];

    return (
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 sticky top-6 z-[100] mb-14 transition-all duration-300">
            {/* Brand */}
            <div className={`flex items-center gap-3 pl-4 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">PDI Platform</span>
            </div>

            {/* Nav Pills */}
            {!isSearchOpen && (
                <nav className="hidden lg:flex items-center gap-2 bg-transparent">
                    <NavLink href="/dashboard" icon={LayoutGrid} label="Overview" />

                    {/* NEXO STYLE MEGA MENU */}
                    <MegaMenuDropdown
                        label="Personal"
                        menuData={personalMegaMenu}
                        cta={{
                            title: 'Get Started',
                            desc: 'Create your first digital identity now.',
                            label: 'Create New',
                            href: '/builder/new'
                        }}
                    />

                    <NavLink href="/dashboard/profiles" icon={Users} label="Profiles" />
                    <NavLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
                    <NavLink href="/dashboard/themes" icon={Palette} label="Themes" />
                    <NavLink href="/dashboard/qr" icon={QrCode} label="QR Studio" />
                    <NavLink href="/dashboard/smart-qr" icon={Smartphone} label="Smart App Store" />
                    <NavLink href="/dashboard/settings" icon={Settings} label="Settings" />
                </nav>
            )}

            {/* Search Input (Expandable) */}
            {isSearchOpen ? (
                <div className="flex-1 max-w-2xl w-full flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative flex-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search everything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                        />
                        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <button
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : null}

            {/* Right Actions */}
            <div className={`flex items-center gap-4 pr-4 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                <ThemeToggle />

                <div className="h-8 w-[1px] bg-gray-200 dark:bg-zinc-800"></div>

                {!isSearchOpen && (
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400'}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
                    </button>

                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                    <button className="text-xs text-blue-500 font-medium hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0 ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/5' : ''}`}>
                                            <div className="flex gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.desc}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="group">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md group-hover:ring-2 group-hover:ring-blue-100 dark:group-hover:ring-blue-900 transition-all">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Selena" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-white/5">
                                    <p className="font-bold text-gray-900 dark:text-white">Selena Doe</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">selena.doe@example.com</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-gray-100 dark:border-white/5">
                                    <button onClick={() => window.location.href = '/api/auth/logout'} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

// --- Helper Components ---
function NavLink({ href, icon: Icon, label }: { href: string; icon?: any; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
        </Link>
    );
}

