'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Log {
    _id: string;
    action: string;
    description: string;
    timestamp: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        fetch('/api/admin/audit-logs')
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Activity Logs</h1>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="p-4">Action</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-white/[0.02]">
                                <td className="p-4 font-mono text-xs text-indigo-400">{log.action}</td>
                                <td className="p-4 text-slate-300">{log.description}</td>
                                <td className="p-4 text-slate-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
