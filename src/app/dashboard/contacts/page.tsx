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
                    <h1 className="text-3xl font-bold tracking-tight">My Contacts</h1>
                    <p className="text-muted-foreground mt-1">Manage leads and connections from your profile scans.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border/50 rounded-xl hover:bg-accent transition-colors font-medium text-sm shadow-sm text-foreground">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/70"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl hover:bg-muted font-medium text-sm text-muted-foreground whitespace-nowrap transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter by Source
                </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="p-6 font-semibold">Contact Name</th>
                                <th className="p-6 font-semibold hidden md:table-cell">Contact Info</th>
                                <th className="p-6 font-semibold hidden lg:table-cell">Source Profile</th>
                                <th className="p-6 font-semibold hidden lg:table-cell">Date Added</th>
                                <th className="p-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredContacts.map((contact) => (
                                <tr key={contact.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
                                                {contact.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-foreground">{contact.name}</p>
                                                <p className="text-xs text-muted-foreground md:hidden">{contact.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden md:table-cell">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-2 text-foreground/80">
                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                {contact.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {contact.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-900/30">
                                            <FileText className="w-3 h-3" />
                                            {contact.profileSource}
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {contact.date}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredContacts.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No contacts found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
