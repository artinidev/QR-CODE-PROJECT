"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { Hero3D } from '@/components/landing/Hero3D'
import { LandingHeader } from '@/components/navigation/LandingHeader'

export default function SmartQRPage() {
    return (
        <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden selection:bg-cyan-500/30">

            <LandingHeader />

            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Hero3D />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 lg:px-24 pointer-events-none">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="max-w-2xl pointer-events-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md mb-8">
                        <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-xs font-bold text-cyan-200 tracking-wide uppercase">Next Gen Identity</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1] mb-6 bg-gradient-to-r from-white via-cyan-100 to-cyan-500 bg-clip-text text-transparent">
                        Smart <br />
                        Context.
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-10 font-medium">
                        Intelligent QR codes that adapt to user context, location, and device in real-time. Secure, dynamic, and beautiful.
                    </p>

                    <div className="flex items-center gap-4">
                        <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 group">
                            Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg border border-white/10 transition-all backdrop-blur-sm">
                            Learn More
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
