"use client";

import React from "react";
import { Users, BarChart, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { AdminUser } from "./users-table";
import { motion } from "framer-motion";

type Mood = { type?: string; name?: string; mood?: string } | string;

interface StatsCardsProps {
  users: AdminUser[];
  moods: Mood[];
  entries: number;
}

export default function StatsCards({ users, moods, entries }: StatsCardsProps) {
  const uniqueMoodTypes = new Set<string>();

  moods.forEach((mood: Mood) => {
    const name = (typeof mood === 'object' ? (mood.type || mood.name || mood.mood) : String(mood)) || String(mood);
    uniqueMoodTypes.add(name);
  });

  const cards = [
    {
      title: "Total Users",
      value: users.length,
      description: "Active accounts",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20",
      trend: "+12%"
    },
    {
      title: "Mood Categories",
      value: uniqueMoodTypes.size,
      description: "Total types tracked",
      icon: BarChart,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      trend: "+3"
    },
    {
      title: "Total Entries",
      value: entries,
      description: "Journals recorded",
      icon: FileText,
      color: "from-purple-500 to-pink-600",
      shadow: "shadow-purple-500/20",
      trend: "+154"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -5 }}
          className="relative group h-full"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.03] dark:opacity-[0.1] rounded-3xl transition-opacity group-hover:opacity-[0.05] dark:group-hover:opacity-[0.15]`}></div>
          <div className={`h-full bg-white dark:bg-slate-800/40 backdrop-blur-sm border border-white dark:border-slate-700/50 rounded-3xl p-6 shadow-xl ${card.shadow} flex flex-col`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                <card.icon size={22} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                <ArrowUpRight size={10} />
                {card.trend}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{card.title}</h4>
              <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                {card.value}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-400 font-medium">
              <TrendingUp size={14} className="text-blue-500" />
              {card.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
