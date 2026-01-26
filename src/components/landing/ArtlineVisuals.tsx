'use client';

import React, { useMemo } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { Zap, Globe, User, BarChart3, QrCode } from 'lucide-react';

export function ArtlineVisuals({ progress }: { progress: MotionValue<number> }) {
    // 15x15 Grid = 225 Dots
    const gridSize = 15;
    const dots = Array.from({ length: gridSize * gridSize });
    const gap = 20; // Spacing between dots

    // --- TRANSFORMATIONS FOR THE FRAME ---
    // The frame stays relatively stable but might pulse or glow
    const frameOpacity = useTransform(progress, [0, 0.1], [0, 1]);
    const frameScale = useTransform(progress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 1.2]);
    const frameColor = useTransform(progress,
        [0.2, 0.4, 0.6, 0.8],
        ["#6366f1", "#a855f7", "#22c55e", "#ef4444"] // Indigo -> Purple -> Green -> Red
    );

    // --- DOT LOGIC ---
    const getDotTransforms = (i: number) => {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);
        const cx = x - gridSize / 2 + 0.5;
        const cy = y - gridSize / 2 + 0.5;

        // --- STATE 1: PROFILE (User Icon Shape) --- (approx 0.2 - 0.4)
        // Simple head and shoulders
        const isHead = Math.sqrt(cx * cx + (cy + 2) * (cy + 2)) < 3.5;
        const isBody = cy > 1 && Math.abs(cx) < (cy);
        const isProfile = isHead || isBody;
        const px1 = cx * gap;
        const py1 = cy * gap;
        const s1 = isProfile ? 1 : 0;

        // --- STATE 2: QR CODE (The Perfect Grid) --- (approx 0.4 - 0.6)
        // Just the grid itself, excluding finder patterns (corners)
        const isFinder = (x < 4 && y < 4) || (x > gridSize - 5 && y < 4) || (x < 4 && y > gridSize - 5);
        const isQR = !isFinder; // We handle finders in the static frame
        const px2 = cx * gap;
        const py2 = cy * gap;
        const s2 = isQR && Math.random() > 0.3 ? 1 : 0; // Randomize for QR look

        // --- STATE 3: ANALYTICS (Bar Chart) --- (approx 0.6 - 0.8)
        // 5 Bars centered
        const barIndex = Math.floor((x + 1) / 3);
        const barHeight = [6, 10, 8, 12, 5][barIndex % 5];
        const isBar = Math.abs(x - gridSize / 2) < 6 && y > (gridSize - barHeight - 2);
        const px3 = (cx) * gap;
        const py3 = (cy) * gap;
        const s3 = isBar ? 1 : 0;

        // --- STATE 4: GLOBAL (Concentric Circles) --- (approx 0.8 - 1.0)
        const dist = Math.sqrt(cx * cx + cy * cy);
        const ring = Math.floor(dist / 2) * 2; // Quantize to rings
        const isRing = Math.abs(dist - ring) < 0.5;
        // Expand outward
        const px4 = cx * gap * (1 + dist * 0.1);
        const py4 = cy * gap * (1 + dist * 0.1);
        const s4 = isRing ? 1 : 0;

        // --- INTERPOLATION ---
        // 0.0 - 0.20: Intro (Fade in Profile)
        // 0.20 - 0.35: Hold Profile
        // 0.35 - 0.45: Profile -> QR
        // 0.45 - 0.60: Hold QR
        // 0.60 - 0.70: QR -> Analytics
        // 0.70 - 0.85: Hold Analytics
        // 0.85 - 0.95: Analytics -> Global

        return {
            x: useTransform(progress, [0.2, 0.45, 0.6, 0.7, 0.9], [px1, px2, px2, px3, px4]),
            y: useTransform(progress, [0.2, 0.45, 0.6, 0.7, 0.9], [py1, py2, py2, py3, py4]),
            scale: useTransform(progress,
                [0, 0.2, 0.35, 0.45, 0.6, 0.7, 0.85, 0.95],
                [0, s1, s1, s2, s2, s3, s3, s4]
            ),
            color: frameColor // Sync with frame
        };
    };

    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">

            {/* --- MASTER QR FRAME (The Artline Anchor) --- */}
            <motion.div
                style={{ opacity: frameOpacity, scale: frameScale, borderColor: frameColor }}
                className="absolute inset-0 border-[2px] border-indigo-500 rounded-3xl p-8 flex flex-col justify-between transition-colors duration-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
            >
                {/* Top Row Markers */}
                <div className="flex justify-between w-full h-24">
                    <FinderPattern color={frameColor} />
                    <FinderPattern color={frameColor} />
                </div>
                {/* Bottom Row Marker */}
                <div className="flex justify-between w-full h-24">
                    <FinderPattern color={frameColor} />
                    {/* Empty corner for alignment */}
                    <div className="w-24 h-24" />
                </div>
            </motion.div>

            {/* --- MORPHING DATA GRID --- */}
            <div className="relative z-10">
                {dots.map((_, i) => {
                    const t = getDotTransforms(i);
                    return (
                        <motion.div
                            key={i}
                            style={{
                                x: t.x,
                                y: t.y,
                                scale: t.scale,
                                backgroundColor: t.color,
                                boxShadow: useTransform(t.color, c => `0 0 8px ${c}`)
                            }}
                            className="absolute w-3 h-3 rounded-sm transition-colors duration-500"
                        />
                    );
                })}
            </div>

            {/* --- SCANNER LINE (Only during QR Phase) --- */}
            <motion.div
                style={{
                    opacity: useTransform(progress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]),
                    top: useTransform(progress, [0.45, 0.55], ["10%", "90%"])
                }}
                className="absolute w-[90%] h-[2px] bg-white shadow-[0_0_20px_white] z-20"
            />

            {/* --- CENTER ICONS (Optional Badge) --- */}
            <motion.div style={{ opacity: useTransform(progress, [0.8, 0.9], [0, 1]), scale: useTransform(progress, [0.8, 1], [0.5, 1.5]) }} className="absolute z-30 text-white">
                <Globe className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </motion.div>

        </div>
    );
}

// Sub-component for the QR Corner Markers (Finder Patterns)
function FinderPattern({ color }: { color: MotionValue<string> }) {
    return (
        <motion.div
            style={{ borderColor: color, boxShadow: useTransform(color, c => `0 0 15px ${c}40`) }} // 40 = 25% opacity
            className="w-24 h-24 border-[6px] rounded-2xl flex items-center justify-center transition-colors duration-500"
        >
            <motion.div
                style={{ backgroundColor: color }}
                className="w-10 h-10 rounded-lg transition-colors duration-500"
            />
        </motion.div>
    );
}
