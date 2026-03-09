"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";
import React from "react";

type Mood =
  | string
  | { type?: string; count?: number; name?: string; mood?: string };

export default function MoodsChart({ moods }: { moods: Mood[] }) {
  if (!moods || !Array.isArray(moods) || moods.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-400 font-medium italic">
        No mood data available yet...
      </div>
    );
  }

  const chartData = processChartData(moods);
  const colors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
  ];

  return (
    <div className="h-[350px] w-full bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9", opacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1e293b] text-white p-3 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{label}</p>
                    <p className="text-lg font-black">{payload[0].value} <span className="text-xs font-normal text-slate-400">entries</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
            barSize={40}
            animationBegin={200}
            animationDuration={1500}
          >
            {chartData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Count moods and format them for Recharts
function processChartData(moods: Mood[]) {
  if (moods.length > 0 && typeof moods[0] === 'object' && moods[0] !== null && "type" in moods[0] && "count" in moods[0]) {
    return moods.map((mood: any) => ({
      name: mood.type,
      count: mood.count,
    }));
  }

  if (moods.length > 0 && typeof moods[0] === 'object' && moods[0] !== null && "name" in moods[0] && "count" in moods[0]) {
    return moods;
  }

  const moodCounts: Record<string, number> = {};
  moods.forEach((mood: any) => {
    const moodName = (typeof mood === 'object' ? (mood.type || mood.name || mood.mood) : String(mood)) || String(mood);
    moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
  });

  return Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .map(([name, count]) => ({ name, count }));
}
