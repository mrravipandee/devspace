'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import { useEffect, useState } from 'react';

interface ProjectStatus {
    status: string;
    count: number;
    color: string;
}

export default function ProjectStatusChart() {
    const [data, setData] = useState<ProjectStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProjects, setTotalProjects] = useState(0);

    useEffect(() => {
        const fetchProjectStatus = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                const result = await response.json();
                if (result.success) {
                    const projectStats = result.data.projects;
                    const statusData = [
                        {
                            status: 'Active',
                            count: projectStats.active,
                            color: '#10B981'
                        },
                        {
                            status: 'Completed',
                            count: projectStats.completed,
                            color: '#3B82F6'
                        },
                        {
                            status: 'Planned',
                            count: projectStats.planned,
                            color: '#F59E0B'
                        }
                    ];
                    setData(statusData);
                    setTotalProjects(projectStats.total);
                }
            } catch (error) {
                console.error('Failed to fetch project status:', error);
                // Fallback data
                setData([
                    { status: 'Active', count: 5, color: '#10B981' },
                    { status: 'Completed', count: 8, color: '#3B82F6' },
                    { status: 'Planned', count: 3, color: '#F59E0B' }
                ]);
                setTotalProjects(16);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl shadow-sm dark:shadow-gray-800/50">
                <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white mb-4">
                    Project Status Distribution
                </h2>
                <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl shadow-sm dark:shadow-gray-800/50">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white">
                        Project Status Distribution
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {totalProjects} Total Projects
                    </p>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="count"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color}
                                    className="dark:opacity-80"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: 'none',
                                background: '#ffffff',
                                color: '#2b3674'
                            }}
                            formatter={(value: any, name: any) => [
                                `${value} projects`,
                                name
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{
                                paddingTop: '20px'
                            }}
                            className="dark:text-gray-300"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        <div 
                            className="w-3 h-3 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.count}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
