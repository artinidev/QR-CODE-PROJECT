'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Search, User, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const fetchUsers = async (page: number) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${page}&limit=10`);
            const data = await res.json();
            setUsers(data.users);
            setPagination({
                page: data.pagination.page,
                totalPages: data.pagination.totalPages
            });
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Simple Next/Prev handlers
    const handleNext = () => {
        if (pagination.page < pagination.totalPages) fetchUsers(pagination.page + 1);
    };

    const handlePrev = () => {
        if (pagination.page > 1) fetchUsers(pagination.page - 1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-slate-400">Manage platform access and permissions.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 w-64 focus-within:ring-2 ring-indigo-500/50 transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600"
                    />
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider bg-white/[0.02]">
                                <th className="p-6 font-medium">User</th>
                                <th className="p-6 font-medium">Role</th>
                                <th className="p-6 font-medium">Joined</th>
                                <th className="p-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.email}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {user._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                                            <Shield size={12} />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Calendar size={14} />
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        No users found matching "{search}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && (
                <div className="flex items-center justify-between mt-6 text-sm text-slate-400">
                    <div>
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
