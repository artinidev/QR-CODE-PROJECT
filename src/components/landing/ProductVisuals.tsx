'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { User, QrCode, CreditCard, BarChart3, Globe, Shield, Wifi, Zap } from 'lucide-react';

export function ProductVisuals({ progress }: { progress: MotionValue<number> }) {
    // --- TRANSFORMATIONS ---

    // 1. Stage 1: ID CARD (0 - 0.2)
    // The card fades in and positions itself
    const cardScale = useTransform(progress, [0, 0.2, 0.35], [0.8, 1, 0.9]);
    const cardY = useTransform(progress, [0, 0.2, 0.5], [50, 0, -20]);
    const cardOpacity = useTransform(progress, [0, 0.05], [0, 1]);

    // 2. Stage 2: PHONE SHELL (0.25 - 0.45)
    // Phone frame scales up around the card
    const phoneOpacity = useTransform(progress, [0.2, 0.25], [0, 1]);
    const phoneScale = useTransform(progress, [0.2, 0.35, 0.6], [1.1, 1, 0.7]); // Zooms out later
    const phoneY = useTransform(progress, [0.35, 0.6], [0, 60]); // Moves down to become "Desktop" element

    // CONTENT SWAP: ID -> QR
    // 0.20 -> 0.30: Show ID
    // 0.30 -> 0.40: ID Fades out, QR Fades in inside the phone
    const idContentOpacity = useTransform(progress, [0.25, 0.3], [1, 0]);
    const qrContentOpacity = useTransform(progress, [0.28, 0.35], [0, 1]);

    // 3. Stage 3: DASHBOARD WIDGETS (0.5 - 0.75)
    // Widgets fly in from behind/sides
    // We'll have Left, Right, and Top widgets
    const widgetOpacity = useTransform(progress, [0.5, 0.6], [0, 1]);
    const leftWidgetX = useTransform(progress, [0.5, 0.7], [-100, -180]); // Moves out to left
    const rightWidgetX = useTransform(progress, [0.5, 0.7], [100, 180]); // Moves out to right
    const topWidgetY = useTransform(progress, [0.5, 0.7], [-50, -140]); // Moves up

    // 4. Stage 4: GLOBAL MAP (0.8 - 1.0)
    // Everything scales down and dissolves into nodes
    const visualsScale = useTransform(progress, [0.8, 0.9], [1, 0.5]);
    const visualsOpacity = useTransform(progress, [0.85, 0.95], [1, 0]);
    const mapOpacity = useTransform(progress, [0.85, 0.95], [0, 1]);
    const mapScale = useTransform(progress, [0.85, 1], [0.5, 1.2]);


    return (
        <div className="relative w-[600px] h-[600px] flex items-center justify-center perspective-1000">

            {/* --- GLOBAL WRAPPER (Scales out at end) --- */}
            <motion.div
                style={{ scale: visualsScale, opacity: visualsOpacity }}
                className="relative flex items-center justify-center"
            >

                {/* --- DASHBOARD WIDGETS (Behind Phone) --- */}

                {/* Left Widget: Analytics */}
                <motion.div
                    style={{ opacity: widgetOpacity, x: leftWidgetX }}
                    className="absolute z-0 w-48 h-32 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><BarChart3 className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Growth</span>
                    </div>
                    <div className="w-full h-16 bg-slate-50 dark:bg-white/5 rounded-lg flex items-end justify-between p-2 gap-1">
                        {[40, 70, 50, 90, 60, 80].map((h, i) => (
                            <div key={i} className="w-full bg-green-500 rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </motion.div>

                {/* Right Widget: Connections */}
                <motion.div
                    style={{ opacity: widgetOpacity, x: rightWidgetX }}
                    className="absolute z-0 w-48 h-32 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><User className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">New Leads</span>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-800" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">+12</div>
                    </div>
                </motion.div>

                {/* Top Widget: Security */}
                <motion.div
                    style={{ opacity: widgetOpacity, y: topWidgetY }}
                    className="absolute z-0 w-40 h-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-xl flex items-center gap-3"
                >
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full"><Shield className="w-5 h-5" /></div>
                    <div>
                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Secure</div>
                        <div className="text-xs font-bold text-slate-700 dark:text-white">Active</div>
                    </div>
                </motion.div>

                {/* --- PHONE SHELL (The Centerpiece) --- */}
                <motion.div
                    style={{
                        opacity: phoneOpacity,
                        scale: phoneScale,
                        y: phoneY
                    }}
                    className="absolute z-10 w-[280px] h-[580px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl p-2"
                >
                    {/* Screen */}
                    <div className="w-full h-full bg-slate-50 dark:bg-black rounded-[32px] overflow-hidden relative">
                        {/* Dynamic Content Container */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">

                            {/* CONTENT A: ID CARD (Visible initially, fades out) */}
                            <motion.div
                                style={{ opacity: idContentOpacity, scale: cardScale, y: cardY }}
                                className="absolute w-[240px] h-[380px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30" />
                                        <Wifi className="opacity-50 w-6 h-6" />
                                    </div>
                                    <div className="h-4 w-20 bg-white/20 rounded-full mb-3" />
                                    <div className="h-2 w-32 bg-white/10 rounded-full" />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="h-8 w-24 bg-white/20 rounded-lg" />
                                    <CreditCard className="w-8 h-8 opacity-80" />
                                </div>
                            </motion.div>

                            {/* CONTENT B: QR CODE (Fades in) */}
                            <motion.div
                                style={{ opacity: qrContentOpacity }}
                                className="absolute inset-0 bg-white dark:bg-black flex flex-col items-center justify-center p-8"
                            >
                                <div className="w-64 h-64 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
                                    <div className="w-full h-full bg-slate-900 rounded-xl pattern-dots relative">
                                        {/* Mock QR Modules */}
                                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-slate-900 rounded-lg" />
                                        <div className="absolute top-0 right-0 w-12 h-12 border-4 border-slate-900 rounded-lg" />
                                        <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-slate-900 rounded-lg" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <Zap className="text-white w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">Scan to Connect</p>
                                <p className="text-sm text-slate-400">PDI Smart Profile</p>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>

                {/* ID Card (Stage 1 Standalone - Before Phone appears) */}
                {/* Note: We reuse the ID Card inside the phone for smoothness. 
                    The trick is: The phone frame appears *around* it, so no duplicate needed if aligned perfectly.
                    Here we relied on phoneOpacity fading in. We need the ID card to exist BEFORE the phone.
                */}
                <motion.div
                    style={{
                        opacity: useTransform(progress, [0.2, 0.21], [1, 0]), // Hide when phone frame appears
                        scale: cardScale,
                        y: cardY
                    }}
                    className="absolute z-20 w-[240px] h-[380px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30" />
                            <Wifi className="opacity-50 w-6 h-6" />
                        </div>
                        <div className="h-4 w-20 bg-white/20 rounded-full mb-3" />
                        <div className="h-2 w-32 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="h-8 w-24 bg-white/20 rounded-lg" />
                        <CreditCard className="w-8 h-8 opacity-80" />
                    </div>
                </motion.div>

            </motion.div>

            {/* --- MAP LAYER (Stage 4) --- */}
            <motion.div
                style={{ opacity: mapOpacity, scale: mapScale }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="w-[800px] h-[800px] rounded-full border border-indigo-500/10 flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                    {/* Mock Globe Nodes */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
                            style={{
                                top: `${50 + Math.sin(i * 45) * 40}%`,
                                left: `${50 + Math.cos(i * 45) * 40}%`
                            }}
                        />
                    ))}
                    <div className="w-[600px] h-[600px] rounded-full border border-indigo-500/10 absolute" />
                    <div className="w-[400px] h-[400px] rounded-full border border-indigo-500/20 absolute" />
                    <div className="w-[200px] h-[200px] rounded-full bg-indigo-500/5 blur-3xl absolute" />

                    <Globe className="w-32 h-32 text-indigo-500/20 animate-pulse" />
                </div>
            </motion.div>

        </div>
    );
}
