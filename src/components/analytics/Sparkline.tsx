'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

interface SparklineProps {
    data: number[];
    color?: string;
    isPositive?: boolean;
}

export default function Sparkline({ data, color, isPositive = true }: SparklineProps) {
    // Determine color based on trend if not explicitly provided
    const lineColor = color || (isPositive ? '#10B981' : '#EF4444');
    const gradientColor = color || (isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)');

    const chartData = {
        labels: data.map((_, i) => i.toString()), // Dummy labels
        datasets: [
            {
                data: data,
                borderColor: lineColor,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 60);
                    gradient.addColorStop(0, gradientColor);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    return gradient;
                },
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        scales: {
            x: { display: false },
            y: { display: false, min: Math.min(...data) * 0.9, max: Math.max(...data) * 1.1 },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    return (
        <div className="h-10 w-24">
            <Line data={chartData} options={options} />
        </div>
    );
}
