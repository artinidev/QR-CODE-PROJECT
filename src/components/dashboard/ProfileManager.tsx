'use client';

import React, { useState } from 'react';
import ProfileEditor from '@/components/dashboard/ProfileEditor';
import ProfileList from '@/components/dashboard/ProfileList';
import QRDownload from '@/components/dashboard/QRDownload';

export default function ProfileManager() {
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
    const [previewProfileId, setPreviewProfileId] = useState<string | null>(null);

    const handleCreate = () => {
        setCurrentProfileId(null);
        setView('create');
    };

    const handleEdit = (id: string) => {
        setCurrentProfileId(id);
        setView('edit');
    };

    const handlePreview = (id: string) => {
        setPreviewProfileId(id);
    };

    const handleBack = () => {
        setView('list');
        setCurrentProfileId(null);
    };

    return (
        <>
            {view === 'list' && (
                <ProfileList
                    onCreateProfile={handleCreate}
                    onEditProfile={handleEdit}
                    onSelectProfile={handlePreview}
                    selectedProfileId={previewProfileId}
                />
            )}

            {(view === 'create' || view === 'edit') && (
                <div className="p-8 max-w-4xl mx-auto">
                    <ProfileEditor
                        profileId={currentProfileId}
                        onBack={handleBack}
                        onSaveSuccess={handleBack}
                    />
                </div>
            )}
        </>
    );
}
