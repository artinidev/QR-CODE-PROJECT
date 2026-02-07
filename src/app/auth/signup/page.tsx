'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, Lock, ChevronLeft, Github, Chrome, Apple } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { dictionary } from '@/lib/i18n/dictionaries';

export default function SignupPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const t = dictionary[language].auth;
    const isRTL = language === 'ar';

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [verificationToken, setVerificationToken] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setVerificationToken(data.verificationToken);
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Create Password & Account
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, verificationToken }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#0A0A0A] text-white overflow-hidden font-sans" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Left Panel - Visuals */}
            <div className="hidden lg:flex w-[50%] relative bg-[#050505] items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />

                <div className="relative z-10 max-w-lg text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Join the Future.
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Create an account to access powerful tools, real-time analytics, and enterprise-grade security.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Verification Form */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center items-center p-8 lg:p-16 relative">

                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            PDI Platform
                        </Link>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {step === 1 && t.signup_title}
                            {step === 2 && "Check your email"}
                            {step === 3 && "Secure your account"}
                        </h2>
                        <p className="text-slate-400">
                            {step === 1 && t.signup_subtitle}
                            {step === 2 && `We sent a code to ${email}`}
                            {step === 3 && "Create a strong password to finish."}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-indigo-500' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOtp} className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">{t.email_label}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-500"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isLoading ? 'Sending...' : <>Continue <ArrowRight size={18} /></>}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp} className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Verification Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full text-center tracking-[1em] text-2xl py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white font-mono"
                                        placeholder="000000"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 px-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-[2] py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isLoading ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSignup} className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">{t.password_label}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isLoading ? 'Creating Account...' : <>{t.submit_btn} <Check size={18} /></>}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                            {error}
                        </motion.div>
                    )}

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-400">
                            {t.already_account}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
