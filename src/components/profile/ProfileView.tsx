'use client';

import { Profile, ThemeConfig } from '@/types/models';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Linkedin, Share2, MessageCircle, UserPlus, Globe, Twitter, Instagram, ChevronRight, Download, Send } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

// Removed local ThemeConfig definition

interface ProfileViewProps {
    profile: Profile;
    themeConfig?: ThemeConfig;
}

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 50, damping: 15 }
    }
};

export default function ProfileView({ profile, themeConfig }: ProfileViewProps) {
    const hasTracked = useRef(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Default Theme
    const activeTheme: ThemeConfig = themeConfig || {
        id: 'default',
        name: 'Default',
        primaryColor: '#6366f1', // Indigo-500
        backgroundColor: 'bg-slate-50 dark:bg-[#0f172a]', // Responsive Background
        backgroundAnimation: 'blob',
        cardStyle: 'glass',
    };

    // --- Tracking Logic ---
    useEffect(() => {
        if (hasTracked.current) return;
        hasTracked.current = true;

        const trackScan = async (lat?: number, lng?: number) => {
            try {
                await fetch('/api/track-scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: profile._id,
                        latitude: lat,
                        longitude: lng,
                        deviceType: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
                    })
                });
            } catch (e) {
                console.error("Tracking failed", e);
            }
        };

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => trackScan(position.coords.latitude, position.coords.longitude),
                (error) => {
                    console.warn("Geolocation denied:", error.message);
                    trackScan();
                }
            );
        } else {
            trackScan();
        }
    }, [profile._id]);

    // --- Actions ---
    const handleSaveContact = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
TITLE:${profile.jobTitle || ''}
ORG:${profile.company || ''}
${profile.showEmail ? `EMAIL:${profile.email}` : ''}
${profile.showPhone && profile.phoneNumbers.length > 0 ? `TEL:${profile.phoneNumbers[0]}` : ''}
URL:${profile.website || ''}
${profile.linkedIn ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedIn}` : ''}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.fullName.replace(/\s+/g, '_')}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const getWhatsAppUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;

    // --- Styles Calculation ---
    // If backgroundColor is a hex, use style. If utility class, use className.
    const isHexBg = activeTheme.backgroundColor.startsWith('#') || activeTheme.backgroundColor.includes('gradient');
    const containerStyle = isHexBg ? { background: activeTheme.backgroundColor } : {};
    const containerClass = `min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30 ${!isHexBg ? activeTheme.backgroundColor : ''}`;

    return (
        <motion.div
            ref={containerRef}
            className={containerClass}
            style={containerStyle}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* --- Dynamic Backgrounds --- */}
            <BackgroundEffects theme={activeTheme} />

            {/* --- Theme Toggle (if standalone) --- */}
            {!themeConfig && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute top-6 right-6 z-50"
                >
                    <ThemeToggle />
                </motion.div>
            )}

            {/* --- Main Profile Card --- */}
            <motion.div
                className="w-full max-w-[400px] relative z-10 perspective-1000"
                variants={itemVariants}
            // Optional 3D tilt effect on mouse move could be added here
            >
                {/* Glass Card Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden backdrop-blur-3xl bg-white/70 dark:bg-black/40 border border-white/50 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/40 dark:ring-white/5 transition-all duration-500">

                    {/* Header Image / Gradient Area */}
                    <div className="h-40 relative overflow-hidden">
                        {activeTheme.coverUrl ? (
                            <img src={activeTheme.coverUrl} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />
                                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
                            </>
                        )}

                        {/* Company Logo */}
                        {activeTheme.logoUrl && (
                            <div className="absolute top-4 left-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/20">
                                <img src={activeTheme.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                            </div>
                        )}

                        {/* Share Button (Top Right) */}
                        <div className="absolute top-5 right-5 z-20">
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: profile.fullName,
                                            text: `Connect with ${profile.fullName}`,
                                            url: window.location.href,
                                        }).catch(console.error);
                                    } else {
                                        // Fallback usually copy to clipboard
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all shadow-lg active:scale-95"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Body */}
                    <div className="px-8 pb-10 -mt-20 relative flex flex-col items-center">

                        {/* Avatar */}
                        <motion.div
                            className="relative mb-6 group"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            {/* Glow Ring */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Actual Image */}
                            <div className="relative w-36 h-36 rounded-full border-[4px] border-white dark:border-[#1a1b1e] shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                                {profile.photo ? (
                                    <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                                        {profile.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-[#1a1b1e] rounded-full" title="Active" />
                        </motion.div>

                        {/* Name & Title */}
                        <div className="text-center mb-8 space-y-1">
                            <motion.h1
                                className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
                                variants={itemVariants}
                            >
                                {profile.fullName}
                            </motion.h1>
                            <motion.p
                                className="text-lg text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center gap-2"
                                variants={itemVariants}
                            >
                                {profile.jobTitle && <span>{profile.jobTitle}</span>}
                                {profile.company && (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <span className="opacity-90">{profile.company}</span>
                                    </>
                                )}
                            </motion.p>
                        </div>

                        {/* Primary Buttons */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveContact}
                                className="py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25 flex flex-col items-center justify-center gap-1 transition-colors"
                            >
                                <UserPlus className="w-6 h-6 mb-0.5" />
                                <span className="text-xs uppercase tracking-wide opacity-90">Save Contact</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsLeadModalOpen(true)}
                                className="py-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-bold shadow-sm flex flex-col items-center justify-center gap-1 transition-all"
                            >
                                <Send className="w-6 h-6 mb-0.5" />
                                <span className="text-xs uppercase tracking-wide opacity-90">Connect</span>
                            </motion.button>
                        </div>

                        {/* Contact & Social Grid */}
                        <motion.div
                            className="w-full bg-slate-50/50 dark:bg-white/5 rounded-3xl p-2 border border-slate-200/60 dark:border-white/5 grid grid-cols-4 gap-2 backdrop-blur-sm"
                            variants={itemVariants}
                        >
                            {renderSocialButton(profile.phoneNumbers[0], 'phone', profile.showPhone)}
                            {renderSocialButton(profile.email, 'email', profile.showEmail)}
                            {renderSocialButton(profile.phoneNumbers[0], 'whatsapp', profile.showPhone)}
                            {renderSocialButton(profile.linkedIn, 'linkedin')}
                            {renderSocialButton(profile.website, 'website')}
                            {renderSocialButton(profile.twitter, 'twitter')}
                            {renderSocialButton(profile.instagram, 'instagram')}
                            {/* Empty slots filler could be added here to maintain grid shape if needed */}
                        </motion.div>

                    </div>

                    {/* Footer Branding */}
                    <div className="py-4 text-center border-t border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 backdrop-blur-sm">
                        <a href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            <span className="bg-indigo-500 text-white rounded-md px-1 py-0.5 text-[10px]">SCANEX</span>
                            <span>Create your bio link</span>
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {isLeadModalOpen && (
                    <LeadModal
                        isOpen={isLeadModalOpen}
                        onClose={() => setIsLeadModalOpen(false)}
                        profileId={profile._id}
                        primaryColor={activeTheme.primaryColor}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );

    function renderSocialButton(value: string | undefined, type: string, condition: boolean = true) {
        if (!value || !condition) return null;

        let href = value;
        let Icon = Globe;
        let label = 'Link';
        let colorClass = 'hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10';

        switch (type) {
            case 'phone':
                href = `tel:${value}`;
                Icon = Phone;
                label = 'Call';
                colorClass = 'hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10';
                break;
            case 'email':
                href = `mailto:${value}`;
                Icon = Mail;
                label = 'Email';
                colorClass = 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10';
                break;
            case 'whatsapp':
                href = getWhatsAppUrl(value);
                Icon = MessageCircle;
                label = 'Chat';
                colorClass = 'hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10';
                break;
            case 'linkedin':
                Icon = Linkedin;
                label = 'LinkedIn';
                colorClass = 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10';
                break;
            case 'twitter':
                Icon = Twitter;
                label = 'Twitter';
                colorClass = 'hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10';
                break;
            case 'instagram':
                Icon = Instagram;
                label = 'Insta';
                colorClass = 'hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-500/10';
                break;
            default:
                break;
        }

        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl text-slate-500 dark:text-slate-400 transition-colors ${colorClass}`}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
            >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium opacity-80">{label}</span>
            </motion.a>
        );
    }
}

// --- Background Effects Component ---
function BackgroundEffects({ theme }: { theme: ThemeConfig }) {
    if (theme.backgroundAnimation === 'blob') {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[20%] w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, -100, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 50, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]"
                />
            </div>
        );
    }

    if (theme.backgroundAnimation === 'grid') {
        return (
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(${theme.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${theme.primaryColor} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
        );
    }

    return null;
}

// --- Lead Modal Component ---
function LeadModal({ isOpen, onClose, profileId, primaryColor }: { isOpen: boolean; onClose: () => void; profileId: any; primaryColor: string }) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, profileId })
            });
            if (res.ok) {
                setStep('success');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-[#1a1b1e] w-full max-w-sm rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10"
            >
                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Let's Connect!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Share your details with me directly.</p>
                        </div>

                        <div className="space-y-4">
                            <Input label="Name" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} required placeholder="John Doe" />
                            <Input label="Email" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} type="email" placeholder="john@example.com" />
                            <Input label="Phone" value={form.phone} onChange={(v: string) => setForm({ ...form, phone: v })} type="tel" placeholder="+1234567890" />
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                style={{ backgroundColor: primaryColor || '#6366f1' }}
                            >
                                {loading ? <span className="animate-pulse">Sending...</span> : <>Send <Send className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Sent Successfully!</h3>
                        <p className="text-gray-500 mb-6 text-sm">I'll get back to you soon.</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all"
                            style={{ backgroundColor: primaryColor || '#6366f1' }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

function Input({ label, value, onChange, type = 'text', required = false, placeholder }: any) {
    return (
        <div>
            <label className="text-xs font-bold ml-1 uppercase text-gray-400 dark:text-gray-500 mb-1 block">{label}</label>
            <input
                type={type}
                required={required}
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
