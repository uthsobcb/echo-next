'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import "react-calendar-heatmap/dist/styles.css";

const HeatMap = dynamic(() => import('react-calendar-heatmap'), { ssr: false });


export default function EntryHeatmap({ token }) {
    const [entries, setEntries] = useState([]);

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
        .map(v => new Date(v.date))
        .filter(date => date.getFullYear() === currentYear)
        .sort((a, b) => a - b)[0];

    const startDate = firstEntryThisYear || new Date(currentYear, 0, 1);


    const heatmapData = Array.isArray(entries)
        ? entries.reduce((acc, entry) => {
            const date = new Date(entry.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {})
        : {};

    const values = Object.entries(heatmapData).map(([date, count]) => ({ date, count }));

    return (
        <div className="w-full max-w-4xl mx-auto lg:px-4 py-6 shadow rounded-xl bg-white/60">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
                Your Writing Streak
            </h2>
            <div className="overflow-x-auto">
                <HeatMap
                    startDate={startDate}
                    endDate={new Date()}
                    values={values}
                    classForValue={(value) => {
                        if (!value) return 'color-empty';
                        if (value.count > 3) return 'color-github-4';
                        if (value.count > 2) return 'color-github-3';
                        if (value.count > 1) return 'color-github-2';
                        return 'color-github-1';
                    }}
                    tooltipDataAttrs={(value) => ({
                        'data-tip': `${value.date} — ${value.count} entries`,
                    })}
                    showWeekdayLabels
                />
            </div>
        </div>

    );
}
