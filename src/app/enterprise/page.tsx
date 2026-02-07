'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { LandingHeader } from '@/components/navigation/LandingHeader';
import { Footer } from '@/components/navigation/Footer';
import {
    Shield, Globe, Key, Users, ArrowRight, Zap,
    Server, Activity, Lock, Layers, Code, CheckCircle, Smartphone, QrCode
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020205] text-slate-900 dark:text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden transition-colors duration-500">
            <LandingHeader />
            <main>
                <HeroSection />
                <FeatureShowcase />
                <GridSection />
                <DeveloperSection />
                <TrustTicker />
            </main>
            <Footer />
        </div>
    );
}

// --- HERO SECTION ---
function HeroSection() {
    const { t } = useLanguage();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Background Blob */}
            <motion.div
                className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-5xl mx-auto">
                {/* Animated QR Icon */}
                <div className="relative mb-8 group inline-block">
                    <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 blur-[30px] rounded-full animate-pulse" />
                    <div className="relative w-20 h-20 bg-white/70 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20 mx-auto">
                        <QrCode className="w-10 h-10 text-slate-800 dark:text-white relative z-10" />

                        {/* Scanning Beam */}
                        <motion.div
                            animate={{ top: ['-100%', '200%'] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 0.5
                            }}
                            className="absolute left-0 right-0 h-[20px] bg-gradient-to-b from-transparent via-indigo-500/30 dark:via-indigo-500/50 to-transparent blur-[5px] z-20 w-full"
                        />
                        {/* Scan Line */}
                        <motion.div
                            animate={{ top: ['-100%', '200%'] }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 0.5
                            }}
                            className="absolute left-0 right-0 h-[2px] bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)] z-30"
                        />
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1]">
                    {t.enterprise.title} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                        {t.enterprise.title_highlight}
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                    {t.enterprise.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-indigo-500/20">
                        {t.common.contact_sales} <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                        {t.common.read_docs}
                    </button>
                </div>
            </motion.div>
        </section>
    );
}

function FeatureShowcase() {
    const { t } = useLanguage();
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-semibold mb-6 tracking-tight text-indigo-600 dark:text-indigo-400">{t.enterprise.features.dynamic.title}</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        {t.enterprise.features.dynamic.desc}
                    </p>

                    <div className="grid gap-6">
                        {[
                            { title: t.home.smart_title, desc: t.home.smart_desc }, // Reusing home strings for now, or adapt if needed
                            { title: t.enterprise.features.analytics.title, desc: t.enterprise.features.analytics.desc }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-slate-50 dark:bg-[#0A0A0F] rounded-2xl border border-slate-200 dark:border-white/10 p-2 shadow-2xl"
                >
                    {/* Simplified UI Representation: Analytics Dashboard */}
                    <div className="bg-white dark:bg-[#05050A] rounded-xl p-6 aspect-[4/3] flex flex-col gap-4 overflow-hidden relative">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-32 h-4 bg-slate-200 dark:bg-white/10 rounded" />
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white/5" />
                                <div className="w-8 h-8 rounded bg-indigo-500" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 h-32 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5" />
                            <div className="flex-1 h-32 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5" />
                        </div>
                        <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-4 flex items-end gap-2">
                            {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t relative overflow-hidden" style={{ height: `${h}%` }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                        className="w-full bg-indigo-500 rounded-t absolute bottom-0 left-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function GridSection() {
    const { t } = useLanguage();
    const items = [
        {
            title: t.enterprise.control.security_title,
            desc: t.enterprise.control.security_desc,
            icon: <Shield className="w-6 h-6" />
        },
        {
            title: t.enterprise.control.sso_title,
            desc: t.enterprise.control.sso_desc,
            icon: <Key className="w-6 h-6" />
        },
        {
            title: t.enterprise.control.team_title,
            desc: t.enterprise.control.team_desc,
            icon: <Users className="w-6 h-6" />
        },
        {
            title: t.enterprise.control.edge_title,
            desc: t.enterprise.control.edge_desc,
            icon: <Globe className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-32 px-6 bg-slate-100 dark:bg-[#0A0A0F] border-y border-slate-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-semibold mb-4 text-slate-900 dark:text-white">{t.enterprise.control.title}</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">{t.enterprise.control.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-colors">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DeveloperSection() {
    const { t } = useLanguage();
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                <div className="flex-1 order-2 md:order-1">
                    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl font-mono text-sm border border-white/10">
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="ml-2 text-xs text-stone-400">api-example.js</span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-2 font-mono text-xs md:text-sm text-slate-300">
                                <div className="text-slate-500">// Initialize client</div>
                                <div>
                                    <span className="text-purple-400">const</span> client = <span className="text-blue-400">new</span> ScanEx(process.env.API_KEY);
                                </div>
                                <div className="h-4" />
                                <div className="text-slate-500">// Create dynamic QR</div>
                                <div>
                                    <span className="text-purple-400">await</span> client.qr.create({'{'}
                                </div>
                                <div className="pl-4">
                                    type: <span className="text-green-400">'dynamic'</span>,
                                </div>
                                <div className="pl-4">
                                    destination: <span className="text-green-400">'https://acme.com'</span>,
                                </div>
                                <div className="pl-4">
                                    tags: [<span className="text-green-400">'summer-campaign'</span>]
                                </div>
                                <div>{'}'});</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 order-1 md:order-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Code className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold uppercase tracking-wider text-indigo-500">{t.enterprise.developers.label}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                        {t.enterprise.developers.title}
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        {t.enterprise.developers.desc}
                    </p>
                    <button className="text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white hover:text-indigo-500 hover:border-indigo-500 transition-colors">
                        {t.common.read_docs}
                    </button>
                </div>
            </div>
        </section>
    );
}

function TrustTicker() {
    const { t } = useLanguage();
    return (
        <section className="py-12 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black">
            <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-8">
                {t.enterprise.trust}
            </div>
            <div className="flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos, using text for now */}
                {['ACME Corp', 'Globex', 'Soylent', 'Umbrella', 'Stark Ind'].map((logo) => (
                    <span key={logo} className="text-xl font-bold font-mono text-slate-400 dark:text-slate-600">{logo}</span>
                ))}
            </div>
        </section>
    );
}
