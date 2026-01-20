'use client';

import React, { useState } from 'react';
import { Download, Search, Mail, Phone, Calendar, User, FileText, Filter, MoreHorizontal } from 'lucide-react';

// Mock Data
const contacts = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1 (555) 123-4567', profileSource: 'Business Card Pro', date: '2025-06-21' },
    { id: 2, name: 'Robert Smith', email: 'rob.smith@techcorp.com', phone: '+1 (555) 987-6543', profileSource: 'Conference Badge', date: '2025-06-20' },
    { id: 3, name: 'Emily Davis', email: 'emily.d@designstudio.io', phone: '+44 20 7123 4567', profileSource: 'Portfolio Link', date: '2025-06-18' },
    { id: 4, name: 'Michael Brown', email: 'm.brown@startup.co', phone: '+1 (555) 456-7890', profileSource: 'Business Card Pro', date: '2025-06-15' },
    { id: 5, name: 'Sarah Wilson', email: 'sarah.w@freelance.net', phone: '+33 6 12 34 56 78', profileSource: 'Portfolio Link', date: '2025-06-12' },
];

export default function ContactsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-auto p-4 lg:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Contacts</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage leads and connections from your profile scans.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors font-bold text-sm shadow-sm text-gray-700 dark:text-gray-200">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 p-4 rounded-3xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-950/50 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 font-bold text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                    <Filter className="w-4 h-4" />
                    Filter by Source
                </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-zinc-950/50 border-b border-gray-100 dark:border-white/5 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                <th className="p-6">Contact Name</th>
                                <th className="p-6 hidden md:table-cell">Contact Info</th>
                                <th className="p-6 hidden lg:table-cell">Source Profile</th>
                                <th className="p-6 hidden lg:table-cell">Date Added</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredContacts.map((contact) => (
                                <tr key={contact.id} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center border border-blue-100 dark:border-blue-500/10">
                                                {contact.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{contact.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden">{contact.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden md:table-cell">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Mail className="w-3 h-3 text-gray-400" />
                                                {contact.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <Phone className="w-3 h-3" />
                                                {contact.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-500/10">
                                            <FileText className="w-3 h-3" />
                                            {contact.profileSource}
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {contact.date}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredContacts.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No contacts found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
