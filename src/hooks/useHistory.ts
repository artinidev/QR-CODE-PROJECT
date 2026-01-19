import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const state = history[currentIndex];

    const setState = useCallback((newState: T | ((prev: T) => T)) => {
        setHistory((prevHistory) => {
            const currentHistory = prevHistory.slice(0, currentIndex + 1);
            const actualNewState = typeof newState === 'function' ? (newState as Function)(currentHistory[currentHistory.length - 1]) : newState;
            return [...currentHistory, actualNewState];
        });
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, [currentIndex]);

    const undo = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }, []);

    const redo = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex < history.length - 1 ? prevIndex + 1 : prevIndex));
    }, [history.length]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    return { state, setState, undo, redo, canUndo, canRedo };
}
