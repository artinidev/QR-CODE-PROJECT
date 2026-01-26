'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { User, Share2, CreditCard, BarChart3, Globe, QrCode, Link as LinkIcon, ShoppingBag, MapPin, Smartphone } from 'lucide-react';

export function CinematicVisuals({ progress }: { progress: MotionValue<number> }) {
    // --- LAYERS OPACITY CONTROL ---
    // Smooth crossfades between scenes
    // 0.0 - 0.2: Hero
    // 0.2 - 0.4: Profiles
    // 0.4 - 0.6: Smart QR
    // 0.6 - 0.8: Analytics
    // 0.8 - 1.0: Live Tracking

    const heroOpacity = useTransform(progress, [0, 0.15, 0.25], [1, 1, 0]);
    const profileOpacity = useTransform(progress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
    const smartQROpacity = useTransform(progress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const analyticsOpacity = useTransform(progress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
    const trackingOpacity = useTransform(progress, [0.75, 0.85, 1], [0, 1, 1]);

    // SCALE / POSITION Shared Transforms
    const globalScale = useTransform(progress, [0, 1], [1, 1.1]); // Subtle constant zoom
    const globalY = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -20, 0, -20, 0, -20]); // Floating effect

    return (
        <div className="relative w-full h-[800px] flex items-center justify-center overflow-hidden perspective-1000">

            {/* --- SCENE 5: LIVE TRACKING (Back Layer) --- */}
            <motion.div style={{ opacity: trackingOpacity, scale: globalScale }} className="absolute inset-0 flex items-center justify-center">
                <WorldMapScene progress={progress} />
            </motion.div>

            {/* --- SCENE 4: ANALYTICS --- */}
            <motion.div style={{ opacity: analyticsOpacity, y: globalY }} className="absolute inset-0 flex items-center justify-center">
                <AnalyticsScene progress={progress} />
            </motion.div>

            {/* --- SCENE 3: SMART QR --- */}
            <motion.div style={{ opacity: smartQROpacity, scale: globalScale }} className="absolute inset-0 flex items-center justify-center">
                <SmartQRScene />
            </motion.div>

            {/* --- SCENE 2: PROFILES --- */}
            <motion.div style={{ opacity: profileOpacity, y: globalY }} className="absolute inset-0 flex items-center justify-center">
                <ProfileScene progress={progress} />
            </motion.div>

            {/* --- SCENE 1: HERO (Top Layer) --- */}
            <motion.div style={{ opacity: heroOpacity, scale: globalScale }} className="absolute inset-0 flex items-center justify-center">
                <HeroScene />
            </motion.div>

            {/* --- SHARED CENTER ANCHOR (The QR Core) --- */}
            {/* This allows the core QR to feel like it persists across all scenes */}
            <motion.div
                className="absolute w-40 h-40 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)] z-50"
            >
                <QrCode className="w-20 h-20 text-indigo-600 dark:text-white/90" />
                {/* Scanner Line */}
                <motion.div
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-[5%] w-[90%] h-[2px] bg-indigo-400 shadow-[0_0_15px_#818cf8]"
                />
            </motion.div>

        </div>
    );
}

// ----------------------------------------------------------------------
// SUB-SCENES
// ----------------------------------------------------------------------

function HeroScene() {
    return (
        <div className="relative w-[600px] h-[600px] flex items-center justify-center">
            {/* Orbiting Orbs */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-lg opacity-60 absolute"
                        style={{ top: '50%', left: `${50 + (i + 2) * 8}%`, transform: 'translateY(-50%)' }}
                    />
                </motion.div>
            ))}
            {/* Data Streams */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`stream-${i}`}
                    animate={{ pathLength: [0, 1], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                    className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                    style={{ top: `${10 + i * 10}%`, transform: `rotate(${i * 45}deg)` }}
                />
            ))}
        </div>
    );
}

function ProfileScene({ progress }: { progress: MotionValue<number> }) {
    // Floating UI Elements
    const yFloat = useTransform(progress, [0.2, 0.4], [50, -50]);

    return (
        <div className="relative w-[500px] h-[500px]">
            {/* Glass Card Behind */}
            <motion.div
                style={{ y: yFloat, rotate: -5 }}
                className="absolute top-20 left-10 w-64 h-80 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-400" />
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-white/20 rounded-full" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-10 w-full bg-white/10 rounded-xl flex items-center px-4 gap-3">
                        <Smartphone className="w-4 h-4 text-white/60" />
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-10 w-full bg-white/10 rounded-xl flex items-center px-4 gap-3">
                        <Share2 className="w-4 h-4 text-white/60" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                    </div>
                </div>
            </motion.div>

            {/* Floating Social Bubbles */}
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 right-20 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-40" />
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-30" />
        </div>
    );
}

function SmartQRScene() {
    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Floating Icons around the Core */}
            {[
                { Icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10", x: -120, y: -80 },
                { Icon: LinkIcon, color: "text-green-400", bg: "bg-green-500/10", x: 120, y: -60 },
                { Icon: ShoppingBag, color: "text-orange-400", bg: "bg-orange-500/10", x: -90, y: 100 },
                { Icon: MapPin, color: "text-red-400", bg: "bg-red-500/10", x: 100, y: 80 },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: item.x, y: item.y }}
                    transition={{ delay: i * 0.1 }}
                    className={`absolute w-16 h-16 ${item.bg} backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 ring-1 ring-white/5 shadow-lg`}
                >
                    <item.Icon className={`w-8 h-8 ${item.color}`} />
                    {/* Connection Line */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className={`w-[1px] h-[100px] bg-current origin-bottom rotate-${i * 90}`} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function AnalyticsScene({ progress }: { progress: MotionValue<number> }) {
    // 3D Bar Chart Effect
    return (
        <div className="relative w-[600px] h-[400px] perspective-500">
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 h-64 px-10">
                {[40, 70, 50, 90, 60, 85, 45].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-12 bg-gradient-to-t from-indigo-600 to-indigo-400/50 rounded-t-lg backdrop-blur-sm border-t border-indigo-300/30 relative group"
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded">
                            {h * 12} Scans
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Floating Stats Card */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-10 w-48 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
            >
                <div className="text-sm text-slate-300 mb-1">Total Scans</div>
                <div className="text-2xl font-bold text-white">24,592</div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" /> +12% this week
                </div>
            </motion.div>
        </div>
    );
}

function WorldMapScene({ progress }: { progress: MotionValue<number> }) {
    return (
        <div className="relative w-[800px] h-[500px] flex items-center justify-center">
            {/* Abstract World Map Dots */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`
                        }}
                    />
                ))}
            </div>

            {/* Pulsing Signal Rings */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ scale: [0.5, 2], opacity: [0.8, 0] }}
                    transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeOut" }}
                    className="absolute border border-indigo-500 rounded-full w-40 h-40"
                />
            ))}

            <Globe className="w-96 h-96 text-indigo-500/10 absolute animate-pulse" />
        </div>
    );
}
