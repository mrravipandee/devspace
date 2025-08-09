'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { day: 'Mon', blogs: 2, articles: 1 },
    { day: 'Tue', blogs: 1, articles: 2 },
    { day: 'Wed', blogs: 3, articles: 1 },
    { day: 'Thu', blogs: 0, articles: 3 },
    { day: 'Fri', blogs: 2, articles: 2 },
    { day: 'Sat', blogs: 1, articles: 1 },
    { day: 'Sun', blogs: 2, articles: 3 },
];

export default function BlogArticleChart() {
    return (
        <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl w-full max-w-4xl mx-auto shadow-sm dark:shadow-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white">
                    Weekly Blog & Article Posts
                </h2>
                <div className="flex gap-2 text-xs sm:text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary dark:bg-blue-500 mr-2"></div>
                        <span className="dark:text-gray-300">Blogs</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#6AD2FF] dark:bg-cyan-400 mr-2"></div>
                        <span className="dark:text-gray-300">Articles</span>
                    </div>
                </div>
            </div>
            
            <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}
                        barSize={20}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false} 
                            stroke="#f0f0f0"
                            className="dark:stroke-gray-700"
                        />
                        <XAxis 
                            dataKey="day" 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                            className="dark:text-gray-400"
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                            width={30}
                            className="dark:text-gray-400"
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                            contentStyle={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: 'none',
                                background: '#ffffff',
                                color: '#2b3674',
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
                        <Legend 
                            wrapperStyle={{
                                paddingTop: '20px'
                            }}
                            className="dark:text-gray-300"
                        />
                        <Bar 
                            dataKey="blogs" 
                            fill="#4318FF" 
                            name="Blogs" 
                            radius={[4, 4, 0, 0]}
                            className="dark:fill-blue-500"
                        />
                        <Bar 
                            dataKey="articles" 
                            fill="#6AD2FF" 
                            name="Articles" 
                            radius={[4, 4, 0, 0]}
                            className="dark:fill-cyan-400"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}