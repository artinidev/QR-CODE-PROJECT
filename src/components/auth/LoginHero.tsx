'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LoginHero = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-blue-50">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Glowing Orbs (Adapted for Light Mode) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-200/40 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-200/40 rounded-full blur-[100px]"
                />
            </div>

            {/* Central 3D QR Representation */}
            <div className="relative z-10 w-96 h-96 [perspective:1000px]">
                <motion.div
                    initial={{ rotateX: 0, rotateY: 0 }}
                    animate={{
                        rotateX: [0, 10, 0, -10, 0],
                        rotateY: [0, 15, 0, -15, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* The QR Card - Light Mode Glass */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl flex items-center justify-center">
                        <div className="w-64 h-64 bg-white p-4 rounded-xl shadow-inner relative overflow-hidden border border-slate-100">
                            {/* QR Pattern (Stylized) */}
                            <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-2">
                                {[...Array(36)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: Math.random() > 0.3 ? 1 : 0.2 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: Math.random() * 2
                                        }}
                                        className={`rounded-md ${
                                            // Corner markers
                                            (i === 0 || i === 5 || i === 30)
                                                ? 'bg-blue-600 col-span-2 row-span-2'
                                                : (i === 1 || i === 6 || i === 7 || i === 31 || i === 32 || i === 33 || i === 36 || i === 35)
                                                    ? 'hidden'
                                                    : 'bg-slate-800'
                                            }`}
                                    />
                                ))}
                                {/* Re-injecting simple markers roughly */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-4 border-blue-600 rounded-lg bg-white">
                                    <div className="absolute inset-2 bg-blue-600 rounded"></div>
                                </div>
                                <div className="absolute top-4 right-4 w-16 h-16 border-4 border-blue-600 rounded-lg bg-white">
                                    <div className="absolute inset-2 bg-blue-600 rounded"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-blue-600 rounded-lg bg-white">
                                    <div className="absolute inset-2 bg-blue-600 rounded"></div>
                                </div>
                            </div>

                            {/* Scanning Beam */}
                            <motion.div
                                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-12 bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0 blur-sm pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Floating Elements behind/around */}
                    <motion.div
                        animate={{ translateZ: [20, 60, 20] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 backdrop-blur-md rounded-xl border border-blue-200/50 shadow-lg"
                    />
                    <motion.div
                        animate={{ translateZ: [-20, -60, -20] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-5 -left-10 w-32 h-16 bg-purple-500/10 backdrop-blur-md rounded-xl border border-purple-200/50 shadow-lg"
                    />
                </motion.div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-12 left-0 w-full text-center z-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-slate-900 mb-2 tracking-tight"
                >
                    Professional Digital Identity
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-slate-500 font-medium"
                >
                    Connect. Share. Grow.
                </motion.p>
            </div>

            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
        </div>
    );
};
