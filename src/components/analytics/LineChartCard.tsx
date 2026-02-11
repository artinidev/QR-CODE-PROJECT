'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartCardProps {
    title: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor?: string;
            backgroundColor?: string | ((context: any) => any);
        }[];
    };
    height?: number;
}

export default function LineChartCard({ title, data, height = 350 }: LineChartCardProps) {
    // We need to access computer styles or use a robust way to detect dark mode for chart internals
    // For now, simpler approach: CSS variables or hardcoded check if class 'dark' exists on documentElement (client side only)

    // However, chart.js options are JS objects. We can change base colors to be neutral or variable-aware?
    // Best practice with Chart.js + Tailwind dark mode usually involves a hook or re-render on theme change.
    // For simplicity, I'll set colors that work on both or slightly grey. 
    // Ideally we'd use `rgba(148, 163, 184, 1)` (slate-400) for text which is visible on dark/light.

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                align: 'end' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: 'bold' as const
                    },
                    color: '#94A3B8' // Slate-400 works on both, compatible with Zinc
                }
            },
            tooltip: {
                backgroundColor: 'rgba(24, 24, 27, 0.9)', // Zinc-900
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: 'bold' as const
                },
                bodyFont: {
                    size: 12,
                    family: "'Inter', sans-serif"
                },
                displayColors: false,
                intersect: false,
                mode: 'index' as const,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#9CA3AF', // Gray-400 (Zinc-like)
                    padding: 10
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(161, 161, 170, 0.1)', // Zinc-400 with opacity
                    borderDash: [5, 5],
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#9CA3AF', // Gray-400
                    padding: 10,
                    maxTicksLimit: 5
                },
                border: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 0,
                hoverRadius: 6,
                hoverBorderWidth: 4
            }
        }
    };

    // Enhance datasets with gradients
    const enhancedData = {
        ...data,
        datasets: data.datasets.map((dataset, index) => {
            const color = dataset.borderColor || (index === 0 ? '#3B82F6' : '#10B981');
            return {
                ...dataset,
                borderColor: color,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, height);
                    if (index === 0) {
                        // Blue gradient
                        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    } else {
                        // Green gradient
                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    }
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: color,
            };
        })
    };

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/10 h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{title}</h3>
            <div style={{ height: `${height}px` }}>
                <Line data={enhancedData} options={options} />
            </div>
        </div>
    );
}
