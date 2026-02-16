'use client';

import { useTutorial } from '@/hooks/useTutorial';
import OnboardingTutorial from './OnboardingTutorial';
import { firstTimeUserSteps } from './tutorialSteps';

export default function DashboardTutorialWrapper() {
    const { runTutorial, completeTutorial } = useTutorial();

    return (
        <OnboardingTutorial
            run={runTutorial}
            onComplete={completeTutorial}
            steps={firstTimeUserSteps}
        />
    );
}
