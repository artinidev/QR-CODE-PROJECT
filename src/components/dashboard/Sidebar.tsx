'use client';

import { Home, User, Settings, LogOut, BarChart2, QrCode, Users, Palette, Layout, Smartphone, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'My Profiles', href: '/dashboard/profiles', icon: User },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'My Contacts', href: '/dashboard/contacts', icon: Users },
    { name: 'Theme Studio', href: '/dashboard/themes', icon: Palette },
    { name: 'QR Studio', href: '/dashboard/qr', icon: QrCode },
    { name: 'Smart App Store', href: '/dashboard/smart-qr', icon: Smartphone },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    const [usage, setUsage] = useState<{ scans: number, limit: number } | null>(null);

    useEffect(() => {
        fetch('/api/user/credits')
            .then(res => res.json())
            .then(data => {
                if (data.credits) {
                    setUsage({
                        scans: data.credits.scans,
                        limit: 100 // Hardcoded for Starter plan for now, ideally from plan details
                    });
                }
            })
            .catch(err => console.error('Failed to load credits:', err));
    }, []);

    return (
        <aside className="w-20 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 hidden lg:flex flex-col items-center py-6">
            <div className="mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                    P
                </div>
            </div>

            <nav className="flex-1 space-y-4 w-full px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={item.name}
                            className={`flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-105'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-4 w-full space-y-4">
                {/* Usage Indicator */}
                {usage && (
                    <div className="w-full flex flex-col items-center gap-1 group relative">
                        <div className="h-16 w-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden relative">
                            <div
                                className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ height: `${Math.min((usage.scans / usage.limit) * 100, 100)}%` }}
                            />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute left-10 bottom-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-50">
                            {usage.scans} / {usage.limit} Scans
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center justify-center w-full aspect-square rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
