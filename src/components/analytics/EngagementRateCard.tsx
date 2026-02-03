import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EngagementRateCardProps {
    rate: number;
    label?: string;
}

export default function EngagementRateCard({ rate, label = 'Engagement Rate' }: EngagementRateCardProps) {
    const data = {
        labels: ['Engaged', 'Not Engaged'],
        datasets: [
            {
                data: [rate, 100 - rate],
                backgroundColor: [
                    '#3B82F6',
                    '#E5E7EB'
                ],
                borderWidth: 0,
                cutout: '75%'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.parsed}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>

            <div className="relative" style={{ height: '200px' }}>
                <Doughnut data={data} options={options} />

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">{rate}%</p>
                        <p className="text-xs text-gray-500 mt-1">Engaged</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-600">Active Users</span>
                    </div>
                    <span className="font-semibold text-gray-900">{rate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className="text-gray-600">Inactive</span>
                    </div>
                    <span className="font-semibold text-gray-900">{100 - rate}%</span>
                </div>
            </div>
        </div>
    );
}
