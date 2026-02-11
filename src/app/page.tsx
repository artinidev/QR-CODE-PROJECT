'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Zap, ArrowRight, UserCircle2, QrCode, BarChart3, MapPin } from 'lucide-react';
import { Footer } from '@/components/navigation/Footer';
import { CinematicVisuals } from '@/components/landing/CinematicVisuals';
import { LandingHeader } from '@/components/navigation/LandingHeader';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Track scroll of the giant container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={containerRef} className="bg-white dark:bg-[#050505] min-h-[500vh] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30">

      <LandingHeader />

      <div className="w-full flex">

        {/* --- LEFT: SCROLLABLE CONTENT (5x screen height) --- */}
        <div className="w-full lg:w-1/2 flex flex-col relative z-20">

          {/* SECTION 1: INTRO (0 - 0.2) */}
          <Section
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            badge={t.home.hero_badge}
            title={t.home.hero_title}
            highlight={t.home.hero_highlight}
            desc={t.home.hero_desc}
          />

          {/* SECTION 2: PROFILES (0.2 - 0.4) */}
          <Section
            icon={<UserCircle2 className="w-6 h-6 text-blue-500" />}
            badge={t.home.profiles_badge}
            title={t.home.profiles_title}
            highlight={t.home.profiles_highlight}
            desc={t.home.profiles_desc}
            color="text-blue-600 dark:text-blue-500"
          />

          {/* SECTION 3: SMART QR (0.4 - 0.6) */}
          <Section
            icon={<QrCode className="w-6 h-6 text-purple-500" />}
            badge={t.home.smart_badge}
            title={t.home.smart_title}
            highlight={t.home.smart_highlight}
            desc={t.home.smart_desc}
            color="text-purple-600 dark:text-purple-500"
          />

          {/* SECTION 4: ANALYTICS (0.6 - 0.8) */}
          <Section
            icon={<BarChart3 className="w-6 h-6 text-green-500" />}
            badge={t.home.analytics_badge}
            title={t.home.analytics_title}
            highlight={t.home.analytics_highlight}
            desc={t.home.analytics_desc}
            color="text-green-600 dark:text-green-500"
          />

          {/* SECTION 5: LIVE TRACKING (0.8 - 1.0) */}
          <Section
            icon={<MapPin className="w-6 h-6 text-red-500" />}
            badge={t.home.tracking_badge}
            title={t.home.tracking_title}
            highlight={t.home.tracking_highlight}
            desc={t.home.tracking_desc}
            color="text-red-600 dark:text-red-500"
          />

        </div>

        {/* --- RIGHT: STICKY VISUALS --- */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 bg-slate-50/50 dark:bg-zinc-900/50 overflow-hidden border-l border-slate-200 dark:border-white/5">

          <div className="absolute inset-0 flex items-center justify-center perspective-1000">
            <CinematicVisuals progress={smoothProgress} />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- CONTENT SECTION COMPONENT ---
function Section({ icon, badge, title, highlight, desc, cta, color = "text-indigo-600 dark:text-indigo-500" }: any) {
  const { t } = useLanguage();
  return (
    <div className="h-screen flex flex-col justify-center px-8 lg:pl-24 lg:pr-12 border-b border-transparent">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ margin: "-20%" }}
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold mb-8 w-fit backdrop-blur-sm">
          {icon}
          <span className="dark:text-white">{badge}</span>
        </div>

        <h2 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          {title} <br />
          <span className={color}>{highlight}</span>
        </h2>

        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mb-10 font-medium">
          {desc}
        </p>

        <button onClick={cta} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group">
          {t.common.get_started} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
