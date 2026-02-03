'use client';

import { Home, User, Settings, LogOut, BarChart2, QrCode, Users, Palette, Layout, Smartphone, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

    const handleLogout = async () => {
        // Implement logout logic here later
        window.location.href = '/api/auth/logout';
    };

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

            <div className="mt-auto px-4 w-full">
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
