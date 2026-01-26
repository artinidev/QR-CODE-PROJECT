"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Globe } from 'lucide-react'
import { HeroTech } from '@/components/landing/HeroTech'
import { LandingHeader } from '@/components/navigation/LandingHeader'

export default function TechMotionPage() {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white overflow-hidden selection:bg-blue-500/30">

            <LandingHeader />

            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <HeroTech />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 lg:px-24 pointer-events-none">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth custom easing
                    className="max-w-3xl pointer-events-auto text-center mx-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md mb-8 mx-auto hover:bg-cyan-500/20 transition-colors cursor-default">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-200 tracking-widest uppercase">System Online</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 mix-blend-screen">
                        <span className="block text-white opacity-90">Intelligent</span>
                        <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-white bg-clip-text text-transparent">
                            Traceability.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12 font-light tracking-wide">
                        Deconstructed intelligence for the modern web. <br className="hidden lg:block" />
                        Tracking data flows with precision and elegance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] flex items-center gap-2 group">
                            Explore Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-5 text-white rounded-full font-bold text-lg hover:text-blue-300 transition-all flex items-center gap-2">
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
