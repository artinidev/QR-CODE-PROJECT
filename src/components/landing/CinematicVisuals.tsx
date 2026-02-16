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
    const yFloat = useTransform(progress, [0.2, 0.4], [30, -30]);
    const rotate = useTransform(progress, [0.2, 0.4], [-5, -2]);

    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* 
               TARGET DESIGN V2: "Social Profile"
               fully adaptive Light/Dark mode.
            */}

            <motion.div
                style={{ y: yFloat, rotate: rotate, x: -60 }}
                className="relative w-72 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-indigo-500/10 overflow-hidden"
            >
                {/* Cover Image Area */}
                <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                <div className="px-6 pb-6 relative">
                    {/* Avatar - Overlapping Cover */}
                    <div className="relative -mt-10 mb-3 w-20 h-20 rounded-full p-1 bg-white dark:bg-[#0A0A0A]">
                        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden relative">
                            {/* Gradient placeholder for avatar image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-pink-500" />
                        </div>
                        {/* Online Indicator */}
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0A0A0A] rounded-full" />
                    </div>

                    {/* Identity */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Alex Morgan</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">@alex_design</p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between py-4 border-y border-slate-100 dark:border-white/5 mb-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">2.4k</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Followers</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">482</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Following</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">14k</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Likes</div>
                        </div>
                    </div>

                    {/* Connect Button */}
                    <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                        Connect
                    </button>

                </div>
            </motion.div>

            {/* Floating blurred orbs for depth */}
            <motion.div
                animate={{ y: [0, 15, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 dark:bg-purple-600/20 rounded-full blur-[60px]"
            />
        </div>
    );
}

function SmartQRScene() {
    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Rotating Container for Orbit */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            >
                {/* Orbital Icons */}
                {[
                    { Icon: CreditCard, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-500/20", angle: 0 },
                    { Icon: LinkIcon, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-100 dark:border-green-500/20", angle: 90 },
                    { Icon: ShoppingBag, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-100 dark:border-orange-500/20", angle: 180 },
                    { Icon: MapPin, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-500/20", angle: 270 },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -mt-8 -ml-8"
                        style={{
                            transform: `rotate(${item.angle}deg) translateX(140px)`
                        }}
                    >
                        {/* Counter-rotate the icon itself to keep it upright */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className={`w-16 h-16 ${item.bg} ${item.border} backdrop-blur-md rounded-2xl flex items-center justify-center border shadow-lg shadow-black/5`}
                        >
                            <item.Icon className={`w-8 h-8 ${item.color}`} />
                        </motion.div>
                    </div>
                ))}
            </motion.div>

            {/* Subtle orbital ring for visual context */}
            <div className="absolute inset-0 m-auto w-[280px] h-[280px] rounded-full border border-slate-200 dark:border-white/10 border-dashed opacity-50 pointer-events-none" />
        </div>
    );
}

function AnalyticsScene({ progress }: { progress: MotionValue<number> }) {
    // 3D Bar Chart Effect - Building Up
    return (
        <div className="relative w-[600px] h-[400px] flex items-end justify-center perspective-1000">

            {/* Chart Container */}
            <div className="relative z-0 flex items-end gap-3 px-10 h-[300px]">
                {/* Bars - Purple/Indigo Gradients */}
                {[0.4, 0.7, 0.5, 0.9, 0.6, 0.85, 0.45, 0.6].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: `${h * 100}%`, opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }} // Re-trigger when scrolling
                        transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: [0.22, 1, 0.36, 1] // Custom easeOut
                        }}
                        className="w-10 rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-400 opacity-90 backdrop-blur-sm border-t border-white/20 relative group shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                        {/* Optional value tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                            {Math.round(h * 100)}%
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Central Glass Card Overlay */}
            {/* Positioned to overlap the bars in the center/front */}
            <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-20 z-10 p-6 bg-white/90 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl shadow-indigo-500/20 flex flex-col items-center text-center w-64"
            >
                {/* Visual placeholder for "Internal QR" if needed, 
                    but the Global QR is behind/center. 
                    Let's utilize the transparency to show the global QR or 
                    just put stats on top of it.
                */}
                <div className="mb-2 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <BarChart3 className="w-6 h-6" />
                </div>

                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                    Total Scans
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    24,592
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                    <Globe className="w-3 h-3" />
                    <span>+12% this week</span>
                </div>
            </motion.div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />

        </div>
    );
}

function WorldMapScene({ progress }: { progress: MotionValue<number> }) {
    // Simplified World Map SVG Path (Mercator-ish)
    const worldMapPath = "M50,30 L55,25 L65,30 L70,25 L80,30 L90,20 L100,25 L110,15 L120,20 L130,15 L140,25 L150,20 L160,30 L170,20 L180,30 L190,20 L200,30 L210,20 L220,10 L230,20 L240,10 L250,20 L260,10 L270,15 L280,10 L290,20 L300,10 L310,20 L320,10 L330,20 L340,15 L350,25 L360,20 L370,30 L380,20 L390,30 L400,25 L410,35 L420,25 L430,35 L440,25 L450,20 L460,30 L470,20 L480,25 L490,20 L500,30 L510,25 L520,35 L530,30 L540,40 L550,30 L560,40 L570,30 L580,35 L590,25 L600,35 L610,30 L620,40 L630,30 L640,35 M50,100 L60,90 L70,100 L80,90 L90,100 L100,110 L90,120 L80,110 L70,120 L60,110 L50,120 L40,110 L30,120 L20,110 L10,120 L0,110 M150,150 L160,140 L170,150 L180,140 L190,150 L200,160 L190,170 L180,160 L170,170 L160,160 L150,170 L140,160 L130,170 L120,160 L110,170 L100,160 M350,150 L360,140 L370,150 L380,140 L390,150 L400,160 L390,170 L380,160 L370,170 L360,160 L350,170 L340,160 L330,170 L320,160 L310,170 L300,160";
    // The above is just a placeholder pattern. Real map paths are huge. 
    // Instead of a path, let's use a "Dotted Grid" approach which looks super techy and is easier to conform to a "map" shape if we pre-define valid dots, 
    // OR just use a nice SVG image if we had one. 
    // Since I must code it, I will use a high-quality SVG path for "Earth" silhouette.

    // Minimal World Map Equirectangular Projection Path
    const globePath = "M159.4,249.2c-2.1-2.1-5.7-0.9-6.3,2.1c-0.6,2.7,1.5,5.1,4.2,4.8C159.7,255.8,161.2,251,159.4,249.2z M275.1,280c-2.4-2.4-6.3-0.9-6.6,2.4c-0.3,2.7,2.1,5.1,4.8,4.5C275.8,286.3,277.2,282.1,275.1,280z M449,122c-3.9-3.9-10.2-1.2-10.2,4.2c0,3.3,2.7,6,6,6c3.3,0,6-2.7,6-6C450.8,124.7,450.2,123.2,449,122z M353.1,104.2c-2.1-2.1-5.4-0.6-5.4,2.4c0,1.5,1.2,2.7,2.7,2.7c1.5,0,2.7-1.2,2.7-2.7C353.1,105.7,353.1,105.1,353.1,104.2z M330,95c-2.7,0-5.1,2.4-4.5,5.1c0.3,1.5,1.5,2.7,3,2.7c1.5,0,2.7-1.2,2.7-2.7C331.2,97.4,330,95,330,95z";
    // Okay that path is too small/garbage. I'll use a functional map image from a public URL or build a "Tech Grid" that LOOKS like a map.
    // Actually, simply placing the dots in a configuration that ROUGHLY resembles continents is effective and very "JS-only".

    // Coordinates for "Land" (approximate % left, % top)
    const landDots = [
        // North America
        { x: 15, y: 20 }, { x: 20, y: 15 }, { x: 25, y: 18 }, { x: 18, y: 25 }, { x: 22, y: 28 }, { x: 28, y: 22 }, { x: 32, y: 20 }, { x: 12, y: 18 }, { x: 25, y: 12 },
        // South America
        { x: 28, y: 55 }, { x: 32, y: 60 }, { x: 35, y: 50 }, { x: 30, y: 65 }, { x: 34, y: 75 }, { x: 32, y: 85 },
        // Europe
        { x: 48, y: 20 }, { x: 52, y: 18 }, { x: 55, y: 22 }, { x: 50, y: 25 }, { x: 58, y: 20 }, { x: 45, y: 22 },
        // Africa
        { x: 50, y: 45 }, { x: 55, y: 45 }, { x: 52, y: 55 }, { x: 58, y: 50 }, { x: 60, y: 60 }, { x: 55, y: 65 }, { x: 52, y: 35 },
        // Asia
        { x: 65, y: 20 }, { x: 70, y: 15 }, { x: 75, y: 25 }, { x: 80, y: 20 }, { x: 72, y: 30 }, { x: 68, y: 35 }, { x: 85, y: 25 }, { x: 90, y: 20 }, { x: 78, y: 18 },
        // Australia
        { x: 80, y: 70 }, { x: 85, y: 75 }, { x: 90, y: 70 }, { x: 82, y: 80 }
    ];

    // "Live Scans" popping up
    const scans = [
        { x: 18, y: 25, delay: 0 },  // US
        { x: 50, y: 22, delay: 1.5 }, // EU
        { x: 75, y: 25, delay: 2.8 }, // Asia
        { x: 32, y: 60, delay: 4.1 }, // SA
        { x: 55, y: 65, delay: 5.5 }, // Africa
        { x: 85, y: 75, delay: 6.7 }, // Aus
        { x: 22, y: 28, delay: 8.0 }, // US
        { x: 52, y: 18, delay: 9.3 }, // EU
    ];

    return (
        <div className="relative w-[700px] h-[400px] flex items-center justify-center">
            {/* World Map Backdrop (Abstract Dots) */}
            <div className="absolute inset-0">
                {landDots.map((dot, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full opacity-40"
                        style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                    />
                ))}
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 border-[0.5px] border-slate-200/20 dark:border-white/5 rounded-2xl grid grid-cols-6 grid-rows-4 pointer-events-none" />

            {/* Pulsing Scans */}
            {scans.map((scan, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        delay: scan.delay,
                        ease: "easeOut"
                    }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                    style={{ left: `${scan.x}%`, top: `${scan.y}%` }}
                >
                    {/* Ripple */}
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping" />

                    {/* Head/Avatar in Circle */}
                    <div className="relative w-8 h-8 bg-indigo-600 rounded-full border-2 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center overflow-hidden z-10">
                        <User className="w-5 h-5 text-white" />
                    </div>

                    {/* Connection Line to center (optional, maybe too messy) */}
                </motion.div>
            ))}

            {/* Central Hub Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
