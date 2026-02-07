'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Globe, Users, Shield, Zap,
    Heart
} from 'lucide-react';
import { LandingHeader } from '@/components/navigation/LandingHeader';
import { Footer } from '@/components/navigation/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020205] text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-indigo-500/30">
            <LandingHeader />

            <main>
                <AboutHero />
                <StorySection />
                <StatsSection />
                <ValuesSection />
                <TeamSection />
                <CtaSection />
            </main>

            <Footer />
        </div>
    );
}

// --- Components ---

function AboutHero() {
    const { t } = useLanguage();
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            <div className="max-w-[1000px] mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 border border-slate-200 dark:border-white/10">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        {t.about.mission_badge}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                        {t.about.title} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                            {t.about.title_highlight}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {t.about.subtitle}
                    </p>
                </motion.div>
            </div>
            {/* Subtle Gradient Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-100/50 to-indigo-100/50 dark:from-cyan-900/20 dark:to-indigo-900/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-60 dark:opacity-40" />
        </section>
    );
}

function StorySection() {
    const { t } = useLanguage();
    return (
        <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
            <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-16 items-start">
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t.about.story.title}</h2>
                    <div className="bg-white dark:bg-black p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                            <div className="w-32 h-32 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                                <div className="w-24 h-24 bg-white dark:bg-black" />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-center mt-4 text-slate-500 dark:text-slate-400 font-mono">{t.about.story.figure}</p>
                </div>
                <div className="flex-1 space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p>
                        {t.about.story.p1}
                    </p>
                    <p>
                        {t.about.story.p2}
                    </p>
                    <p>
                        {t.about.story.p3}
                    </p>
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    const { t } = useLanguage();
    const stats = [
        { label: t.about.stats.scans.label, value: "250M+", desc: t.about.stats.scans.desc },
        { label: t.about.stats.uptime.label, value: "99.99%", desc: t.about.stats.uptime.desc },
        { label: t.about.stats.countries.label, value: "120+", desc: t.about.stats.countries.desc },
        { label: t.about.stats.team.label, value: "45", desc: t.about.stats.team.desc },
    ];

    return (
        <section className="py-24 px-6 md:px-12 border-b border-slate-200 dark:border-white/5">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <h3 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white mb-2">{stat.value}</h3>
                            <div className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-1">{stat.label}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ValuesSection() {
    const { t } = useLanguage();
    const values = [
        {
            title: t.about.values.items[0].title,
            desc: t.about.values.items[0].desc,
            icon: <Shield className="w-6 h-6" />
        },
        {
            title: t.about.values.items[1].title,
            desc: t.about.values.items[1].desc,
            icon: <Zap className="w-6 h-6" />
        },
        {
            title: t.about.values.items[2].title,
            desc: t.about.values.items[2].desc,
            icon: <Globe className="w-6 h-6" />
        },
        {
            title: t.about.values.items[3].title,
            desc: t.about.values.items[3].desc,
            icon: <Heart className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#020205]">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t.about.values.title}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                        {t.about.values.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((item, i) => (
                        <div key={i} className="group p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-slate-900 dark:text-white">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamSection() {
    const { t } = useLanguage();
    return (
        <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-white/5">
            <div className="max-w-[1200px] mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight">{t.about.join.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">
                    {t.about.join.desc}
                </p>

                <div className="flex justify-center flex-wrap gap-4">
                    {['Engineering', 'Product', 'Design', 'Marketing'].map((team) => (
                        <div key={team} className="px-6 py-3 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium">
                            {team}
                        </div>
                    ))}
                    <div className="px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-2">
                        {t.about.join.cta} <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function CtaSection() {
    const { t } = useLanguage();
    return (
        <section className="py-32 px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-slate-900 dark:text-white tracking-tight">{t.about.cta.title}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-block text-slate-900 font-bold rounded-full hover:scale-105 transition-transform"
                >
                    {t.about.cta.primary}
                </Link>
                <Link
                    href="/contact"
                    className="px-8 py-4 bg-transparent border border-slate-200 dark:border-white/20 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                    {t.about.cta.secondary}
                </Link>
            </div>
        </section>
    );
}
