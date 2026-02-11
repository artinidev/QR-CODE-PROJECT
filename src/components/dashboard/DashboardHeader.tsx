'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Settings, LogOut, Moon, Sun } from 'lucide-react';

export default function DashboardHeader() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const navItems = [
        { label: 'Home', href: '/dashboard' },
        { label: 'Profiles', href: '/dashboard/profiles' },
        { label: 'QR Studio', href: '/dashboard/qr' },
        { label: 'Analytics', href: '/dashboard/analytics' },
        { label: 'Marketing Campaigns', href: '/dashboard/marketing-qr' },
        { label: 'Themes', href: '/dashboard/themes' }
    ];

    const [usage, setUsage] = useState<{ scans: number, limit: number } | null>(null);

    React.useEffect(() => {
        fetch('/api/user/credits')
            .then(res => res.json())
            .then(data => {
                if (data.credits) {
                    setUsage({
                        scans: data.credits.scans,
                        limit: 100
                    });
                }
            })
            .catch(err => console.error('Failed to load credits:', err));
    }, []);

    return (
        <header className="sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img
                            src="/scanex-icon.png"
                            alt="SCANEX"
                            className="w-8 h-8"
                        />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">SCANEX</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname?.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">

                        {/* Usage Stats (Free Plan) */}
                        {usage && (
                            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                    {usage.scans} / {usage.limit} Scans
                                </span>
                            </div>
                        )}

                        {/* Search */}
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl w-64">
                            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Enter your search request..."
                                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                            />
                        </div>

                        {/* Icon Buttons */}
                        <button
                            onClick={toggleDarkMode}
                            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                        >
                            {isDarkMode ? (
                                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>

                        <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <Bell className="w-4 h-4 text-gray-600" />
                        </button>

                        <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <Settings className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors"
                            >
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Selena"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {/* Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                                window.location.href = '/';
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
