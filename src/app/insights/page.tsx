"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import {
    Calendar, TrendingUp, Award, MessageCircle, BarChart3,
    Sparkles, Flame, Star, BookOpen, Clock, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

export default function InsightsPage() {
    const [range, setRange] = useState("week");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/insights?range=${range}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching insights:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [range]);

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Analyzing your journey...</p>
                </div>
            </div>
        );
    }

    const {
        stats,
        moodTimeline,
        writingTrend,
        weeklyEntries,
        topTopics,
        commonWords,
        activityCalendar,
        aiInsights,
        writingTrendComparison,
        badgeProgress
    } = data || {};

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header & Range Selector */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            <Sparkles className="text-indigo-600 w-10 h-10" />
                            AI Insights
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Deep patterns and personal growth metrics</p>
                    </div>

                    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 flex gap-1">
                        {["week", "month", "year"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${range === r
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        label="Total Entries"
                        value={stats?.totalEntries}
                        icon={<BookOpen className="text-blue-600" />}
                        bg="bg-blue-50"
                        comparison={writingTrendComparison}
                    />
                    <StatCard
                        label="Current Streak"
                        value={stats?.currentStreak}
                        icon={<Flame className="text-orange-500 fill-orange-500" />}
                        bg="bg-orange-50"
                    />
                    <StatCard
                        label="Total XP"
                        value={stats?.totalXp}
                        icon={<Star className="text-yellow-500 fill-yellow-500" />}
                        bg="bg-yellow-50"
                    />
                    <StatCard
                        label="Avg. Word Count"
                        value={stats?.avgWordCount}
                        icon={<Clock className="text-indigo-600" />}
                        bg="bg-indigo-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Mood Timeline */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" />
                            Mood Timeline
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moodTimeline}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: "#fff", stroke: "#6366f1", strokeWidth: 3 }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="w-32 h-32 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                            <Sparkles className="text-indigo-600" />
                            Echo Insights
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {aiInsights?.map((insight: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 text-gray-700 font-medium leading-relaxed italic"
                                >
                                    {insight}
                                </motion.div>
                            ))}
                        </div>

                        {/* writing trend comparison mini widget */}
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Trend Comparison</p>
                            <div className="flex items-center gap-2">
                                <div className={`text-2xl font-black ${writingTrendComparison?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {writingTrendComparison}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">vs previous period</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Top Topics Radar */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="text-indigo-600" />
                            Topic Analysis
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius="80%" data={topTopics}>
                                    <PolarGrid stroke="#f1f5f9" />
                                    <PolarAngleAxis
                                        dataKey="topic"
                                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }}
                                    />
                                    <Radar
                                        name="Entries"
                                        dataKey="count"
                                        stroke="#8b5cf6"
                                        fill="#a78bfa"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Common Words tag cloud style */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MessageCircle className="text-indigo-600" />
                            Recurring Thoughts
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {commonWords?.map((item: any, idx: number) => (
                                <motion.span
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        fontSize: `${Math.max(14, Math.min(28, 14 + item.frequency * 2))}px`,
                                        opacity: Math.max(0.6, Math.min(1, 0.4 + item.frequency / 10))
                                    }}
                                    className="bg-gray-50 px-4 py-2 rounded-xl text-indigo-700 font-bold border border-gray-100"
                                >
                                    {item.word}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Calendar Heatmap */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="text-indigo-600" />
                        Consistency Calendar
                    </h3>
                    <div className="heatmap-container -mx-4 overflow-x-auto px-4 pb-4">
                        <div className="min-w-[800px]">
                            <CalendarHeatmap
                                startDate={new Date(Date.now() - 365 * 86400000)}
                                endDate={new Date()}
                                values={activityCalendar.map((d: any) => ({
                                    date: d.date,
                                    count: d.hasEntry ? 1 : 0
                                }))}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return "color-empty";
                                    return `color-filled`;
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Badge Progress Section */}
                {badgeProgress && (
                    <div className="bg-indigo-600 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                            <Award className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-black mb-4">You're becoming a legend!</h2>
                                <p className="text-indigo-100 text-lg font-medium max-w-lg mb-8">
                                    {badgeProgress.entriesUntilNext === 0
                                        ? "You've unlocked all current milestones! Incredible consistency."
                                        : `Stay consistent! You are just ${badgeProgress.entriesUntilNext} entries away from becoming a "${badgeProgress.nextBadge}".`
                                    }
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                                    {badgeProgress.milestones.map((m: any, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center gap-3">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${m.earned ? 'bg-white text-indigo-600 border-white' : 'bg-white/10 text-white/50 border-white/20'}`}>
                                                <Award className={m.earned ? "fill-indigo-600" : ""} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter text-center leading-none ${m.earned ? 'text-white' : 'text-white/40'}`}>
                                                {m.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {badgeProgress.nextBadge && (
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex-1 w-full md:max-w-xs text-center">
                                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-4">Next Target</p>
                                    <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-xl">
                                        <Award className="w-12 h-12 text-indigo-600" />
                                    </div>
                                    <h4 className="text-xl font-black mb-1">{badgeProgress.nextBadge}</h4>
                                    <div className="h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            style={{ width: `${Math.min(100, ((stats.allTimeEntries / badgeProgress.nextBadgeAt) * 100))}%` }}
                                        />
                                    </div>
                                    <p className="text-xs font-bold mt-2 text-indigo-100">
                                        {stats.allTimeEntries} / {badgeProgress.nextBadgeAt}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .react-calendar-heatmap .color-filled { fill: #6366f1; }
                .react-calendar-heatmap .color-empty { fill: #f1f5f9; }
                .react-calendar-heatmap rect { rx: 2px; }
            `}</style>
        </div>
    );
}

function StatCard({ label, value, icon, bg, comparison }: any) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
                <div className={`${bg} p-3 rounded-2xl`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                    <h4 className="text-2xl font-black text-gray-900">{value}</h4>
                </div>
            </div>
            {comparison && (
                <div className="flex items-center gap-1.5 pt-4 border-t border-gray-50">
                    {comparison.startsWith('+') ? (
                        <ArrowUpRight size={14} className="text-green-600" />
                    ) : (
                        <ArrowDownRight size={14} className="text-red-600" />
                    )}
                    <span className={`text-xs font-bold ${comparison.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {comparison}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">vs prev. range</span>
                </div>
            )}
        </div>
    );
}
