'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import "react-calendar-heatmap/dist/styles.css";

const HeatMap = dynamic(() => import('react-calendar-heatmap'), { ssr: false });


export default function EntryHeatmap({ token }: { token: string }) {
    const [entries, setEntries] = useState<any[]>([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await axios.get('/api/entries', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEntries(res.data || []);
            } catch (err) {
                console.error("Failed to load entries:", err);
            }
        };

        fetchEntries();
    }, [token]);
    const currentYear = new Date().getFullYear();

    // Find the earliest date in the current year
    const firstEntryThisYear = entries
        .map(v => new Date(v.createdAt))
        .filter(date => date.getFullYear() === currentYear)
        .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];

    const startDate = firstEntryThisYear || new Date(currentYear, 0, 1);

    const heatmapData = Array.isArray(entries)
        ? entries.reduce((acc: any, entry: any) => {
            const date = new Date(entry.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as any)
        : {};

    const values = Object.entries(heatmapData).map(([date, count]) => ({ date, count }));

    // Calculate Streak
    const calculateStreaks = () => {
        if (!entries.length) return { current: 0, longest: 0 };

        const dates = [...new Set(entries.map(e => new Date(e.createdAt).toISOString().split('T')[0]))].sort().reverse();

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if streak is active (today or yesterday)
        const latestEntry = dates[0];
        const isActive = latestEntry === today || latestEntry === yesterday;

        if (isActive) {
            let nextExpected = latestEntry;
            for (const date of dates) {
                if (date === nextExpected) {
                    currentStreak++;
                    const d = new Date(date);
                    d.setDate(d.getDate() - 1);
                    nextExpected = d.toISOString().split('T')[0];
                } else {
                    break;
                }
            }
        }

        // Longest streak
        const sortedDates = [...dates].reverse();
        let prevDate: string | null = null;
        for (const date of sortedDates) {
            if (!prevDate) {
                tempStreak = 1;
            } else {
                const prev: Date = new Date(prevDate);
                prev.setDate(prev.getDate() + 1);
                const expected: string = prev.toISOString().split('T')[0];
                if (date === expected) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
            prevDate = date;
        }

        return { current: currentStreak, longest: longestStreak };
    };

    const { current: streak, longest: maxStreak } = calculateStreaks();

    return (
        <div className="w-full max-w-4xl mx-auto lg:px-4 py-8 shadow-lg rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Writing Streak ✍️
                </h2>
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Streak</p>
                        <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                            🔥 {streak} {streak === 1 ? 'day' : 'days'}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Longest Streak</p>
                        <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                            🏆 {maxStreak}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto px-2">
                <HeatMap
                    startDate={startDate}
                    endDate={new Date()}
                    values={values}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty';
                        if (value.count > 3) return 'color-github-4';
                        if (value.count > 2) return 'color-github-3';
                        if (value.count > 1) return 'color-github-2';
                        return 'color-github-1';
                    }}
                    tooltipDataAttrs={(value: any) => {
                        if (!value || !value.date) {
                            return {};
                        }
                        return {
                            'data-tooltip-id': 'heatmap-tooltip',
                            'data-tooltip-content': `${value.date}: ${value.count} ${value.count === 1 ? 'entry' : 'entries'}`,
                        } as any;
                    }}
                    showWeekdayLabels
                />
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
                Consistency is key to a healthier mind. Keep sharing your thoughts with Echo.
            </p>
        </div>
    );
}
