"use client";

import { Users, BarChart, FileText } from "lucide-react";
import { AdminUser } from "./users-table";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Users Card */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Total Users
          </h4>
          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">{users.length}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Active accounts in the system
        </p>
      </div>

      {/* Mood Types Card */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Mood Types
          </h4>
          <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">{uniqueMoodTypes.size}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Different mood categories tracked
        </p>
      </div>

      {/* Total Entries Card */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Total Entries
          </h4>
          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white">{entries}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mood entries recorded
        </p>
      </div>
    </div>
  );
}
