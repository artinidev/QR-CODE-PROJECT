'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Profile, Group, BrandKit } from '@/types/models';
import { Search, Filter, Plus, Trash2, Edit2, RotateCcw, MoreVertical, Calendar, Folder, FolderPlus, Check, X, Share2, QrCode, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import QRDownload from './QRDownload'; // Ensure this component handles the QR display
import ProfileListAnalytics from './ProfileListAnalytics';

interface ProfileListProps {
    onSelectProfile: (profileId: string) => void;
    onEditProfile: (profileId: string) => void;
    onCreateProfile: () => void;
    selectedProfileId?: string | null;
}

export default function ProfileList({ onSelectProfile, onEditProfile, onCreateProfile, selectedProfileId }: ProfileListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // UI State
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
    const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'active' | 'deleted' | 'analytics'>('active');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'analytics') {
            setFilter('analytics');
        }
    }, [searchParams]);

    // UI State
    const [activeMenu, setActiveMenu] = useState<string | null>(null); // Profile ID for open menu
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [profileToMove, setProfileToMove] = useState<string | null>(null); // Profile ID pending move
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null); // Filter by Group
    const [newGroupColor, setNewGroupColor] = useState('blue');

    const availableColors = [
        { name: 'Blue', value: 'blue', bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
        { name: 'Green', value: 'green', bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
        { name: 'Purple', value: 'purple', bg: 'bg-violet-500', text: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200' },
        { name: 'Amber', value: 'amber', bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
        { name: 'Rose', value: 'rose', bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200' },
        { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-700', light: 'bg-cyan-50', border: 'border-cyan-200' },
    ];

    useEffect(() => {
        fetchProfiles();
        fetchGroups();
        fetchBrandKits();
    }, [filter, search]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter) params.append('status', filter);
            if (search) params.append('search', search);

            const res = await fetch(`/api/profiles?${params.toString()}`);

            if (res.status === 401) {
                router.push('/auth/login');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setProfiles(data);
                // Auto-select first profile if none selected
                if (!selectedProfileId && data.length > 0) {
                    onSelectProfile(data[0]._id);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await fetch('/api/groups');
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBrandKits = async () => {
        try {
            const res = await fetch('/api/brand-kits');
            if (res.ok) {
                const data = await res.json();
                setBrandKits(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to move this profile to trash?')) return;

        // Optimistic update
        const previousProfiles = [...profiles];
        setProfiles(prev => prev.filter(p => p._id?.toString() !== id));

        try {
            const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                alert('Failed to delete profile');
                setProfiles(previousProfiles); // Revert
            } else {
                fetchProfiles();
            }
        } catch (error) {
            console.error('Delete error:', error);
            setProfiles(previousProfiles); // Revert
            alert('An error occurred while deleting');
        }
    };

    const handleRestore = async (id: string) => {
        // Optimistic update
        const previousProfiles = [...profiles];
        setProfiles(prev => prev.filter(p => p._id?.toString() !== id));

        try {
            const res = await fetch(`/api/profiles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active' })
            });

            if (!res.ok) {
                setProfiles(previousProfiles); // Revert
                alert('Failed to restore profile');
            } else {
                fetchProfiles(); // Ensure sync
            }
        } catch (error) {
            console.error(error);
            setProfiles(previousProfiles); // Revert
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newGroupName,
                    color: newGroupColor,
                    defaultBrandKitId: selectedBrandKitId || undefined
                })
            });

            if (res.ok) {
                const { group } = await res.json();
                setGroups(prev => [group, ...prev]);

                if (profileToMove) {
                    await handleMoveToGroup(profileToMove, group._id);
                    setProfileToMove(null);
                }

                setNewGroupName('');
                setNewGroupColor('blue');
                setSelectedBrandKitId('');
                setShowGroupModal(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMoveToGroup = async (profileId: string, groupId: string | null) => {
        try {
            const group = groups.find(g => g._id?.toString() === groupId);
            const payload: any = { groupId: groupId };

            if (group?.defaultBrandKitId) {
                payload.brandKitId = group.defaultBrandKitId;
            }

            const res = await fetch(`/api/profiles/${profileId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchProfiles();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filter Logic
    const filteredProfiles = profiles.filter(profile => {
        if (selectedGroupId === null) return true; // All Groups
        if (selectedGroupId === 'ungrouped') return !profile.groupId;
        return profile.groupId === selectedGroupId;
    });

    const activeProfile = profiles.find(p => p._id === selectedProfileId);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-4 md:p-8 flex flex-col overflow-hidden h-screen">

            {/* Header */}
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profiles</h1>
                <p className="text-muted-foreground mt-1">Manage, organize, and share your digital identity cards.</p>
            </div>

            {/* Main Bento Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

                {/* Left Column: Profile Management (Scrollable) */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">

                    {/* Actions & Filter Bar (Mini Bento) */}
                    <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Group Tabs / Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide mask-fade-right">
                            <button
                                onClick={() => setSelectedGroupId(null)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedGroupId === null ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                            >
                                All Profiles <span className="opacity-60 text-[10px] ml-1">{profiles.length}</span>
                            </button>

                            {groups.map(group => {
                                const colorData = availableColors.find(c => c.value === (group.color || 'blue')) || availableColors[0];
                                const isSelected = selectedGroupId === group._id?.toString();

                                return (
                                    <button
                                        key={group._id?.toString()}
                                        onClick={() => setSelectedGroupId(group._id!.toString())}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border 
                                            ${isSelected
                                                ? `${colorData.bg} text-white border-transparent shadow-md`
                                                : `bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800`
                                            }`}
                                    >
                                        <Folder className={`w-3 h-3 ${isSelected ? 'text-white' : colorData.text}`} />
                                        {group.name}
                                        <span className={`text-[10px] ml-1 ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                                            {profiles.filter(p => p.groupId === group._id?.toString()).length}
                                        </span>
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setSelectedGroupId('ungrouped')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedGroupId === 'ungrouped' ? 'bg-primary text-primary-foreground border-primary' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                            >
                                Ungrouped <span className="opacity-60 text-[10px] ml-1">{profiles.filter(p => !p.groupId).length}</span>
                            </button>
                        </div>

                        {/* Action Buttons (Moved Here) */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-full font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-xs"
                            >
                                <FolderPlus className="w-3.5 h-3.5" />
                                New Group
                            </button>
                            <button
                                onClick={onCreateProfile}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Profile
                            </button>
                        </div>
                    </div>


                    {/* Main List Card */}
                    <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">

                        {/* Card Header: Search & Toggles */}
                        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-zinc-900">
                            <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-gray-200 dark:border-white/5">
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'active' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('analytics')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'analytics' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => setFilter('deleted')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'deleted' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    Trash
                                </button>
                            </div>

                            <div className="relative flex-1 w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search profiles..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        {filter === 'analytics' ? (
                            <div className="flex-1 overflow-auto custom-scrollbar p-6">
                                <ProfileListAnalytics profiles={profiles} />
                            </div>
                        ) : (
                            <>
                                {/* Profiles Table */}
                                <div className="flex-1 overflow-auto custom-scrollbar p-1">
                                    <table className="w-full text-left text-sm border-spacing-y-2 border-separate px-4">
                                        <thead className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-zinc-900 z-10">
                                            <tr>
                                                <th className="p-4 w-12 pb-2"></th>
                                                <th className="p-4 pb-2">Profile Name</th>
                                                <th className="p-4 pb-2">Group</th>
                                                <th className="p-4 pb-2">Role / Title</th>
                                                <th className="p-4 pb-2">Created</th>
                                                <th className="p-4 w-12 pb-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="space-y-2">
                                            {loading ? (
                                                [1, 2, 3].map((i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td className="p-4"><div className="w-4 h-4 bg-muted rounded"></div></td>
                                                        <td className="p-4"><div className="w-32 h-4 bg-muted rounded"></div></td>
                                                        <td className="p-4"><div className="w-20 h-4 bg-muted rounded"></div></td>
                                                        <td className="p-4"><div className="w-24 h-4 bg-muted rounded"></div></td>
                                                        <td className="p-4"><div className="w-20 h-4 bg-muted rounded"></div></td>
                                                        <td className="p-4"></td>
                                                    </tr>
                                                ))
                                            ) : filteredProfiles.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/10">
                                                            <User className="w-8 h-8 text-muted-foreground/50 mb-3" />
                                                            <p>No profiles found.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredProfiles.map((profile) => (
                                                    <tr
                                                        key={profile._id?.toString()}
                                                        onClick={filter === 'active' ? () => onSelectProfile(profile._id!.toString()) : undefined}
                                                        onDoubleClick={filter === 'active' ? () => onEditProfile(profile._id!.toString()) : undefined}
                                                        className={`group transition-all cursor-pointer rounded-xl relative ${selectedProfileId === profile._id?.toString()
                                                            ? 'bg-primary/5 shadow-sm ring-1 ring-primary/20 z-10'
                                                            : 'hover:bg-muted/40'
                                                            }`}
                                                    >
                                                        <td className="p-4 rounded-l-xl"><input type="checkbox" className="rounded border-gray-300 accent-primary" /></td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${selectedProfileId === profile._id?.toString() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                                                                    {profile.fullName.charAt(0)}
                                                                </div>
                                                                <span className={`font-semibold ${selectedProfileId === profile._id?.toString() ? 'text-primary' : ''}`}>
                                                                    {profile.fullName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {profile.groupId ? (
                                                                (() => {
                                                                    const group = groups.find(g => g._id?.toString() === profile.groupId);
                                                                    const colorData = group
                                                                        ? (availableColors.find(c => c.value === group.color) || availableColors[0])
                                                                        : availableColors[0];

                                                                    return (
                                                                        <span className={`${colorData.light} ${colorData.text} px-2.5 py-1 rounded-md text-xs font-bold border ${colorData.border} dark:bg-opacity-10`}>
                                                                            {group?.name || 'Unknown Group'}
                                                                        </span>
                                                                    );
                                                                })()
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs italic">No Group</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-muted-foreground font-medium">{profile.jobTitle || 'N/A'}</td>
                                                        <td className="p-4 text-muted-foreground">{new Date(profile.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-4 relative rounded-r-xl">
                                                            {filter === 'active' ? (
                                                                <>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === profile._id?.toString() ? null : profile._id!.toString()); }}
                                                                        className={`p-2 rounded-lg transition-colors ${activeMenu === profile._id?.toString() ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm'}`}
                                                                    >
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </button>

                                                                    {/* Dropdown Menu */}
                                                                    {activeMenu === profile._id?.toString() && (
                                                                        <div className="absolute right-12 top-2 w-60 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl z-50 animate-in fade-in zoom-in-95 overflow-hidden origin-top-right ring-1 ring-black/5">
                                                                            <div className="p-2 space-y-1">
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); onEditProfile(profile._id!.toString()); setActiveMenu(null); }}
                                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                                                                </button>

                                                                                <div className="h-px bg-border/50 my-1 mx-2" />

                                                                                {/* Groups Submenu Section */}
                                                                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Move to Group</div>

                                                                                {groups.map(g => (
                                                                                    <button
                                                                                        key={g._id?.toString()}
                                                                                        onClick={(e) => { e.stopPropagation(); handleMoveToGroup(profile._id!.toString(), g._id!.toString()); setActiveMenu(null); }}
                                                                                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${profile.groupId === g._id?.toString() ? 'text-primary bg-primary/5 font-semibold' : 'text-foreground hover:bg-accent'}`}
                                                                                    >
                                                                                        <Folder className="w-3.5 h-3.5" />
                                                                                        {g.name}
                                                                                        {profile.groupId === g._id?.toString() && <Check className="w-3 h-3 ml-auto" />}
                                                                                    </button>
                                                                                ))}

                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setProfileToMove(profile._id!.toString());
                                                                                        setNewGroupName(`${profile.company || profile.fullName}'s Team`);
                                                                                        setShowGroupModal(true);
                                                                                        setActiveMenu(null);
                                                                                    }}
                                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
                                                                                >
                                                                                    <FolderPlus className="w-4 h-4" /> New Group
                                                                                </button>

                                                                                {profile.groupId && (
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); handleMoveToGroup(profile._id!.toString(), null); setActiveMenu(null); }}
                                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                                                                                    >
                                                                                        <X className="w-4 h-4" /> Ungroup
                                                                                    </button>
                                                                                )}

                                                                                <div className="h-px bg-border/50 my-1 mx-2" />

                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(profile._id!.toString()); setActiveMenu(null); }}
                                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" /> Move to Trash
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRestore(profile._id!.toString()); }}
                                                                    className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                                                                    title="Restore"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Footer */}
                                <div className="p-4 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Showing {filteredProfiles.length} profiles</span>
                                    <div className="flex gap-2">
                                        <button className="p-2 border border-border rounded-lg hover:bg-white transition-all disabled:opacity-50">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 border border-border rounded-lg hover:bg-white transition-all disabled:opacity-50">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* Right Column: Share Card (Bento Style) */}
                <div className="lg:col-span-4 h-full min-h-0 flex flex-col">
                    {activeProfile ? (
                        <div className="h-auto sticky top-4">
                            <QRDownload profileId={selectedProfileId} />
                        </div>
                    ) : (
                        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="text-center relative z-10 p-8">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                    <QrCode className="w-10 h-10 opacity-20" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">No Profile Selected</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto">
                                    Select a profile from the list to view its QR code and share options.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create New Group</h3>
                            <button onClick={() => setShowGroupModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">
                            Organize your profiles by department, branch, or team for better management.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Group Name</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="e.g. Marketing Team..."
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Default Brand Kit (Optional)</label>
                                <select
                                    value={selectedBrandKitId}
                                    onChange={(e) => setSelectedBrandKitId(e.target.value)}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium text-sm mb-6 appearance-none"
                                >
                                    <option value="">No Brand Kit (Standard Theme)</option>
                                    {brandKits.map(kit => (
                                        <option key={kit._id?.toString()} value={kit._id?.toString()}>
                                            {kit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Color Tag</label>
                                <div className="flex gap-3 flex-wrap">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewGroupColor(color.value)}
                                            className={`w-10 h-10 rounded-full ${color.bg} transition-all relative flex items-center justify-center ${newGroupColor === color.value
                                                ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-lg'
                                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            {newGroupColor === color.value && <Check className="w-4 h-4 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border/50">
                                <button
                                    onClick={() => setShowGroupModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!newGroupName.trim()}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-sm"
                                >
                                    Create Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
