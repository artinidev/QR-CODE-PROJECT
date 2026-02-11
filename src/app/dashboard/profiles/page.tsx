import React, { Suspense } from 'react';
import ProfileManager from '@/components/dashboard/ProfileManager';
import { Loader2 } from 'lucide-react';

export const metadata = {
    title: 'My Profiles - SCANEX',
};

export default function ProfilesPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <ProfileManager />
        </Suspense>
    );
}
