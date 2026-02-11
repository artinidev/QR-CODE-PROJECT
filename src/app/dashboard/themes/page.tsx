'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Palette, Check, Layout, Smartphone, Laptop, Sparkles, Droplets, Grid, Waves as WaveIcon, Monitor, Save, Share2, Maximize2, Briefcase, Plus, Trash2 } from 'lucide-react';
import ProfileView from '@/components/profile/ProfileView';
import { ThemeConfig, BrandKit, Profile } from '@/types/models';

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
    const [selectedPresetId, setSelectedPresetId] = useState<string>(THEME_PRESETS[0].id || 'modern-blue');

    // Brand Kit State
    const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
    const [kitName, setKitName] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        fetch('/api/brand-kits').then(res => res.json()).then(data => {
            if (Array.isArray(data)) setBrandKits(data);
        });
    }, []);

    const handleSaveKit = async () => {
        if (!kitName) return;
        setLoading(true);
        try {
            const res = await fetch('/api/brand-kits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: kitName, config: currentConfig, isDefault: false })
            });
            if (res.ok) {
                const newKit = await res.json();
                setBrandKits([newKit, ...brandKits]);
                setShowNameModal(false);
                setKitName('');
                setSelectedPresetId(newKit._id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateKit = async (kitId: string) => {
        setLoading(true);
        try {
            await fetch(`/api/brand-kits/${kitId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config: currentConfig })
            });
            // Update local state
            setBrandKits(prev => prev.map(k => k._id === kitId ? { ...k, config: currentConfig } : k));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteKit = async (e: React.MouseEvent, kitId: string) => {
        e.stopPropagation();
        if (!confirm('Delete this Brand Kit?')) return;
        try {
            await fetch(`/api/brand-kits/${kitId}`, { method: 'DELETE' });
            setBrandKits(prev => prev.filter(k => k._id !== kitId));
            if (selectedPresetId === kitId) {
                setSelectedPresetId(THEME_PRESETS[0].id!);
                setCurrentConfig(THEME_PRESETS[0]);
            }
        } catch (e) { console.error(e); }
    };

    const handlePresetSelect = (preset: ThemeConfig) => {
        if (preset.id) setSelectedPresetId(preset.id);
        setCurrentConfig({ ...preset });
    };

    const updateConfig = (key: keyof ThemeConfig, value: any) => {
        setCurrentConfig(prev => ({ ...prev, [key]: value }));
        // Don't deselect completely, just indicate modification if needed
        // But for now, keep selectedPresetId pointing to the kit being edited if applicable
        // Or specific logic: if editing a Preset, switch to Custom. If editing a Kit, keep Kit ID.
        if (selectedPresetId && !brandKits.find(k => k._id === selectedPresetId)) {
            // If currently selected is a PRESET (not a kit ID), then changing config switches to 'custom'
            // Unless we want to support "Unsaved changes" state.
            // For simplicity: If it is a PRESET, switch to 'custom'. If it is a KIT, keep it (to allow Update).
            const isPreset = THEME_PRESETS.some(p => p.id === selectedPresetId);
            if (isPreset) setSelectedPresetId('custom');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-6 md:p-8 flex flex-col h-screen overflow-hidden">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Brand Kit Studio</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your company's visual identity and profile templates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-full font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-sm">
                        <Share2 className="w-4 h-4" />
                        Share Layout
                    </button>
                    <button
                        onClick={() => {
                            if (brandKits.find(k => k._id === selectedPresetId)) {
                                handleUpdateKit(selectedPresetId);
                            } else {
                                setShowNameModal(true);
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:scale-105 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>

                    {/* Name Modal */}
                    {showNameModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                                <h3 className="text-lg font-bold mb-4">Name your Brand Kit</h3>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Sales Team Kit"
                                    value={kitName}
                                    onChange={(e) => setKitName(e.target.value)}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setShowNameModal(false)}
                                        className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                                    >Cancel</button>
                                    <button
                                        onClick={handleSaveKit}
                                        disabled={!kitName || loading}
                                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Create Kit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">

                {/* Left Column: Controls (Scrollable) */}
                <div className="lg:col-span-7 xl:col-span-8 overflow-y-auto pr-2 custom-scrollbar pb-20 space-y-8">

                    {/* 0. Brand Kits */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Brand Kits</h3>
                            </div>
                            <button
                                onClick={() => { setSelectedPresetId('custom'); setCurrentConfig(THEME_PRESETS[0]); }}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> New
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            {brandKits.map((kit) => {
                                const isSelected = selectedPresetId === kit._id?.toString();
                                return (
                                    <div
                                        key={kit._id?.toString()}
                                        onClick={() => { setSelectedPresetId(kit._id!.toString()); setCurrentConfig(kit.config); }}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all relative group ${isSelected
                                            ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-500 ring-1 ring-indigo-500/50'
                                            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">{kit.name}</span>
                                            {isSelected && kit._id && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => handleDeleteKit(e, kit._id!.toString())}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateKit(kit._id!.toString()); }}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg font-bold text-xs"
                                                    >
                                                        {loading ? '...' : 'Update'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {brandKits.length === 0 && (
                                <div className="text-center p-6 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 text-sm">
                                    No brand kits saved yet.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 1. Theme Presets */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Start with a Preset</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {THEME_PRESETS.map((theme) => {
                                    const isSelected = selectedPresetId === theme.id;
                                    return (
                                        <motion.button
                                            key={theme.id}
                                            layout
                                            onClick={() => handlePresetSelect(theme)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{
                                                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                                scale: { duration: 0.2 }
                                            }}
                                            className={`relative group p-4 rounded-2xl border text-left overflow-hidden ${isSelected
                                                ? 'bg-white dark:bg-zinc-800 border-blue-500 ring-1 ring-blue-500/50 shadow-xl shadow-blue-500/10'
                                                : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4 relative z-10">
                                                <motion.div
                                                    layoutId={`icon-${theme.id}`}
                                                    className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center text-white ring-2 ring-white dark:ring-zinc-800"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                >
                                                    <Palette className="w-6 h-6" />
                                                </motion.div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-bold text-gray-900 dark:text-white block mb-0.5">{theme.name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-700'}`}></span>
                                                        {theme.cardStyle}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-full"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            {/* Subtle Background Accent */}
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="highlight"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.5 }}
                                                    className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10 z-0"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">


                        {/* 2. Company Identity */}
                        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Company Identity</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Logo URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={currentConfig.logoUrl || ''}
                                        onChange={(e) => updateConfig('logoUrl', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Displayed at top of profile.</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cover Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={currentConfig.coverUrl || ''}
                                        onChange={(e) => updateConfig('coverUrl', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 3. Visual Style */}
                        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                    <Layout className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Card & Color</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Accent Color</label>
                                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-950/50 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                value={currentConfig.primaryColor}
                                                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                                                className="w-12 h-12 rounded-full cursor-pointer border-0 p-0 overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-md transition-transform hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-mono font-medium text-gray-900 dark:text-white">{currentConfig.primaryColor}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Primary brand color</div>
                                        </div>
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10"
                                            style={{ backgroundColor: currentConfig.primaryColor }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Card Style</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['glass', 'flat', 'neumorphic', 'outline'].map((style) => (
                                            <motion.button
                                                key={style}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => updateConfig('cardStyle', style)}
                                                className={`px-4 py-3 text-sm font-bold rounded-xl border capitalize relative overflow-hidden ${currentConfig.cardStyle === style
                                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-lg'
                                                    : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {style}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Background */}
                        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Atmosphere</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Animation Effect</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'none', label: 'Static' },
                                            { id: 'blob', label: 'Blobs' },
                                            { id: 'grid', label: 'Grid' },
                                            { id: 'particles', label: 'Particles' },
                                            { id: 'waves', label: 'Waves' }
                                        ].map((item) => (
                                            <motion.button
                                                key={item.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                // @ts-ignore
                                                onClick={() => updateConfig('backgroundAnimation', item.id)}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${currentConfig.backgroundAnimation === item.id
                                                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 ring-1 ring-orange-500/20'
                                                    : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {item.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Base Canvas</label>
                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                        {BACKGROUND_OPTIONS.map((bg) => (
                                            <motion.button
                                                key={bg.id}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updateConfig('backgroundColor', bg.value)}
                                                className={`w-14 h-14 rounded-2xl border-2 flex-shrink-0 relative ${currentConfig.backgroundColor === bg.value
                                                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20 ring-offset-2 dark:ring-offset-zinc-900'
                                                    : 'border-transparent hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute inset-1 rounded-xl ${!bg.value.includes('gradient') ? bg.value : ''}`}
                                                    style={bg.value.includes('gradient') ? { background: bg.value.replace('background: ', '') } : {}}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Right Column: Live Preview (Sticky/Fixed) */}
                <div className="lg:col-span-5 xl:col-span-4 h-full min-h-[500px]">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 h-full flex flex-col relative overflow-hidden ring-1 ring-black/5">

                        {/* Toolbar */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-lg shadow-black/5">
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`p-2.5 rounded-full transition-all duration-300 ${previewMode === 'mobile'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                    }`}
                                title="Mobile View"
                            >
                                <Smartphone className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`p-2.5 rounded-full transition-all duration-300 ${previewMode === 'desktop'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-105'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                    }`}
                                title="Desktop View"
                            >
                                <Laptop className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview State Indicator */}
                        <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
                            <div className="bg-black/80 dark:bg-white/10 text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/10 shadow-xl">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                LIVE PREVIEW
                            </div>
                        </div>

                        {/* The Stage */}
                        <div className="flex-1 flex items-center justify-center bg-gray-50/50 dark:bg-zinc-950/50 p-8 md:p-12 relative transition-colors duration-500">
                            {/* Subtle Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]"></div>

                            {/* Device Mockup */}
                            <motion.div
                                layout
                                transition={{
                                    layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } // Buttery Smooth Curve
                                }}
                                className={`relative shadow-2xl transition-shadow duration-500 border-[12px] border-[#121212] bg-black ring-1 ring-white/10 shadow-black/40 ${previewMode === 'mobile'
                                    ? 'w-[360px] h-[720px] rounded-[3.5rem]'
                                    : 'w-full h-full max-h-[700px] rounded-2xl'
                                    }`}
                            >
                                {/* Mobile Notch */}
                                {previewMode === 'mobile' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-[#121212] rounded-b-3xl z-30 pointer-events-none" />
                                )}

                                {/* Screen */}
                                <div className={`w-full h-full overflow-hidden bg-white dark:bg-zinc-950 relative ${previewMode === 'mobile' ? 'rounded-[2.8rem]' : 'rounded-lg'}`}>
                                    <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                        <ProfileView
                                            profile={DUMMY_PROFILE}
                                            themeConfig={currentConfig}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
