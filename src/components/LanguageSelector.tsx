"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const { language, setLanguage } = useLanguage()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const currentLang = languages.find(l => l.code === language)

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Select Language"
            >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#050510] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code as any)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${language === lang.code
                                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-lg leading-none">{lang.flag}</span>
                                    {lang.label}
                                </span>
                                {language === lang.code && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
