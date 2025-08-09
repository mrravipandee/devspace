'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const data = [
    { day: 'Mon', visitors: 22 },
    { day: 'Tue', visitors: 28 },
    { day: 'Wed', visitors: 18 },
    { day: 'Thu', visitors: 25 },
    { day: 'Fri', visitors: 30 },
    { day: 'Sat', visitors: 20 },
    { day: 'Sun', visitors: 32 },
];

export default function VisitorsLineChart() {
    // Calculate percentage change
    const percentageChange = ((data[data.length - 1].visitors - data[0].visitors) / data[0].visitors) * 100;
    const isPositive = percentageChange >= 0;

    return (
        <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl w-full max-w-3xl mx-auto shadow-sm dark:shadow-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white">
                        Weekly Visitors
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</p>
                </div>

                <div className={`flex items-center text-sm ${isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    <ArrowUpRight className={`w-4 h-4 mr-1 ${isPositive ? '' : 'rotate-180'}`} />
                    {Math.abs(percentageChange).toFixed(1)}% {isPositive ? 'increase' : 'decrease'}
                </div>
            </div>

            <div className="w-full h-[220px] sm:h-[280px] md:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f0f0f0"
                            strokeOpacity={0.5}
                            className="dark:stroke-gray-700"
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={10}
                            className="dark:text-gray-400"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={10}
                            width={30}
                            className="dark:text-gray-400"
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: 'none',
                                background: '#ffffff',
                                color: '#2b3674'
                            }}
                            itemStyle={{
                                color: '#2b3674',
                                fontWeight: 500,
                            }}
                            labelStyle={{
                                fontWeight: 600,
                                color: '#2b3674',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#2b3674"
                            strokeWidth={2.5}
                            className="dark:stroke-blue-400"
                            dot={{
                                r: 4,
                                stroke: '#2b3674',
                                strokeWidth: 2,
                                fill: '#ffffff',
                                className: 'dark:stroke-blue-400 dark:fill-gray-800'
                            }}
                            activeDot={{
                                r: 6,
                                stroke: '#ffffff',
                                strokeWidth: 2,
                                fill: '#2b3674',
                                className: 'dark:stroke-gray-800 dark:fill-blue-400'
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}