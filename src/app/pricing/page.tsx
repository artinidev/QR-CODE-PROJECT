'use client';

import { LandingHeader } from '@/components/navigation/LandingHeader';
import { Footer } from '@/components/navigation/Footer';
import { Check, Shield, Zap, Database, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
    const { t } = useLanguage();

    const features = {
        starter: [
            t.pricing.features.unlimited_qr,
            t.pricing.features.scans_100,
            t.pricing.features.basic_analytics,
            t.pricing.features.standard_support,
        ],
        pro: [
            t.pricing.features.dynamic_qr,
            t.pricing.features.scans_10k,
            t.pricing.features.advanced_analytics,
            t.pricing.features.priority_support,
            t.pricing.features.custom_domains,
        ],
        business: [
            t.pricing.features.unlimited_dynamic,
            t.pricing.features.scans_unlimited,
            t.pricing.features.api_access,
            t.pricing.features.sso,
            t.pricing.features.dedicated_manager,
        ]
    };

    const faqs = [
        {
            q: "Can I cancel my subscription?",
            a: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period."
        },
        {
            q: "Do you offer monthly plans?",
            a: "Currently, we only offer annual plans to provide the best value. This allows us to invest more in features and stability."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept CCP (Algérie Poste), BaridiMob, and bank transfers. Online payments coming soon."
        },
        {
            q: "Can I switch plans later?",
            a: "Absolutely! You can upgrade or downgrade your plan at any time from your dashboard settings."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050510] text-slate-900 dark:text-white selection:bg-indigo-500/30 font-sans transition-colors duration-300">
            <LandingHeader />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-500 uppercase bg-indigo-500/10 rounded-full">
                        {t.pricing.hero.badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                        {t.pricing.hero.title}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t.pricing.hero.subtitle}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-32 items-start">
                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors shadow-lg dark:shadow-none"
                    >
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6 text-slate-700 dark:text-white">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{t.pricing.plans.starter.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{t.pricing.plans.starter.desc}</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{t.pricing.plans.starter.price}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">{t.pricing.plans.starter.period}</span>
                        </div>
                        <button className="w-full py-4 px-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/20 transition-colors mb-8">
                            {t.pricing.plans.starter.cta}
                        </button>
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

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative p-8 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/40 dark:to-indigo-900/10 rounded-[2.5rem] border border-indigo-200 dark:border-indigo-500/50 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20 transform md:-translate-y-4"
                    >
                        <div className="absolute -top-5 left-0 right-0 flex justify-center">
                            <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/40 uppercase tracking-widest">
                                {t.pricing.plans.pro.badge}
                            </span>
                        </div>
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{t.pricing.plans.pro.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{t.pricing.plans.pro.desc}</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{t.pricing.plans.pro.price}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">{t.pricing.plans.pro.period}</span>
                        </div>
                        <button className="w-full py-4 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors mb-8 shadow-lg shadow-indigo-500/30">
                            {t.pricing.plans.pro.cta}
                        </button>
                        <ul className="space-y-4">
                            {features.pro.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Business Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors shadow-lg dark:shadow-none"
                    >
                        <div className="mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6 text-slate-700 dark:text-white">
                                <Database className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{t.pricing.plans.business.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{t.pricing.plans.business.desc}</p>
                        </div>
                        <div className="mb-8 flex items-baseline">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{t.pricing.plans.business.price}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">{t.pricing.plans.business.period}</span>
                        </div>
                        <button className="w-full py-4 px-4 bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors mb-8">
                            {t.pricing.plans.business.cta}
                        </button>
                        <ul className="space-y-4">
                            {features.business.map((feature, i) => (
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

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-slate-500 dark:text-slate-400">Everything you need to know about the product and billing.</p>
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
