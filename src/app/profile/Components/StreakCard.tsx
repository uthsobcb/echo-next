"use client";

import { Flame, Trophy, CheckCircle2, Circle, Star } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
    entries: any[];
    currentStreak: number;
    maxStreak: number;
    totalXp: number;
}

export default function StreakCard({ entries, currentStreak, maxStreak, totalXp }: StreakCardProps) {
    const currentYear = new Date().getFullYear();

    // 1. Weekly Status (S M T W T F S)
    const getWeeklyStatus = () => {
        const dates = [...new Set(entries.map(e => new Date(e.createdAt).toISOString().split('T')[0]))];
        const activeDates = new Set(dates);

        const days = [];
        const now = new Date();
        const currentDay = now.getDay(); // 0 is Sunday

        // Get the start of the current week (Sunday)
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - currentDay);

        for (let i = 0; i < 7; i++) {
            const day = new Date(sunday);
            day.setDate(sunday.getDate() + i);
            const dateStr = day.toISOString().split('T')[0];
            days.push({
                name: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
                fullDate: dateStr,
                isToday: dateStr === now.toISOString().split('T')[0],
                isActive: activeDates.has(dateStr)
            });
        }
        return days;
    };

    const weeklyDays = getWeeklyStatus();

    // 2. Milestone calculation
    const getNextMilestone = () => {
        const count = entries.length;
        if (count < 7) return { target: 7, name: "Pen Whisperer", start: 0 };
        if (count < 30) return { target: 30, name: "Mindful Scribe", start: 7 };
        if (count < 45) return { target: 45, name: "Thought Architect", start: 30 };
        if (count < 60) return { target: 60, name: "Guardian of Inked Wisdom", start: 45 };
        return { target: 100, name: "Echo Legend", start: 60 };
    };

    const milestone = getNextMilestone();
    const progress = Math.min(100, Math.max(0, ((entries.length - milestone.start) / (milestone.target - milestone.start)) * 100));

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden relative group">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                    {/* Streak Fire Section */}
                    <div className="flex items-center gap-6">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-30 animate-pulse-glow" />
                            <Flame size={80} className="text-orange-500 relative z-10 fill-orange-500 drop-shadow-md" />
                        </motion.div>

                        <div>
                            <h3 className="text-5xl font-black text-gray-900 leading-none mb-2">
                                {currentStreak}
                            </h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                                Day Streak
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="bg-gray-50 rounded-2xl px-6 py-4 flex items-center gap-4 border border-gray-100">
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Trophy className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Personal Best</p>
                                <p className="text-xl font-black text-gray-900">{maxStreak} Days</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl px-6 py-4 flex items-center gap-4 border border-gray-100">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Star className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total XP</p>
                                <p className="text-xl font-black text-gray-900">{totalXp}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly View */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-gray-900 font-bold text-lg">Weekly Progress</h4>
                        <span className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">This Week</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        {weeklyDays.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                                <span className={`text-xs font-black ${day.isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    {day.name}
                                </span>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`
                    w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300
                    ${day.isActive
                                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200 border-2 border-white'
                                            : day.isToday
                                                ? 'bg-white border-2 border-dashed border-indigo-300'
                                                : 'bg-gray-100 border-2 border-transparent'
                                        }
                  `}
                                >
                                    {day.isActive ? (
                                        <Flame size={20} className="text-white fill-white" />
                                    ) : day.isToday ? (
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                    ) : null}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Milestone Progress */}
                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            <span className="font-bold text-sm uppercase tracking-wider">Next Milestone</span>
                        </div>
                        <span className="text-xs font-black bg-white/20 px-2 py-1 rounded-md">{milestone.name}</span>
                    </div>

                    <div className="relative h-4 bg-white/20 rounded-full overflow-hidden mb-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                    </div>

                    <p className="text-sm font-medium text-white/90 text-center">
                        {milestone.target - entries.length} more entries to unlock your next badge!
                    </p>
                </div>
            </div>
        </div>
    );
}
