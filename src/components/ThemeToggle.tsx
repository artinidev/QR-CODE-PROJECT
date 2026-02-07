"use client"

import React, { useEffect, useState } from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/10 animate-pulse" />
        )
    }

    const toggleTheme = () => {
        if (resolvedTheme === 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {resolvedTheme === 'dark' ? (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="w-5 h-5" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
