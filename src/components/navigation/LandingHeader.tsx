"use client"

import React, { useState } from 'react'
import { User, BarChart3, QrCode, Megaphone, Palette } from 'lucide-react'
import { MegaMenuDropdown } from './MegaMenu'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSelector } from '../LanguageSelector'
import { LoginModal } from '../auth/LoginModal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LandingHeader() {
    const [isLoginOpen, setLoginOpen] = useState(false)



    const { t } = useLanguage()

    // --- FEATURES MENU DATA ---
    const personalMegaMenu = [
        {
            category: t.nav.features,
            items: [
                {
                    label: t.home.profiles_badge,
                    desc: t.home.profiles_title + ' ' + t.home.profiles_highlight,
                    icon: User,
                    href: '/dashboard/profile',
                    previewTitle: t.home.profiles_title,
                    previewDesc: t.home.profiles_desc
                },
                {
                    label: t.home.smart_title,
                    desc: t.home.smart_desc.substring(0, 30) + '...',
                    icon: QrCode,
                    href: '/dashboard/qr',
                    previewTitle: t.home.smart_title,
                    previewDesc: t.home.smart_desc
                },
                {
                    label: t.home.analytics_badge,
                    desc: t.home.analytics_desc.substring(0, 30) + '...',
                    icon: BarChart3,
                    href: '/dashboard/analytics',
                    previewTitle: t.home.analytics_title,
                    previewDesc: t.home.analytics_desc
                },
                {
                    label: 'Marketing',
                    desc: t.nav.create_identity,
                    icon: Megaphone,
                    href: '/dashboard/marketing-qr',
                    previewTitle: 'Marketing Campaigns',
                    previewDesc: t.nav.create_identity,
                    previewCta: t.common.learn_more
                },
                {
                    label: 'Themes',
                    desc: t.nav.create_identity,
                    icon: Palette,
                    href: '/dashboard/themes',
                    previewTitle: 'Theme Store',
                    previewDesc: t.nav.create_identity
                },
            ]
        }
    ]

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[50] px-8 py-4 flex items-center justify-between backdrop-blur-md bg-white/70 dark:bg-black/40 border-b border-indigo-500/5 transition-all">
                <div className="flex items-center gap-3">
                    <img
                        src="/scanex-icon.png"
                        alt="SCANEX"
                        className="w-10 h-10"
                    />
                    <span className="text-xl font-bold tracking-tight">{t.common.scanex}</span>
                </div>

                {/* --- NAVIGATION CENTER --- */}
                <nav className="hidden lg:flex items-center gap-2">

                    <a href="/" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">{t.nav.home}</a>
                    <MegaMenuDropdown
                        label={t.nav.features}
                        menuData={personalMegaMenu}
                        cta={{
                            title: t.nav.start_building,
                            desc: t.nav.create_identity,
                            label: t.common.get_started,
                            href: '/auth/signup'
                        }}
                        transparentMode={true}
                    />
                    <a href="/pricing" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">{t.nav.pricing}</a>
                    <a href="/enterprise" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">{t.nav.enterprise}</a>
                    <a href="/about" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">{t.nav.about}</a>
                </nav>


                <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSelector />
                    <ThemeToggle />
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg hover:shadow-xl"
                    >
                        {t.common.sign_in}
                    </button>
                </div>
            </header>

            <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
        </>
    )
}
