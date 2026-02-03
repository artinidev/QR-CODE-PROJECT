import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface KpiCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    iconBgColor?: string;
}

export default function KpiCard({
    title,
    value,
    change,
    icon,
    iconBgColor = 'bg-blue-100'
}: KpiCardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

                    {change !== undefined && (
                        <div className="flex items-center gap-1">
                            {isPositive ? (
                                <ArrowUpIcon className="w-4 h-4 text-green-600" />
                            ) : (
                                <ArrowDownIcon className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(change)}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last period</span>
                        </div>
                    )}
                </div>

                <div className={`${iconBgColor} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
