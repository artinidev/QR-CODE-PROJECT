'use client';

import { Profile } from '@/types/models';
import React from 'react';
import { Mail, Phone, Linkedin, Share2, MessageCircle, UserPlus, Globe, Twitter, Instagram } from 'lucide-react'; // Added icons
import { ThemeToggle } from '../ThemeToggle';

export interface ThemeConfig {
    id: string;
    name: string;
    primaryColor: string;
    backgroundColor: string; // Hex or gradient string
    backgroundAnimation: 'blob' | 'grid' | 'particles' | 'waves' | 'none';
    cardStyle: 'glass' | 'flat' | 'neumorphic' | 'outline';
    fontFamily?: string;
}

interface ProfileViewProps {
    profile: Profile;
    themeConfig?: ThemeConfig; // Optional config override
}

export default function ProfileView({ profile, themeConfig }: ProfileViewProps) {
    const hasTracked = React.useRef(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);

    // Default Theme Fallback
    const activeTheme: ThemeConfig = themeConfig || {
        id: 'default',
        name: 'Default',
        primaryColor: '#3b82f6', // blue-500
        backgroundColor: 'bg-[#E8EBF2] dark:bg-[#050505]', // Default class-based
        backgroundAnimation: 'blob',
        cardStyle: 'glass',
    };

    React.useEffect(() => {
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
                (position) => {
                    trackScan(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation access denied or failed:", error.message);
                    trackScan();
                }
            );
        } else {
            trackScan();
        }
    }, [profile._id]);

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

    const getWhatsAppUrl = (phone: string) => {
        const cleanNumber = phone.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
    };

    // --- Dynamic Styles ---
    const isGradient = activeTheme.backgroundColor.includes('gradient');
    const containerStyle = isGradient || activeTheme.backgroundColor.startsWith('#')
        ? { background: activeTheme.backgroundColor }
        : {}; // If it's a class string (fallback), we handle it in className, but strictly we passed hex/gradient in new configs

    const mainContainerClass = `min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 font-sans ${!isGradient && !activeTheme.backgroundColor.startsWith('#') ? activeTheme.backgroundColor : ''
        }`;

    // Helper to get card classes based on style
    const getCardClasses = () => {
        switch (activeTheme.cardStyle) {
            case 'flat':
                return 'bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800';
            case 'neumorphic':
                return 'bg-[#E8EBF2] dark:bg-[#1a1b1e] shadow-[20px_20px_60px_#c5c8ce,-20px_-20px_60px_#ffffff] dark:shadow-[5px_5px_15px_#0e0f10,-5px_-5px_15px_#26272c] border-none';
            case 'outline':
                return 'bg-transparent border-2 border-current shadow-none';
            case 'glass':
            default:
                return 'bg-white/40 dark:bg-[#121212]/60 backdrop-blur-3xl border border-white/60 dark:border-white/5 ring-1 ring-white/40 dark:ring-white/10 shadow-2xl';
        }
    };

    return (
        <div className={mainContainerClass} style={containerStyle}>
            {/* Global Animations Styles - Moved to globals.css */}

            {/* --- Background Animations --- */}

            {activeTheme.backgroundAnimation === 'blob' && (
                <>
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-float-1" />
                    <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-300/30 dark:bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none animate-float-2" />
                    <div className="absolute top-[40%] left-[40%] translate-x-[-50%] translate-y-[-50%] w-[300px] h-[300px] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-float-3" />
                </>
            )}

            {activeTheme.backgroundAnimation === 'grid' && (
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(${activeTheme.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${activeTheme.primaryColor} 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        animation: 'grid-move 10s linear infinite'
                    }}
                />
            )}

            {activeTheme.backgroundAnimation === 'particles' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full opacity-30"
                            style={{
                                backgroundColor: activeTheme.primaryColor,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 20 + 5}px`,
                                height: `${Math.random() * 20 + 5}px`,
                                animation: `float-${(i % 3) + 1} ${10 + Math.random() * 10}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {activeTheme.backgroundAnimation === 'waves' && (
                <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none overflow-hidden text-white/10">
                    <svg className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-slow opacity-30" viewBox="0 0 1600 200" preserveAspectRatio="none">
                        <path d="M0,100 C400,150 800,50 1600,100 L1600,200 L0,200 Z" fill={activeTheme.primaryColor} />
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-[200%] h-[80%] animate-wave-fast opacity-50" viewBox="0 0 1600 200" preserveAspectRatio="none" style={{ animationDelay: '-5s' }}>
                        <path d="M0,100 C400,150 800,50 1600,100 L1600,200 L0,200 Z" fill={activeTheme.primaryColor} />
                    </svg>
                </div>
            )}


            {/* Theme Toggle - Only show if no override (or we can show it but it might override the custom theme visually if not handled) */}
            {!themeConfig && (
                <div className="absolute top-6 right-6 z-50">
                    <ThemeToggle />
                </div>
            )}

            {/* Main Card */}
            <div className={`w-full max-w-[380px] rounded-[2.5rem] relative overflow-hidden transition-all duration-300 flex flex-col z-10 ${getCardClasses()}`}>

                {/* Top Actions */}
                <div className="absolute top-5 right-5 z-10">
                    <button className="p-2.5 rounded-full bg-white/30 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-black/40 backdrop-blur-md transition-all text-foreground/80 shadow-sm">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Header */}
                <div className="pt-12 px-8 pb-6 flex flex-col items-center text-center">
                    {/* Avatar with Glow - Color match */}
                    <div className="relative mb-6 group">
                        <div
                            className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-700 blur-xl"
                            style={{ background: `linear-gradient(to bottom, ${activeTheme.primaryColor}20, ${activeTheme.primaryColor}40)` }}
                        ></div>
                        <div className="relative w-32 h-32 rounded-full border-[4px] border-white/90 dark:border-white/10 shadow-xl overflow-hidden bg-white dark:bg-gray-900">
                            {profile.photo ? (
                                <img src={profile.photo} alt={profile.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-4xl font-bold text-white uppercase"
                                    style={{ backgroundColor: activeTheme.primaryColor }}
                                >
                                    {profile.fullName.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">{profile.fullName}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-4">{profile.jobTitle || 'Digital Creator'}</p>

                    {/* Tags / Pills - Dynamic Color */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                        <span
                            className="px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1"
                            style={{
                                backgroundColor: activeTheme.cardStyle === 'outline' ? 'transparent' : `${activeTheme.primaryColor}15`,
                                color: activeTheme.primaryColor,
                                border: activeTheme.cardStyle === 'outline' ? `1px solid ${activeTheme.primaryColor}` : 'none'
                            }}
                        >
                            Verified <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeTheme.primaryColor }} />
                        </span>
                    </div>

                    {/* Quick Stats / Info Row */}
                    <div className="grid grid-cols-3 w-full gap-3 mb-8">
                        {/* Stats items with slight transparency adjustments based on theme */}
                        {['Status', 'Company', 'Rating'].map((label, idx) => (
                            <div key={label} className="flex flex-col items-center p-3 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/5 backdrop-blur-sm shadow-sm">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</span>
                                {idx === 0 && <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Active</span>}
                                {idx === 1 && <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">{profile.company || 'Indie'}</span>}
                                {idx === 2 && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">5.0</span>
                                        <span className="text-yellow-500 text-xs">★</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Primary Actions Row */}
                    <div className="w-full flex flex-col gap-3 mb-6">
                        <button
                            onClick={handleSaveContact}
                            className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                            style={{ backgroundColor: activeTheme.primaryColor }}
                        >
                            <UserPlus className="w-5 h-5" />
                            Save Contact
                        </button>

                        <button
                            onClick={() => setIsLeadModalOpen(true)}
                            className="w-full py-3.5 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white font-bold text-base shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5 opacity-70" />
                            Exchange Contact
                        </button>
                    </div>

                    {/* Contact Grid - Icons */}
                    <div className="grid grid-cols-4 gap-3 w-full">
                        {profile.showPhone && profile.phoneNumbers.length > 0 && (
                            <>
                                <a href={`tel:${profile.phoneNumbers[0]}`} className="contact-icon-btn group" title="Call">
                                    <div className="icon-box group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] opacity-60 mt-1">Call</span>
                                </a>
                                <a href={getWhatsAppUrl(profile.phoneNumbers[0])} target="_blank" rel="noreferrer" className="contact-icon-btn group" title="WhatsApp">
                                    <div className="icon-box group-hover:scale-110 transition-transform">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] opacity-60 mt-1">Chat</span>
                                </a>
                            </>
                        )}
                        {profile.showEmail && profile.email && (
                            <a href={`mailto:${profile.email}`} className="contact-icon-btn group" title="Email">
                                <div className="icon-box group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] opacity-60 mt-1">Email</span>
                            </a>
                        )}
                        {profile.linkedIn && (
                            <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="contact-icon-btn group" title="LinkedIn">
                                <div className="icon-box group-hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] opacity-60 mt-1">LinkedIn</span>
                            </a>
                        )}
                        {/* Fallback/Extra icons if data allows, otherwise empty to keep grid shape */}
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noreferrer" className="contact-icon-btn group" title="Website">
                                <div className="icon-box group-hover:scale-110 transition-transform">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] opacity-60 mt-1">Web</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Styles for the contact buttons to keep JSX clean */}
                <style jsx>{`
                    .contact-icon-btn {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        aspect-ratio: 1/1;
                        border-radius: 1rem;
                        background-color: ${activeTheme.cardStyle === 'glass' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                        transition: all 0.2s;
                    }
                    .contact-icon-btn:hover {
                        background-color: ${activeTheme.cardStyle === 'glass' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
                    }
                    .icon-box {
                        color: ${activeTheme.cardStyle === 'outline' ? 'currentColor' : '#374151'};
                    }
                    @media (prefers-color-scheme: dark) {
                         .icon-box { color: ${activeTheme.cardStyle === 'outline' ? 'currentColor' : '#e5e7eb'}; }
                    }
                 `}</style>

                <div
                    className="h-1.5 w-full opacity-80"
                    style={{ background: `linear-gradient(90deg, ${activeTheme.primaryColor}40, ${activeTheme.primaryColor}, ${activeTheme.primaryColor}40)` }}
                />
            </div>

            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                profileId={profile._id}
                primaryColor={activeTheme.primaryColor}
            />
        </div>
    );
}

// Sub-component for clean code :)
function LeadModal({ isOpen, onClose, profileId, primaryColor }: { isOpen: boolean; onClose: () => void; profileId: any; primaryColor: string }) {
    const [step, setStep] = React.useState<'form' | 'success'>('form');
    const [loading, setLoading] = React.useState(false);
    const [form, setForm] = React.useState({ name: '', email: '', phone: '', note: '' });

    if (!isOpen) return null;

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
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">

                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="p-8">
                        <h3 className="text-xl font-bold text-center mb-2">Let's Connect!</h3>
                        <p className="text-sm text-center text-muted-foreground mb-6">Share your details with me.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold ml-1 uppercase text-muted-foreground">Name</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold ml-1 uppercase text-muted-foreground">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold ml-1 uppercase text-muted-foreground">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="+1 234 567 890"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold ml-1 uppercase text-muted-foreground">Note (Optional)</label>
                                <textarea
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                                    placeholder="Nice meeting you!"
                                    rows={2}
                                    value={form.note}
                                    onChange={e => setForm({ ...form, note: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-bold text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {loading ? 'Sending...' : 'Send Details'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 py-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 animate-in zoom-in spin-in-90 duration-500">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sent Successfully!</h3>
                        <p className="text-muted-foreground text-sm mb-6">Thanks for sharing your details.</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
