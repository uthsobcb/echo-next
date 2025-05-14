"use client";

import {
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

export default function MoodChart({ selectedData }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const processedData = selectedData.map((item, index) => ({
        ...item,
        index: `Entry ${index + 1}`
    }));

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                {/* Pie Chart */}
                <div className="w-full h-[300px]">
                    <h3 className="text-lg font-semibold mb-2">Mood Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={processedData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-2 border rounded shadow">
                                                <p className="font-semibold">{payload[0].payload.label}</p>
                                                <p>Intensity: {payload[0].value}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Line Chart */}
                <div className="w-full h-[300px] my-10 lg:my-5">
                    <h3 className="text-lg font-semibold mb-2">Mood Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="index" />
                            <YAxis />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-2 border rounded shadow">
                                                <p className="font-semibold">{payload[0].payload.label}</p>
                                                <p>Intensity: {payload[0].value}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ fill: '#8884d8', r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}
