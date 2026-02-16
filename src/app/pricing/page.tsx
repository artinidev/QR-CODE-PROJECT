'use client';

import { LandingHeader } from '@/components/navigation/LandingHeader';
import { Footer } from '@/components/navigation/Footer';
import { Check, Shield, Zap, Database, Sparkles, ChevronDown, Infinity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
    const { t } = useLanguage();
    const [isYearly, setIsYearly] = useState(false);

    const features = {
        free: [
            "Unlimited static QR codes",
            "Basic design customization",
            "PNG download",
            "No editing after creation",
            "No analytics",
        ],
        starter: [
            "5 dynamic QR codes",
            "Editable URL anytime",
            "Basic scan analytics",
            "PDF & file QR codes",
            "Password protection",
            "Custom landing pages",
        ],
        business: [
            "50 dynamic QR codes",
            "Advanced analytics dashboard",
            "Expiry date control",
            "Custom domains",
            "Priority support",
            "Team collaboration",
        ],
        pro: [
            "Unlimited dynamic QR codes",
            "Full API access",
            "White-label solution",
            "SSO & advanced security",
            "Dedicated account manager",
            "Custom integrations",
        ]
    };

    const faqs = [
        {
            q: "What happens after my 7-day trial ends?",
            a: "Your dynamic QR codes will be paused, but not deleted. Simply upgrade to any plan to reactivate them instantly. Your data is safe!"
        },
        {
            q: "Do I need a credit card to start the trial?",
            a: "No! We believe in value-first. Try all dynamic features for 7 days without entering any payment information. Upgrade only when you're ready."
        },
        {
            q: "Can I use the free plan forever?",
            a: "Absolutely! Create unlimited static QR codes forever at no cost. Upgrade to dynamic features only when you need editing, analytics, and advanced capabilities."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept CCP (Algérie Poste), BaridiMob, and bank transfers. Online payment options are coming soon."
        },
        {
            q: "Can I switch plans later?",
            a: "Yes! Upgrade or downgrade anytime from your dashboard. Changes take effect immediately."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050510] text-slate-900 dark:text-white selection:bg-indigo-500/30 font-sans transition-colors duration-300">
            <LandingHeader />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-500 uppercase bg-indigo-500/10 rounded-full">
                        Simple, Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                        Start Free, Upgrade When Ready
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Try all features for 7 days. No credit card required. Experience the power before you pay.
                    </p>

                    {/* Billing Period Toggle */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold transition-colors ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 32 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 left-1 w-6 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-md"
                            />
                        </button>
                        <span className={`text-sm font-semibold transition-colors ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            Yearly
                        </span>
                        {isYearly && (
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="ml-2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full"
                            >
                                Save 20%
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-32 items-start">
                    {/* Free Forever Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-colors shadow-lg dark:shadow-none"
                    >
                        <div className="absolute -top-3 left-6">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                🟢 FREE FOREVER
                            </span>
                        </div>
                        <div className="mb-8 mt-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                                <Infinity className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Free</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">Perfect for individuals and side projects.</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">forever</span>
                        </div>
                        <Link href="/auth/signup">
                            <button className="w-full py-4 px-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors mb-8 shadow-lg shadow-emerald-500/30">
                                Get Started
                            </button>
                        </Link>
                        <ul className="space-y-4">
                            {features.free.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors shadow-lg dark:shadow-none"
                    >
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6 text-slate-700 dark:text-white">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Starter</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">For freelancers and small businesses.</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    ${isYearly ? '7' : '9'}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">/ month</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                    $84/year (save $24)
                                </p>
                            )}
                        </div>
                        <Link href="/auth/signup">
                            <button className="w-full py-4 px-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/20 transition-colors mb-8">
                                Start Free Trial
                            </button>
                        </Link>
                        <div className="mb-6 text-center">
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                🟡 7-day free trial • No credit card
                            </span>
                        </div>
                        <ul className="space-y-4">
                            {features.starter.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="p-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Business Plan - POPULAR */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative p-8 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/40 dark:to-indigo-900/10 rounded-[2.5rem] border border-indigo-200 dark:border-indigo-500/50 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20 transform lg:-translate-y-4"
                    >
                        <div className="absolute -top-5 left-0 right-0 flex justify-center">
                            <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/40 uppercase tracking-widest">
                                MOST POPULAR
                            </span>
                        </div>
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Business</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">For growing teams and agencies.</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    ${isYearly ? '23' : '29'}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">/ month</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                    $276/year (save $72)
                                </p>
                            )}
                        </div>
                        <Link href="/auth/signup">
                            <button className="w-full py-4 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors mb-8 shadow-lg shadow-indigo-500/30">
                                Start Free Trial
                            </button>
                        </Link>
                        <div className="mb-6 text-center">
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                🟡 7-day free trial • No credit card
                            </span>
                        </div>
                        <ul className="space-y-4">
                            {features.business.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors shadow-lg dark:shadow-none"
                    >
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6 text-slate-700 dark:text-white">
                                <Database className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Pro</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">For enterprises and large teams.</p>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    ${isYearly ? '63' : '79'}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">/ month</span>
                            </div>
                            {isYearly && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                    $756/year (save $192)
                                </p>
                            )}
                        </div>
                        <Link href="/contact">
                            <button className="w-full py-4 px-4 bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors mb-8">
                                Contact Sales
                            </button>
                        </Link>
                        <div className="mb-6 text-center">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Custom pricing available
                            </span>
                        </div>
                        <ul className="space-y-4">
                            {features.pro.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="p-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Value Proposition Banner */}
                <div className="max-w-5xl mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative p-8 md:p-12 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-[2.5rem] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10 text-center text-white">
                            <Sparkles className="w-12 h-12 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold mb-4">Experience First, Pay Later</h2>
                            <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
                                Start with unlimited free static QR codes. When you need dynamic features, try them all for 7 days—no credit card required. Only upgrade when you're ready.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                    <Check className="w-4 h-4" />
                                    <span>No credit card needed</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                    <Check className="w-4 h-4" />
                                    <span>Cancel anytime</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                    <Check className="w-4 h-4" />
                                    <span>Data never deleted</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-slate-500 dark:text-slate-400">Everything you need to know about pricing and trials.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 overflow-hidden transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-semibold text-lg text-slate-900 dark:text-white">{question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
