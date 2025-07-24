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
    // Calculate percentage change (example calculation)
    const percentageChange = ((data[data.length - 1].visitors - data[0].visitors) / data[0].visitors) * 100;
    const isPositive = percentageChange >= 0;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-primaryText">
                        Weekly Visitors
                    </h2>
                    <p className="text-sm text-gray-500">Last 7 days</p>
                </div>

                <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
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
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={10}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: 'none',
                                background: '#ffffff',
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
                            dot={{
                                r: 4,
                                stroke: '#2b3674',
                                strokeWidth: 2,
                                fill: '#ffffff'
                            }}
                            activeDot={{
                                r: 6,
                                stroke: '#ffffff',
                                strokeWidth: 2,
                                fill: '#2b3674'
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-end mt-2">
            </div>
        </div>
    );
}