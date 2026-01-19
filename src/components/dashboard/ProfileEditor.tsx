'use client';

import React, { useState, useEffect } from 'react';
import { Profile } from '@/types/models';
import { Loader2, Save, User, Mail, Globe, Linkedin, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface ProfileEditorProps {
    profileId: string | null;
    onBack: () => void;
    onSaveSuccess: () => void;
}

export default function ProfileEditor({ profileId, onBack, onSaveSuccess }: ProfileEditorProps) {
    const [profile, setProfile] = useState<Partial<Profile> | null>(null);
    const [loading, setLoading] = useState(!!profileId);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        } else {
            // Initialize empty profile for creation
            setProfile({
                fullName: '',
                jobTitle: '',
                company: '',
                email: '',
                phoneNumbers: [],
                showEmail: true,
                showPhone: true,
                website: '',
                linkedIn: ''
            });
            setLoading(false);
        }
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/profiles/${profileId}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else {
                setMessage({ type: 'error', text: 'Failed to load profile.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const url = profileId ? `/api/profiles/${profileId}` : '/api/profiles';
            const method = profileId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: profileId ? 'Profile updated successfully!' : 'Profile created successfully!' });
                if (!profileId) {
                    // small delay then go back
                    setTimeout(onSaveSuccess, 1000);
                }
            } else {
                const errData = await res.json();
                setMessage({ type: 'error', text: errData.error || 'Failed to save profile.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleToggle = (name: string) => {
        // @ts-ignore
        setProfile(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, phoneNumbers: [e.target.value] }));
    };

    if (loading) return (
        <div className="flex items-center justify-center p-8 bg-card rounded-xl border border-border shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
        </div>
    );

    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-accent/20 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-background transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {profileId ? 'Edit Profile' : 'Create New Profile'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {profileId ? 'Update your personal information and contact details.' : 'Fill in the details for your new digital card.'}
                    </p>
                </div>
            </div>

            {message && (
                <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal Details
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                                {profile?.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-xs font-medium">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) {
                                                alert('File size must be less than 2MB');
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfile(prev => ({ ...prev, photo: reader.result as string }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium">Profile Photo</h4>
                            <p className="text-xs text-muted-foreground">This will be displayed on your public QR profile.</p>
                            {profile?.photo && (
                                <button
                                    type="button"
                                    onClick={() => setProfile(prev => ({ ...prev, photo: '' }))}
                                    className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                                >
                                    Remove Photo
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={profile?.fullName || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <input
                                type="text"
                                value={profile?.username || (profileId ? '' : 'Auto-generated')}
                                disabled
                                className="w-full rounded-lg bg-muted border border-transparent px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={profile?.jobTitle || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={profile?.company || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border my-6"></div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Email Address</label>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('showEmail')}
                                    className={`text-xs flex items-center gap-1 transition-colors ${profile?.showEmail ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                >
                                    {profile?.showEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {profile?.showEmail ? 'Visible on profile' : 'Hidden from profile'}
                                </button>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={profile?.email || ''}
                                onChange={handleChange}
                                className={`w-full rounded-lg bg-background border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${profile?.showEmail ? 'border-primary/50' : 'border-input'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Phone Number</label>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('showPhone')}
                                    className={`text-xs flex items-center gap-1 transition-colors ${profile?.showPhone ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                >
                                    {profile?.showPhone ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {profile?.showPhone ? 'Visible on profile' : 'Hidden from profile'}
                                </button>
                            </div>
                            <input
                                type="tel"
                                value={profile?.phoneNumbers?.[0] || ''}
                                onChange={handlePhoneChange}
                                className={`w-full rounded-lg bg-background border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${profile?.showPhone ? 'border-primary/50' : 'border-input'}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border my-6"></div>

                {/* Social Links */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Social Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website URL</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    name="website"
                                    value={profile?.website || ''}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg bg-background border border-input pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    name="linkedIn"
                                    value={profile?.linkedIn || ''}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full rounded-lg bg-background border border-input pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
