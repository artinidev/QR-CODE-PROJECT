'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, Styles } from 'react-joyride';

interface OnboardingTutorialProps {
    run: boolean;
    onComplete: () => void;
    steps: Step[];
}

export default function OnboardingTutorial({ run, onComplete, steps }: OnboardingTutorialProps) {
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        setRunTour(run);
    }, [run]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            onComplete();
        }
    };

    // Dark mode styles matching SCANEX platform with Poppins font
    const customStyles: Partial<Styles> = {
        options: {
            primaryColor: '#6366f1', // Indigo-600
            textColor: '#f1f5f9', // Slate-100
            backgroundColor: '#18181b', // Zinc-900
            overlayColor: 'rgba(0, 0, 0, 0.85)', // Darker overlay
            arrowColor: '#18181b',
            zIndex: 10000,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            mixBlendMode: 'normal',
        },
        tooltip: {
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.2)',
            backgroundColor: '#18181b',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            minWidth: '320px',
        },
        tooltipContainer: {
            textAlign: 'left',
        },
        tooltipTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#f1f5f9',
            padding: '0',
            fontFamily: "'Poppins', sans-serif",
        },
        tooltipContent: {
            fontSize: '14px',
            lineHeight: '1.6',
            padding: '0',
            color: '#cbd5e1',
            fontFamily: "'Poppins', sans-serif",
        },
        tooltipFooter: {
            padding: '16px 0 0 0',
            marginTop: '0',
        },
        buttonNext: {
            backgroundColor: '#6366f1',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6), 0 4px 6px -1px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif",
        },
        buttonBack: {
            color: '#94a3b8',
            marginRight: '10px',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
            fontFamily: "'Poppins', sans-serif",
        },
        buttonSkip: {
            color: '#64748b',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: "'Poppins', sans-serif",
        },
        spotlight: {
            borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.85), 0 0 40px rgba(99, 102, 241, 0.3)',
        },
    };

    return (
        <Joyride
            steps={steps}
            run={runTour}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={customStyles}
            locale={{
                back: '← Back',
                close: 'Close',
                last: 'Finish',
                next: 'Next →',
                skip: 'Skip',
            }}
            floaterProps={{
                disableAnimation: false,
                styles: {
                    arrow: {
                        length: 10,
                        spread: 16,
                    },
                },
            }}
            spotlightClicks={false}
            disableScrolling={false}
            scrollOffset={100}
        />
    );
}
