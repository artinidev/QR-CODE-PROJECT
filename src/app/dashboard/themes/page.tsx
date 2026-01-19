'use client';

import React, { useState } from 'react';
import { Palette, Check, Layout, Smartphone, Laptop, Sparkles, Droplets, Grid, Waves as WaveIcon, Monitor, Save, Share2, Maximize2 } from 'lucide-react';
import ProfileView, { ThemeConfig } from '@/components/profile/ProfileView';
import { Profile } from '@/types/models';

// --- Dummy Data for Preview ---
const DUMMY_PROFILE: Profile = {
    // @ts-ignore
    _id: 'preview-id',
    // @ts-ignore
    userId: 'user-id',
    username: 'johndoe',
    fullName: 'Alex Anderson',
    jobTitle: 'Product Designer',
    company: 'Creative Studio',
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    email: 'alex@example.com',
    phoneNumbers: ['+1 (555) 123-4567'],
    linkedIn: 'linkedin.com/in/alexanderson',
    website: 'alex.design',
    showEmail: true,
    showPhone: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    // @ts-ignore
    groups: []
};

// --- Presets ---
const THEME_PRESETS: ThemeConfig[] = [
    {
        id: 'modern-blue',
        name: 'Modern Blue',
        primaryColor: '#3b82f6',
        backgroundColor: 'bg-[#E8EBF2] dark:bg-[#050505]',
        backgroundAnimation: 'blob',
        cardStyle: 'glass'
    },
    {
        id: 'midnight-purple',
        name: 'Midnight Purple',
        primaryColor: '#8b5cf6',
        backgroundColor: 'bg-slate-950 text-white',
        backgroundAnimation: 'particles',
        cardStyle: 'glass'
    },
    {
        id: 'forest-minimal',
        name: 'Forest Minimal',
        primaryColor: '#059669',
        backgroundColor: 'bg-stone-50',
        backgroundAnimation: 'none',
        cardStyle: 'flat'
    },
    {
        id: 'neon-cyber',
        name: 'Neon Cyber',
        primaryColor: '#f472b6',
        backgroundColor: 'bg-gray-900',
        backgroundAnimation: 'grid',
        cardStyle: 'outline'
    },
    {
        id: 'ocean-waves',
        name: 'Ocean Waves',
        primaryColor: '#0ea5e9',
        backgroundColor: 'bg-cyan-950',
        backgroundAnimation: 'waves',
        cardStyle: 'glass'
    }
];

const BACKGROUND_OPTIONS = [
    { id: 'bg-white', name: 'Clean White', value: 'bg-white' },
    { id: 'bg-slate-950', name: 'Deep Dark', value: 'bg-slate-950 text-white' },
    { id: 'gradient-sunset', name: 'Sunset', value: 'background: linear-gradient(to bottom right, #ff9966, #ff5e62)' },
    { id: 'gradient-ocean', name: 'Ocean', value: 'background: linear-gradient(to bottom right, #2193b0, #6dd5ed)' },
    { id: 'gradient-purple', name: 'Electric Purple', value: 'background: linear-gradient(to bottom right, #654ea3, #eaafc8)' },
];

export default function ThemeStudioPage() {
    const [currentConfig, setCurrentConfig] = useState<ThemeConfig>(THEME_PRESETS[0]);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

    const handlePresetSelect = (preset: ThemeConfig) => {
        setCurrentConfig({ ...preset });
    };

    const updateConfig = (key: keyof ThemeConfig, value: any) => {
        setCurrentConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-4 md:p-8 flex flex-col overflow-hidden h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Theme Studio</h1>
                    <p className="text-muted-foreground mt-1">Design a profile that stands out. Real-time preview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-border text-foreground rounded-full font-medium shadow-sm hover:bg-accent transition-all text-sm">
                        <Share2 className="w-4 h-4" />
                        Share Layout
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

                {/* Left Column: Controls (Scrollable) */}
                <div className="lg:col-span-7 xl:col-span-8 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">

                    {/* 1. Presets Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-border/60 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold">Theme Presets</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {THEME_PRESETS.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handlePresetSelect(theme)}
                                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${currentConfig.id === theme.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                        <div
                                            className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white ring-2 ring-white dark:ring-zinc-800"
                                            style={{ backgroundColor: theme.primaryColor }}
                                        >
                                            <Palette className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-sm block">{theme.name}</span>
                                            <span className="text-xs text-muted-foreground capitalize">{theme.cardStyle}</span>
                                        </div>
                                    </div>
                                    {currentConfig.id === theme.id && (
                                        <div className="absolute top-3 right-3 text-primary bg-background rounded-full p-1 shadow-sm">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                        {/* 2. Colors & Style */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-border/60 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Palette className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold">Visual Style</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Primary Accent</label>
                                    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-xl border border-border/50">
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={currentConfig.primaryColor}
                                                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0 overflow-hidden ring-2 ring-white shadow-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-mono font-medium">{currentConfig.primaryColor}</div>
                                            <div className="text-[10px] text-muted-foreground">Select to change</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Card Appearance</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['glass', 'flat', 'neumorphic', 'outline'].map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => updateConfig('cardStyle', style)}
                                                className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all capitalize ${currentConfig.cardStyle === style
                                                        ? 'bg-foreground text-background border-foreground shadow-md'
                                                        : 'bg-muted/30 border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Living Background */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-border/60 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold">Background</h3>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Animation Effect</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'none', label: 'Static' },
                                        { id: 'blob', label: 'Blobs' },
                                        { id: 'grid', label: 'Grid' },
                                        { id: 'particles', label: 'Particles' },
                                        { id: 'waves', label: 'Waves' }
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            // @ts-ignore
                                            onClick={() => updateConfig('backgroundAnimation', item.id)}
                                            className={`py-2 text-xs font-medium rounded-lg border transition-all ${currentConfig.backgroundAnimation === item.id
                                                    ? 'border-primary text-primary bg-primary/5 ring-1 ring-primary/20 font-bold'
                                                    : 'border-border/50 hover:border-border hover:bg-muted/50'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mt-4">Base Canvas</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {BACKGROUND_OPTIONS.map((bg) => (
                                        <button
                                            key={bg.id}
                                            onClick={() => updateConfig('backgroundColor', bg.value)}
                                            className={`w-12 h-12 rounded-full border-2 flex-shrink-0 relative transition-all ${currentConfig.backgroundColor === bg.value
                                                    ? 'border-primary scale-110 shadow-md ring-2 ring-primary/20 ring-offset-2'
                                                    : 'border-border/20 hover:border-border hover:scale-105'
                                                }`}
                                        >
                                            <div
                                                className={`absolute inset-0 rounded-full ${bg.value.includes('gradient') ? '' : bg.value}`}
                                                style={bg.value.includes('gradient') ? { background: bg.value.replace('background: ', '') } : {}}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Live Preview (Sticky/Fixed in Bento Grid) */}
                <div className="lg:col-span-5 xl:col-span-4 h-full min-h-[500px]">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-border/80 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 h-full flex flex-col relative overflow-hidden ring-1 ring-black/5">

                        {/* Toolbar */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-1 rounded-full border border-black/5 shadow-sm">
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`p-2 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-black text-white shadow-md' : 'text-muted-foreground hover:bg-black/5'}`}
                                title="Mobile View"
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`p-2 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-black text-white shadow-md' : 'text-muted-foreground hover:bg-black/5'}`}
                                title="Desktop View"
                            >
                                <Laptop className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Preview State Indicator */}
                        <div className="absolute bottom-6 right-6 z-20">
                            <div className="bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live Preview
                            </div>
                        </div>

                        {/* The Stage */}
                        <div className="flex-1 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-950/50 p-8 md:p-12 transition-all duration-500 relative">
                            {/* Subtle Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                            {/* Device Mockup */}
                            <div
                                className={`relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl ${previewMode === 'mobile'
                                        ? 'w-[340px] h-[700px] rounded-[3.5rem] border-[10px] border-[#18181b] bg-black ring-1 ring-black/10'
                                        : 'w-full h-full max-h-[700px] rounded-2xl border-[10px] border-[#18181b] bg-black ring-1 ring-black/10'
                                    }`}
                            >
                                {/* Mobile Notch */}
                                {previewMode === 'mobile' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-[#18181b] rounded-b-2xl z-30 pointer-events-none" />
                                )}

                                {/* Screen */}
                                <div className={`w-full h-full overflow-hidden bg-white relative ${previewMode === 'mobile' ? 'rounded-[3rem]' : 'rounded-lg'}`}>
                                    <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                        <ProfileView
                                            profile={DUMMY_PROFILE}
                                            themeConfig={currentConfig}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
