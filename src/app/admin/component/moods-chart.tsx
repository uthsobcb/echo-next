"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import React from "react";

type Mood =
  | string
  | { type?: string; count?: number; name?: string; mood?: string;[key: string]: any };

export default function MoodsChart({ moods }: { moods: Mood[] }) {
  if (!moods || !Array.isArray(moods) || moods.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-400">
        No mood data available
      </div>
    );
  }

  const chartData = processChartData(moods);
  const colors = generateColors(chartData.length);

  return (
    <div className="h-[300px] w-full bg-white dark:bg-gray-900 rounded-md shadow-sm p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "none" }}
            labelStyle={{ color: "#fff" }}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
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
    const moodName = mood.type || mood.name || mood.mood || String(mood);
    moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
  });

  return Object.entries(moodCounts).map(([name, count]) => ({ name, count }));
}

// Simple color palette generator
function generateColors(count: number) {
  const baseColors = [
    "#0ea5e9", // sky-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
  ];

  const repeatedColors = [];
  for (let i = 0; i < count; i++) {
    repeatedColors.push(baseColors[i % baseColors.length]);
  }

  return repeatedColors;
}
