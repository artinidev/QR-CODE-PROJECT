'use client';

import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = 'scanex_tutorial_completed';
const PAGE_TUTORIAL_PREFIX = 'scanex_page_tutorial_';

export function useTutorial() {
    const [runTutorial, setRunTutorial] = useState(false);

    useEffect(() => {
        // Check if tutorial has been completed
        const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
        if (!completed) {
            // Delay tutorial start by 1 second for better UX
            const timer = setTimeout(() => {
                setRunTutorial(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeTutorial = () => {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
        setRunTutorial(false);
    };

    const skipTutorial = () => {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'skipped');
        setRunTutorial(false);
    };

    const restartTutorial = () => {
        localStorage.removeItem(TUTORIAL_STORAGE_KEY);
        setRunTutorial(true);
    };

    const resetTutorial = () => {
        localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    };

    return {
        runTutorial,
        completeTutorial,
        skipTutorial,
        restartTutorial,
        resetTutorial,
    };
}

// Hook for page-specific tutorials
export function usePageTutorial(pageName: string) {
    const [runPageTutorial, setRunPageTutorial] = useState(false);

    useEffect(() => {
        const pageKey = `${PAGE_TUTORIAL_PREFIX}${pageName}`;
        const completed = localStorage.getItem(pageKey);

        if (!completed) {
            // Delay tutorial start by 500ms for better UX
            const timer = setTimeout(() => {
                setRunPageTutorial(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [pageName]);

    const completePageTutorial = () => {
        const pageKey = `${PAGE_TUTORIAL_PREFIX}${pageName}`;
        localStorage.setItem(pageKey, 'true');
        setRunPageTutorial(false);
    };

    const skipPageTutorial = () => {
        const pageKey = `${PAGE_TUTORIAL_PREFIX}${pageName}`;
        localStorage.setItem(pageKey, 'skipped');
        setRunPageTutorial(false);
    };

    const restartPageTutorial = () => {
        const pageKey = `${PAGE_TUTORIAL_PREFIX}${pageName}`;
        localStorage.removeItem(pageKey);
        setRunPageTutorial(true);
    };

    return {
        runPageTutorial,
        completePageTutorial,
        skipPageTutorial,
        restartPageTutorial,
    };
}
