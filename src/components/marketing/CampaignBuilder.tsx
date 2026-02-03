'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernDatePicker } from '@/components/ui/ModernDatePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar, Globe, Smartphone, Mail, Share2, MapPin, Tag, Layout, Palette, ArrowRight, Upload, X, BarChart3, Zap, Rocket } from 'lucide-react';
import QRCodeDisplay, { QRCodeHandle } from '@/components/dashboard/QRCodeDisplay';

// Steps Definition
const STEPS = [
    { number: 1, title: 'Basics', icon: Tag },
    { number: 2, title: 'Destination', icon: MapPin },
    { number: 3, title: 'Duration', icon: Calendar },
    { number: 4, title: 'Behavior', icon: Layout },
    { number: 5, title: 'Design', icon: Palette },
    { number: 6, title: 'Review', icon: Check },
];

export default function CampaignBuilder({ onComplete }: { onComplete?: () => void }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        name: '',
        objective: 'website_traffic',
        // Step 2
        destinationType: 'website',
        destinationUrl: '',
        autoUtm: true,
        // Step 3
        durationMode: 'unlimited', // 'unlimited' | 'scheduled'
        startDate: '',
        endDate: '',
        fallbackAction: 'show_expired', // 'show_expired' | 'redirect_fallback'
        fallbackUrl: '',
        // Step 4
        behavior: 'always_primary', // 'always_primary' | 'fallback_expired'
        // Step 5 - Design
        qrColor: '#000000',
        qrBgColor: '#ffffff',
        qrShape: 'square', // 'square' | 'rounded'
        qrLogo: '', // Add logo state
        ctaText: '',
    });

    const qrRef = useRef<QRCodeHandle>(null); // Ref for download actions

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, qrLogo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = (fmt: 'png' | 'svg' | 'jpeg') => {
        qrRef.current?.download(fmt, `qr-${formData.name.replace(/\s+/g, '-').toLowerCase()}`);
    };

    // Helpers
    const handleNext = () => {
        // Validation
        if (currentStep === 1 && !formData.name) return alert('Campaign Name is required');
        if (currentStep === 2 && !formData.destinationUrl) return alert('Destination URL is required');
        if (currentStep === 3 && formData.durationMode === 'scheduled') {
            if (!formData.startDate || !formData.endDate) return alert('Start and End dates are required for scheduled campaigns');
        }

        if (currentStep < 6) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handlePublish = async () => {
        setIsLoading(true);
        try {
            // Construct Final URL with UTM if enabled
            let finalUrl = formData.destinationUrl;
            if (formData.autoUtm && (formData.destinationType === 'website' || formData.destinationType === 'instagram')) {
                const separator = finalUrl.includes('?') ? '&' : '?';
                const utmParams = `utm_source=qr&utm_campaign=${encodeURIComponent(formData.name.replace(/\s+/g, '_').toLowerCase())}`;
                finalUrl = `${finalUrl}${separator}${utmParams}`;
            }

            const payload = {
                name: formData.name,
                targetUrl: finalUrl,
                type: 'marketing-campaign',
                objective: formData.objective,
                startDate: formData.durationMode === 'scheduled' ? formData.startDate : null,
                endDate: formData.durationMode === 'scheduled' ? formData.endDate : null,
                fallbackUrl: formData.fallbackAction === 'redirect_fallback' ? formData.fallbackUrl : null,
                redirectBehavior: formData.behavior,
                color: formData.qrColor,
                isDynamic: true, // Always dynamic for campaigns
                // Design extras could be stored in a meta field if DB supports it, 
                // for now we stick to core fields or assume 'color' covers the basics.
                // ideally: design: { bgColor, logo, shape, cta }
            };

            const res = await fetch('/api/qr-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // If onComplete is provided (tab mode), call it. Otherwise redirect.
                if (onComplete) {
                    onComplete();
                } else {
                    const data = await res.json();
                    router.push('/dashboard/qr');
                }
            } else {
                alert('Failed to create campaign');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating campaign');
        } finally {
            setIsLoading(false);
        }
    };

    // Render Steps
    const renderStepContent = () => {
        const inputClass = "w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium";
        const cardClass = "bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm relative";

        // Helper for section titles within forms
        const SectionTitle = ({ children }: { children: React.ReactNode }) => (
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">{children}</h4>
        );

        switch (currentStep) {
            case 1: // Basics
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div>
                            <SectionTitle>Campaign Details</SectionTitle>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2 ml-1">Campaign Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Summer Sale 2024"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <SectionTitle>Primary Objective</SectionTitle>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'website_traffic', label: 'Website Traffic', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                                    { id: 'product_promotion', label: 'Product Focus', icon: Tag, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                                    { id: 'event_registration', label: 'Event Signups', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                                    { id: 'social_media', label: 'Social Growth', icon: Share2, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
                                    { id: 'contact', label: 'Get in Touch', icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFormData({ ...formData, objective: opt.id })}
                                        className={`px-3 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${formData.objective === opt.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600'
                                            : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${opt.bg} ${opt.color}`}>
                                            <opt.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-medium ${formData.objective === opt.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 2: // Destination
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div>
                            <SectionTitle>Destination</SectionTitle>
                            <div className="flex gap-2 mb-6">
                                {['website', 'instagram', 'whatsapp', 'maps'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, destinationType: type })}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold capitalize transition-all border ${formData.destinationType === type
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                                            : 'bg-white dark:bg-zinc-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 ml-1">Destination URL</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
                                        {formData.destinationType === 'instagram' ? 'instagram.com/' : formData.destinationType === 'whatsapp' ? 'wa.me/' : 'https://'}
                                    </div>
                                    <input
                                        type="url"
                                        value={formData.destinationUrl}
                                        onChange={e => setFormData({ ...formData, destinationUrl: e.target.value })}
                                        placeholder="your-link"
                                        className={`${inputClass} pl-32`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${formData.autoUtm ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-gray-50 border-gray-100 dark:bg-zinc-900/50 dark:border-white/5'}`}>
                            <input
                                id="utm"
                                type="checkbox"
                                checked={formData.autoUtm}
                                onChange={e => setFormData({ ...formData, autoUtm: e.target.checked })}
                                className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <div>
                                <label htmlFor="utm" className="font-bold text-gray-900 dark:text-white text-sm block mb-1">Smart UTM Tracking</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically appends tracking parameters (source, medium, campaign) so you can track performance in Google Analytics.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3: // Duration
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div>
                            <SectionTitle>Timeline</SectionTitle>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { id: 'unlimited', title: 'Unlimited', desc: 'Active forever', icon: Zap },
                                    { id: 'scheduled', title: 'Scheduled', desc: 'Set date range', icon: Calendar },
                                ].map(mode => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setFormData({ ...formData, durationMode: mode.id })}
                                        className={`p-6 rounded-3xl border text-center transition-all ${formData.durationMode === mode.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600'
                                            : 'border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-800 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${formData.durationMode === mode.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                            <mode.icon className="w-6 h-6" />
                                        </div>
                                        <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{mode.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{mode.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.durationMode === 'scheduled' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5">
                                <ModernDatePicker
                                    label="Start Date"
                                    value={formData.startDate}
                                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                                    placeholder="Select start date"
                                />
                                <ModernDatePicker
                                    label="End Date"
                                    value={formData.endDate}
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                    placeholder="Select end date"
                                    minDate={formData.startDate ? new Date(formData.startDate) : undefined}
                                />
                            </motion.div>
                        )}

                        <div>
                            <SectionTitle>Expiration Fallback</SectionTitle>
                            <div className="space-y-4">
                                <select
                                    value={formData.fallbackAction}
                                    onChange={e => setFormData({ ...formData, fallbackAction: e.target.value as any })}
                                    className={inputClass}
                                >
                                    <option value="show_expired">Show "Campaign Expired" Page</option>
                                    <option value="redirect_fallback">Redirect to a different URL</option>
                                </select>

                                {formData.fallbackAction === 'redirect_fallback' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <input
                                            type="url"
                                            value={formData.fallbackUrl}
                                            onChange={e => setFormData({ ...formData, fallbackUrl: e.target.value })}
                                            placeholder="https://fallback-url.com"
                                            className={`${inputClass} border-l-4 border-l-orange-500`}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4: // Behavior
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <SectionTitle>Scanning Behavior</SectionTitle>
                        {[
                            { id: 'always_primary', title: 'Standard Redirect', desc: 'Always redirect to the primary link (ignores expiration unless strictly enforced).', icon: ArrowRight },
                            { id: 'fallback_expired', title: 'Smart Expiration', desc: 'Redirect to primary link when active, and fallback link when expired.', icon: Zap },
                        ].map(b => (
                            <button
                                key={b.id}
                                onClick={() => setFormData({ ...formData, behavior: b.id as any })}
                                className={`w-full text-left p-6 rounded-3xl border transition-all hover:shadow-md ${formData.behavior === b.id
                                    ? 'border-indigo-600 bg-white dark:bg-zinc-800 ring-2 ring-indigo-600'
                                    : 'border-gray-200 dark:border-white/5 bg-white dark:bg-zinc-800 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-xl text-white ${formData.behavior === b.id ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                        <b.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{b.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                );
            case 5: // Design
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div>
                                <SectionTitle>Visual Style</SectionTitle>
                                <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-gray-100 dark:border-white/5 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">QR Dots Color</label>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-gray-400 bg-white dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-gray-800">{formData.qrColor}</span>
                                            <input
                                                type="color"
                                                value={formData.qrColor}
                                                onChange={e => setFormData({ ...formData, qrColor: e.target.value })}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Background</label>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-gray-400 bg-white dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-gray-800">{formData.qrBgColor}</span>
                                            <input
                                                type="color"
                                                value={formData.qrBgColor}
                                                onChange={e => setFormData({ ...formData, qrBgColor: e.target.value })}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">QR Logo (Optional)</label>
                                        <div className="flex items-center gap-4">
                                            {formData.qrLogo ? (
                                                <div className="relative w-12 h-12 rounded-lg border border-gray-200 p-1 bg-white">
                                                    <img src={formData.qrLogo} alt="Logo" className="w-full h-full object-contain" />
                                                    <button
                                                        onClick={() => setFormData({ ...formData, qrLogo: '' })}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                    <Upload className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <SectionTitle>Shape & CTA</SectionTitle>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {['square', 'rounded'].map(shape => (
                                        <button
                                            key={shape}
                                            onClick={() => setFormData({ ...formData, qrShape: shape as any })}
                                            className={`px-4 py-3 rounded-xl border capitalize font-bold transition-all ${formData.qrShape === shape
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900'
                                                : 'bg-white dark:bg-zinc-800 border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {shape}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Button Text (CTA)</label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                                        className={inputClass}
                                        placeholder="Scan Me"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview - Clean White Card */}
                        <div className="relative flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-white/5 border-dashed">
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-6 relative">
                                <QRCodeDisplay
                                    ref={qrRef}
                                    data={formData.destinationUrl || 'https://example.com'}
                                    width={220}
                                    height={220}
                                    color={formData.qrColor}
                                    backgroundColor={formData.qrBgColor}
                                    dotsType={formData.qrShape as any}
                                    image={formData.qrLogo}
                                />
                                {formData.ctaText && (
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                        {formData.ctaText}
                                    </div>
                                )}
                            </div>

                            {/* Download Actions */}
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => handleDownload('png')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50">PNG</button>
                                <button onClick={() => handleDownload('svg')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50">SVG</button>
                                <button onClick={() => handleDownload('jpeg')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50">JPG</button>
                            </div>

                            <div className="text-center space-y-1 mt-4">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">Live Preview</div>
                                <div className="text-xs text-gray-500">Scan to test. Link is dynamic.</div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 6: // Review
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-6">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center shrink-0">
                                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">Campaign Ready for Launch</h3>
                                <p className="text-gray-600 dark:text-gray-400">Your configuration is valid. Review the summary below before going live.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-gray-100 dark:border-white/5 space-y-6">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Configuration Summary</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Campaign Name', value: formData.name },
                                        { label: 'Objective', value: formData.objective.replace('_', ' '), capitalize: true },
                                        { label: 'Destination', value: formData.destinationUrl, truncate: true },
                                        { label: 'Behavior', value: formData.behavior.replace('_', ' '), capitalize: true },
                                        { label: 'Duration Model', value: formData.durationMode, capitalize: true },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                                            <span className={`font-bold text-gray-900 dark:text-white ${item.capitalize ? 'capitalize' : ''} ${item.truncate ? 'truncate max-w-[180px]' : ''}`}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-white/5">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                                    <QRCodeDisplay
                                        data={formData.destinationUrl || 'https://example.com'}
                                        width={160}
                                        height={160}
                                        color={formData.qrColor}
                                        backgroundColor={formData.qrBgColor}
                                        dotsType={formData.qrShape as any}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Progress Steps (Clean White Card) */}
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm sticky top-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2 text-lg">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        Setup Progress
                    </h3>
                    <div className="space-y-1 relative">
                        {/* Connector Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-zinc-700 -z-10" />

                        {STEPS.map((step, idx) => {
                            const isCompleted = step.number < currentStep;
                            const isActive = step.number === currentStep;
                            const Icon = step.icon;

                            return (
                                <div key={step.number} className="group flex items-center gap-4 relative py-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10 border-4 border-white dark:border-zinc-800 ${isActive
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-110 shadow-md'
                                        : isCompleted
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-400'
                                        }`}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : isActive ? <Icon className="w-4 h-4" /> : step.number}
                                    </div>
                                    <div className={`flex flex-col transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                                        <span className={`font-bold text-base ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: Form Area (Clean White Card) */}
            <div className="lg:col-span-8">
                <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm min-h-[550px] flex flex-col justify-between">

                    {/* Header */}
                    <div className="mb-8 pb-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Step 0{currentStep}</div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{STEPS[currentStep - 1].title}</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative z-10 mb-8">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {currentStep === 6 ? (
                            <button
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="px-8 py-3 rounded-xl font-bold bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                {isLoading ? 'Launching...' : 'Launch Campaign'}
                                {!isLoading && <Rocket className="w-4 h-4" />}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 rounded-xl font-bold bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
