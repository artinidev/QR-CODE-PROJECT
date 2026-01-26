"use client"

import React, { useState } from 'react'
import { Zap, Rocket, User, Share2, Briefcase, CreditCard, BarChart3, Users } from 'lucide-react'
import { MegaMenuDropdown } from './MegaMenu'
import { ThemeToggle } from '../ThemeToggle'
import { LoginModal } from '../auth/LoginModal'

export function LandingHeader() {
    const [isLoginOpen, setLoginOpen] = useState(false)

    // --- HOME MENU DATA ---
    const homeMegaMenu = [
        {
            category: 'Available Layouts',
            items: [
                { label: 'Landing Page 1', desc: 'Current Design', icon: Zap, href: '/' },
                { label: 'Landing Page 2', desc: 'Smart QR 3D', icon: Rocket, href: '/design/smart-qr' },
                { label: 'Landing Page 3', desc: 'Tech Motion Network', icon: Share2, href: '/design/tech-motion' },
                { label: 'Landing Page 4', desc: 'Coming Soon', icon: User, href: '#' },
            ]
        }
    ]

    // --- FEATURES MENU DATA ---
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
    ]

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[50] px-8 py-4 flex items-center justify-between backdrop-blur-md bg-white/70 dark:bg-black/40 border-b border-indigo-500/5 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">PDI Platform</span>
                </div>

                {/* --- NAVIGATION CENTER --- */}
                <nav className="hidden lg:flex items-center gap-2">
                    <MegaMenuDropdown
                        label="Home"
                        menuData={homeMegaMenu}
                        cta={{
                            title: 'New Design?',
                            desc: 'We are constantly adding new high-quality landing pages.',
                            label: 'View All',
                            href: '#'
                        }}
                        transparentMode={true}
                    />
                    <MegaMenuDropdown
                        label="Features"
                        menuData={personalMegaMenu}
                        cta={{
                            title: 'Start Building',
                            desc: 'Create your digital identity today.',
                            label: 'Get Started',
                            href: '/auth/signup'
                        }}
                        transparentMode={true}
                    />
                    <a href="#" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">Pricing</a>
                    <a href="#" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">Enterprise</a>
                    <a href="#" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">About</a>
                </nav>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
                    >
                        Sign In
                    </button>
                </div>
            </header>

            <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
        </>
    )
}
