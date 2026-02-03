'use client';

import React, { useEffect, useState } from 'react';
import {
    ChartBarIcon,
    EyeIcon,
    QrCodeIcon,
    CursorArrowRaysIcon
} from '@heroicons/react/24/solid';
import KpiCard from '@/components/analytics/KpiCard';
import LineChartCard from '@/components/analytics/LineChartCard';
import TopPerformerCard from '@/components/analytics/TopPerformerCard';
import EngagementRateCard from '@/components/analytics/EngagementRateCard';
import QRCodeListCard from '@/components/analytics/QRCodeListCard';

export default function AnalyticsPage() {
    const [qrCodes, setQrCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQRCodes();
    }, []);

    const fetchQRCodes = async () => {
        try {
            const response = await fetch('/api/qr-codes');
            if (response.ok) {
                const data = await response.json();
                // API returns {qrCodes: [...]} not a direct array
                const codes = data.qrCodes || data;
                setQrCodes(Array.isArray(codes) ? codes : []);
            } else {
                setQrCodes([]);
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error);
            setQrCodes([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate metrics from QR codes
    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.scans || 0), 0);
    const totalQRCodes = qrCodes.length;
    const activeQRCodes = qrCodes.filter(qr => qr.scans > 0).length;
    const avgScansPerQR = totalQRCodes > 0 ? Math.round(totalScans / totalQRCodes) : 0;

    // Prepare top performers
    const topPerformers = qrCodes
        .sort((a, b) => (b.scans || 0) - (a.scans || 0))
        .slice(0, 5)
        .map((qr, index) => ({
            name: qr.name || 'Unnamed QR',
            scans: qr.scans || 0,
            rank: index + 1
        }));

    // Prepare chart data (mock data for now - can be enhanced with real time-series data)
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'QR Scans',
                data: [120, 190, 150, 220, 180, 240, 200],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            },
            {
                label: 'Profile Views',
                data: [200, 250, 220, 280, 260, 300, 270],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }
        ]
    };

    // Prepare QR codes list with trend data
    const qrCodesWithTrend = qrCodes.map(qr => ({
        id: qr._id || qr.id,
        name: qr.name || 'Unnamed QR',
        scans: qr.scans || 0,
        trend: Math.floor(Math.random() * 30) - 10, // Mock trend data
        lastScan: qr.updatedAt ? new Date(qr.updatedAt).toLocaleDateString() : undefined
    }));

    // Calculate engagement rate (mock calculation - can be enhanced)
    const engagementRate = totalQRCodes > 0
        ? Math.round((activeQRCodes / totalQRCodes) * 100)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                            <p className="text-sm text-gray-500 mt-1">Track your QR code performance and engagement</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm">
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard
                        title="Total Scans"
                        value={totalScans.toLocaleString()}
                        change={12.5}
                        icon={<EyeIcon className="w-6 h-6 text-blue-600" />}
                        iconBgColor="bg-blue-100"
                    />
                    <KpiCard
                        title="QR Codes"
                        value={totalQRCodes}
                        change={8.1}
                        icon={<QrCodeIcon className="w-6 h-6 text-purple-600" />}
                        iconBgColor="bg-purple-100"
                    />
                    <KpiCard
                        title="Avg Scans/QR"
                        value={avgScansPerQR}
                        change={-2.4}
                        icon={<ChartBarIcon className="w-6 h-6 text-orange-600" />}
                        iconBgColor="bg-orange-100"
                    />
                    <KpiCard
                        title="Active QR Codes"
                        value={activeQRCodes}
                        icon={<CursorArrowRaysIcon className="w-6 h-6 text-green-600" />}
                        iconBgColor="bg-green-100"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Chart - 2/3 width */}
                    <div className="lg:col-span-2">
                        <LineChartCard
                            title="Performance Over Time"
                            data={chartData}
                            height={350}
                        />
                    </div>

                    {/* Side Cards - 1/3 width */}
                    <div className="space-y-6">
                        <TopPerformerCard performers={topPerformers} />
                        <EngagementRateCard rate={engagementRate} />
                    </div>
                </div>

                {/* QR Codes List */}
                <QRCodeListCard qrCodes={qrCodesWithTrend} maxItems={10} />
            </div>
        </div>
    );
}
