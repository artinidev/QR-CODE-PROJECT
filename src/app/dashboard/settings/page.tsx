'use client';

import React from 'react';
import { User, Bell, Shield, CreditCard, LogOut, Mail, Lock, Check } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="flex-1 overflow-auto p-4 lg:p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account preferences and subscription.</p>
                </div>

                <div className="grid gap-8">
                    {/* Account Section */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Profile Details</h2>
                                <p className="text-sm text-muted-foreground">Update your personal information.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <User className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        defaultValue="john.doe@example.com"
                                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <Mail className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-full shadow hover:opacity-90 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none" />

                        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Subscription</h2>
                                <p className="text-sm text-muted-foreground">Manage your billing and plan.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                            <div>
                                <p className="font-bold text-foreground">Free Plan</p>
                                <p className="text-sm text-muted-foreground">Limited to 3 profiles</p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>

                    {/* Security & Notifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Password */}
                        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <h2 className="font-bold">Security</h2>
                            </div>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 text-left text-sm group">
                                    <span className="font-medium text-foreground">Change Password</span>
                                    <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 text-left text-sm group">
                                    <span className="font-medium text-foreground">Two-Factor Auth</span>
                                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Enabled</span>
                                </button>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <h2 className="font-bold">Notifications</h2>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Email alerts for new scans', checked: true },
                                    { label: 'Weekly analytics report', checked: true },
                                    { label: 'Marketing newsletters', checked: false },
                                ].map((item, i) => (
                                    <label key={i} className="flex items-center justify-between p-2 cursor-pointer group">
                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.checked ? 'bg-primary' : 'bg-muted'}`}>
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : ''}`} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-border/50">
                        <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/50 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
