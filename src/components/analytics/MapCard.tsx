'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map to avoid SSR issues
const LiveScanMap = dynamic(() => import('./LiveScanMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate-50 dark:bg-zinc-900 animate-pulse flex items-center justify-center text-slate-400">
            Loading Map...
        </div>
    )
});

interface MapCardProps {
    title?: string;
}

export default function MapCard({ title = "Live Scan Map" }: MapCardProps) {
    const [locations, setLocations] = useState<any[]>([]);
    const [qrCodes, setQrCodes] = useState<any[]>([]);
    const [selectedQrId, setSelectedQrId] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    const fetchData = async (qrId?: string) => {
        setLoading(true);
        try {
            const url = qrId && qrId !== 'all'
                ? `/api/analytics/map-data?qrCodeId=${qrId}`
                : '/api/analytics/map-data';

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setLocations(data.locations || []);
                if (data.activeQRs) setQrCodes(data.activeQRs);
            }
        } catch (error) {
            console.error('Failed to fetch map data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData(selectedQrId);
    }, [selectedQrId]);

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapIcon className="w-6 h-6 text-blue-500" />
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                        Real-time geolocation of your scans
                    </p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <select
                        value={selectedQrId}
                        onChange={(e) => setSelectedQrId(e.target.value)}
                        className="appearance-none bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 cursor-pointer"
                    >
                        <option value="all">All Active QR Codes</option>
                        {qrCodes.map((qr) => (
                            <option key={qr.id} value={qr.id}>
                                {qr.name} ({qr.code})
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            {/* Map Viz */}
            <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800/50 z-0">
                {/* 
                  Note: We separate loading state logic. 
                  If initially loading data, we show spinner.
                  If data loaded but empty, show empty state.
                  Else show map.
                */}
                {loading && locations.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : locations.length > 0 ? (
                    <LiveScanMap data={locations} />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500">
                        <MapIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>No location data available for this selection</p>
                    </div>
                )}

                {/* Stats Overlay for the Map */}
                {!loading && locations.length > 0 && (
                    <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xl z-[1000] pointer-events-none">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Top Location</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {locations[0].city}, {locations[0].country}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {locations[0].count} Scans
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
