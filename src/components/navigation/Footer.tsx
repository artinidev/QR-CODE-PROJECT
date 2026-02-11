'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Facebook, Heart } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-[#050510] border-t border-slate-200 dark:border-white/5 py-16 px-8 font-sans transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/scanex-icon.png" alt="SCANEX" className="w-10 h-10" />
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SCANEX</span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-sm">
                            The all-in-one platform for next-generation digital identity. Create stunning profiles, dynamic QR codes, and track analytics in real-time.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Linkedin} />
                            <SocialLink href="#" icon={Facebook} />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="/dashboard/profile">Profiles</FooterLink></li>
                            <li><FooterLink href="/dashboard/qr">QR Studio</FooterLink></li>
                            <li><FooterLink href="/dashboard/analytics">Analytics</FooterLink></li>
                            <li><FooterLink href="/pricing">Pricing</FooterLink></li>
                            <li><FooterLink href="/features">Features</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="/about">About Us</FooterLink></li>
                            <li><FooterLink href="/careers">Careers</FooterLink></li>
                            <li><FooterLink href="/blog">Blog</FooterLink></li>
                            <li><FooterLink href="/contact">Contact</FooterLink></li>
                            <li><FooterLink href="/partners">Partners</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="/help">Help Center</FooterLink></li>
                            <li><FooterLink href="/api-docs">API Documentation</FooterLink></li>
                            <li><FooterLink href="/community">Community</FooterLink></li>
                            <li><FooterLink href="/status">System Status</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 4 */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
                            <li><FooterLink href="/cookies">Cookie Settings</FooterLink></li>
                            <li><FooterLink href="/security">Security</FooterLink></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <p>&copy; {currentYear} ScanEx. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Algeria
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
            {children}
        </Link>
    );
}
