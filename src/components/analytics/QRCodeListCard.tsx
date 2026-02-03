import React from 'react';
import { QrCodeIcon, EyeIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface QRCode {
    id: string;
    name: string;
    scans: number;
    trend: number;
    lastScan?: string;
}

interface QRCodeListCardProps {
    qrCodes: QRCode[];
    maxItems?: number;
}

export default function QRCodeListCard({ qrCodes, maxItems = 5 }: QRCodeListCardProps) {
    const displayedCodes = qrCodes.slice(0, maxItems);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent QR Codes</h3>
                <Link
                    href="/dashboard/qr"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-3">
                {displayedCodes.map((qr) => (
                    <div
                        key={qr.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150 group"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <QrCodeIcon className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{qr.name}</p>
                                {qr.lastScan && (
                                    <p className="text-xs text-gray-500">Last scan: {qr.lastScan}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                    <EyeIcon className="w-4 h-4 text-gray-400" />
                                    {qr.scans.toLocaleString()}
                                </div>
                                {qr.trend !== 0 && (
                                    <div className={`flex items-center gap-1 text-xs ${qr.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <ArrowTrendingUpIcon className={`w-3 h-3 ${qr.trend < 0 ? 'rotate-180' : ''}`} />
                                        {Math.abs(qr.trend)}%
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {qrCodes.length === 0 && (
                <div className="text-center py-8">
                    <QrCodeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No QR codes yet</p>
                    <Link
                        href="/dashboard/qr"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                        Create your first QR code
                    </Link>
                </div>
            )}
        </div>
    );
}
