'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Globe, Users, Shield, Zap, QrCode,
    Heart, Utensils, Package, Home, ShoppingBag, GraduationCap, Contact, Calendar, Megaphone,
    MessageSquare, BarChart, Repeat, Layers, Headphones, ClipboardCheck
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
                <ConsumerGoodsSection />
                <UseCasesSection />
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
        <section className="relative pt-32 pb-32 md:pt-48 md:pb-48 px-6 overflow-hidden flex items-center justify-center min-h-[80vh]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/about-hero-scan.jpg"
                    alt="Scanning QR Code"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 dark:bg-black/80" /> {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent" /> {/* Bottom fade */}
            </div>

            <div className="max-w-[1000px] mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/10 backdrop-blur-md text-white/90 text-sm font-medium mb-8 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        {t.about.mission_badge}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-8 leading-[1.1]">
                        {t.about.title} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            {t.about.title_highlight}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                        {t.about.subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function ConsumerGoodsSection() {
    const { t } = useLanguage();

    const benefitsIcons = [
        <Package className="w-8 h-8" key="details" />,
        <MessageSquare className="w-8 h-8" key="feedback" />,
        <Heart className="w-8 h-8" key="engagement" />,
        <Repeat className="w-8 h-8" key="repeat" />,
        <BarChart className="w-8 h-8" key="track" />,
        <Users className="w-8 h-8" key="loyalty" />,
        <ClipboardCheck className="w-8 h-8" key="inventory" />,
        <Headphones className="w-8 h-8" key="support" />
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-32 px-6 md:px-12 bg-slate-50 dark:bg-[#0B0C10] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                {/* Intro with Gradient Text */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                                {t.about.consumer_goods.title}
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            {t.about.consumer_goods.subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* "Why" Block - Glassmorphic & Modern */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-24 relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] rotate-1 opacity-20 group-hover:rotate-2 transition-transform duration-500" />
                    <div className="relative p-8 md:p-12 rounded-[2rem] bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium text-sm">
                                <Zap className="w-4 h-4 fill-current" />
                                <span>{t.about.consumer_goods.game_changer_badge}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                {t.about.consumer_goods.why_title}
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                {t.about.consumer_goods.why_desc}
                            </p>
                        </div>
                        {/* Abstract Visual */}
                        <div className="shrink-0 relative w-full md:w-80 h-64 md:h-auto min-h-[250px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.1]" />
                            <div className="relative z-10 w-32 h-32 bg-white dark:bg-black rounded-2xl shadow-2xl flex items-center justify-center rotate-12 group-hover:rotate-6 transition-transform duration-500">
                                <QrCode className="w-16 h-16 text-slate-900 dark:text-white" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
                        </div>
                    </div>
                </motion.div>

                {/* Benefits Bento Grid */}
                <div>
                    <h3 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">
                        {t.about.consumer_goods.benefits_title}
                    </h3>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {t.about.consumer_goods.benefits.map((benefit, i) => {
                            // Make specific cards span 2 cols for bento effect (e.g., first and last)
                            const isLarge = i === 0 || i === 3;

                            return (
                                <motion.div
                                    key={i}
                                    variants={item}
                                    className={`relative group bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-400/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isLarge ? 'md:col-span-2' : ''}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors duration-500 rounded-3xl" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                            {benefitsIcons[i] || <Zap className="w-6 h-6" />}
                                        </div>

                                        <h4 className="font-bold text-xl mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {benefit.title}
                                        </h4>

                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {benefit.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
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

function UseCasesSection() {
    const { t } = useLanguage();

    // Map icons to the translated items by index
    const icons = [
        <Utensils className="w-6 h-6" key="utensils" />,
        <Package className="w-6 h-6" key="package" />,
        <Home className="w-6 h-6" key="home" />,
        <ShoppingBag className="w-6 h-6" key="shopping" />,
        <GraduationCap className="w-6 h-6" key="edu" />,
        <Heart className="w-6 h-6" key="heart" />,
        <Contact className="w-6 h-6" key="contact" />,
        <Calendar className="w-6 h-6" key="calendar" />,
        <Megaphone className="w-6 h-6" key="megaphone" />
    ];

    const useCases = t.about.use_cases.items.map((item, i) => ({
        ...item,
        icon: icons[i] || <Zap className="w-6 h-6" /> // Fallback icon
    }));

    return (
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#020205]">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight leading-tight">
                        {t.about.use_cases.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t.about.use_cases.subtitle}
                    </p>
                </div>

                <div className="relative">
                    {useCases.map((item, i) => {
                        const isLast = i === useCases.length - 1;
                        return (
                            <div
                                key={i}
                                className={`${isLast ? 'relative' : 'sticky'} mx-auto max-w-4xl p-8 rounded-3xl bg-slate-50 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 shadow-2xl mb-24 flex flex-col md:flex-row gap-8 items-start md:items-center transition-all duration-500`}
                                style={{
                                    top: isLast ? 0 : `${150 + i * 20}px`, // Last item scrolls naturally to "wipe" the stack
                                    zIndex: i + 1,
                                    opacity: 1,
                                    transform: `scale(${1 - (useCases.length - 1 - i) * 0.02})`
                                }}
                            >
                                <div className="shrink-0 w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10" })}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="absolute top-4 right-6 text-9xl font-bold text-slate-200 dark:text-white/5 pointer-events-none -z-10 select-none">
                                    {i + 1}
                                </div>
                            </div>
                        );
                    })}
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
