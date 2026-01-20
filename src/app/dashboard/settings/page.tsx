'use client';

import React from 'react';
import { User, Bell, Shield, CreditCard, LogOut, Mail, Lock, Check, Users, Plus, X, Activity, Key as KeyIcon, Trash2 } from 'lucide-react';

export default function SettingsPage() {
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [users, setUsers] = React.useState<any[]>([]);
    const [isInviteOpen, setIsInviteOpen] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<any>(null);
    const [sendingEmail, setSendingEmail] = React.useState(false);

    // Invite/Edit Form Stats
    const [formData, setFormData] = React.useState({
        email: '',
        role: 'user',
        status: 'active',
        password: '',
        limits: { maxQrCodes: 5, maxProfiles: 1 },
        features: { analytics: true, customThemes: false, bulkGeneration: false, apiAccess: false }
    });

    // Profile Update State
    const [profileData, setProfileData] = React.useState({
        fullName: '',
        email: ''
    });

    // Password Update State
    const [passwordData, setPasswordData] = React.useState({
        current: '',
        new: '',
        confirm: ''
    });

    React.useEffect(() => {
        // Fetch current user info to check role
        fetch('/api/auth/me').then(res => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch user');
        }).then(data => {
            setUserRole(data.role);
            setCurrentUser(data);
            setProfileData({
                fullName: data.profile?.fullName || '',
                email: data.email || ''
            }); // Init profile form
            if (data.role === 'admin') {
                fetchUsers();
            }
        }).catch(err => {
            console.error(err);
        });
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Failed to load users');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to invite');

            await fetchUsers();
            setIsInviteOpen(false);
            resetFormData();
            alert('User invited successfully!');
        } catch (error) {
            alert('Error inviting user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsLoading(true);

        const updatePayload: any = {
            status: formData.status,
            limit: formData.limits,
            features: formData.features
        };

        if (formData.password) {
            updatePayload.password = formData.password;
        }

        try {
            const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (!res.ok) throw new Error('Failed to update');

            await fetchUsers();
            setIsEditOpen(false);
            resetFormData();
            alert('User updated successfully!');
        } catch (error) {
            alert('Error updating user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('User deleted successfully');
                fetchUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            role: user.role,
            status: user.status,
            password: '',
            limits: user.limits || { maxQrCodes: 5, maxProfiles: 1 },
            features: user.features || { analytics: true, customThemes: false, bulkGeneration: false, apiAccess: false }
        });
        setIsEditOpen(true);
    };

    const resetFormData = () => {
        setFormData({
            email: '',
            role: 'user',
            password: '',
            status: 'active',
            limits: { maxQrCodes: 5, maxProfiles: 1 },
            features: { analytics: true, customThemes: false, bulkGeneration: false, apiAccess: false }
        });
        setSelectedUser(null);
    };

    // User Self-Management Functions
    const handleUpdateProfile = async () => {
        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: profileData.fullName })
            });
            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            alert('Error updating profile');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) return alert('Passwords do not match');

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            });

            if (res.ok) {
                alert('Password changed successfully!');
                setIsPasswordModalOpen(false);
                setPasswordData({ current: '', new: '', confirm: '' });
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to change password');
            }
        } catch (error) {
            alert('Error changing password');
        }
    };



    return (
        <div className="flex-1 overflow-auto p-4 lg:p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account preferences and subscription.</p>
                </div>

                <div className="grid gap-8">

                    {/* Admin Only: User Management */}
                    {userRole === 'admin' && (
                        <div className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/20 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />

                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Management</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Invite users and manage access limits.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { resetFormData(); setIsInviteOpen(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Plus className="w-4 h-4" /> Invite User
                                </button>
                            </div>

                            <div className="space-y-4">
                                {users.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No users found.</p>
                                ) : (
                                    users.map((user: any) => (
                                        <div key={user._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950/50 rounded-2xl border border-gray-100 dark:border-white/5 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'}`}>
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 dark:text-white">{user.email}</p>
                                                        {user.role === 'admin' && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                                                    </div>
                                                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <span>Scans: {user.stats?.scanCount || 0} / {user.limits?.maxQrCodes || 5}</span>
                                                        <span>Profiles: {user.stats?.profileCount || 0} / {user.limits?.maxProfiles || 1}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    user.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                        'bg-red-100 text-red-700'}`}>
                                                    {user.status === 'pending' ? 'Invited' : user.status}
                                                </span>
                                                <button onClick={() => openEditModal(user)} className="text-gray-400 hover:text-blue-600 transition-colors p-2" title="Edit Access">
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(user._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Usage Stats (For Everyone) */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Plan Usage</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Your current resource consumption.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">QR Codes</span>
                                    <span className="text-sm text-gray-500">0 / {userRole === 'admin' ? '∞' : currentUser?.limits?.maxQrCodes || 5}</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[10%]" />
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Profiles</span>
                                    <span className="text-sm text-gray-500">0 / {userRole === 'admin' ? '∞' : currentUser?.limits?.maxProfiles || 1}</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[20%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Details</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-white"
                                    />
                                    <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        readOnly
                                        className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    />
                                    <Mail className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={handleUpdateProfile} className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-full shadow hover:bg-blue-700 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Security & Notifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Password */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <h2 className="font-bold text-gray-900 dark:text-white">Security</h2>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 text-left text-sm group"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Change Password</span>
                                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 text-left text-sm group">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Auth</span>
                                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Enabled</span>
                                </button>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <h2 className="font-bold text-gray-900 dark:text-white">Notifications</h2>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Email alerts for new scans', checked: true },
                                    { label: 'Weekly analytics report', checked: true },
                                    { label: 'Marketing newsletters', checked: false },
                                ].map((item, i) => (
                                    <label key={i} className="flex items-center justify-between p-2 cursor-pointer group">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : ''}`} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                        <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Once you delete your account, there is no going back.</p>
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/50 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>

            {/* Invite/Edit User Modal */}
            {(isInviteOpen || isEditOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900 sticky top-0 z-10 backdrop-blur-md">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {isEditOpen ? 'Edit User Access' : 'Invite User'}
                            </h3>
                            <button onClick={() => { setIsInviteOpen(false); setIsEditOpen(false); resetFormData(); }} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={isEditOpen ? handleEditUser : handleInvite} className="p-6 space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white disabled:opacity-50"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="user@example.com"
                                    required
                                    disabled={isEditOpen} // Cannot change email
                                />
                            </div>
                            {!isEditOpen && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Initial Password <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            )}
                            {isEditOpen && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            )}


                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">Usage Limits</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max QR Limits</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                            value={formData.limits.maxQrCodes}
                                            onChange={e => setFormData({ ...formData, limits: { ...formData.limits, maxQrCodes: parseInt(e.target.value) } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Profiles</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                            value={formData.limits.maxProfiles}
                                            onChange={e => setFormData({ ...formData, limits: { ...formData.limits, maxProfiles: parseInt(e.target.value) } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium block mb-2 text-gray-700 dark:text-gray-300">Feature Access</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(formData.features).map((feature) => (
                                        <label key={feature} className={`flex items-center gap-2 p-3 rounded-lg border text-sm cursor-pointer transition-all ${formData.features[feature as keyof typeof formData.features]
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium'
                                            : 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.features[feature as keyof typeof formData.features]}
                                                onChange={() => setFormData({
                                                    ...formData,
                                                    features: {
                                                        ...formData.features,
                                                        [feature]: !formData.features[feature as keyof typeof formData.features]
                                                    }
                                                })}
                                            />
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.features[feature as keyof typeof formData.features] ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {formData.features[feature as keyof typeof formData.features] && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#3B82F6] text-white font-bold rounded-xl mt-4 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
                            >
                                {isLoading ? 'Processing...' : (isEditOpen ? 'Update User' : 'Send Invitation')}
                            </button>
                        </form>
                    </div>
                </div >
            )
            }

            {/* Change Password Modal */}
            {
                isPasswordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/10">
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Change Password</h3>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                        value={passwordData.current}
                                        onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#3B82F6] text-white font-bold rounded-xl mt-4 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
