'use client';
import React, { useEffect, useState } from 'react';
import StatsCard from './component/stats-cards';
import MoodsChart from './component/moods-chart';
import UsersTable, { AdminUser } from './component/users-table';
import NotificationsPanel from './component/notifications-panel';
import RiskAlertsPanel from './component/risk-alerts-panel';
import AdminLayout from './component/admin-layout';

interface AdminStats {
    users: AdminUser[];
    mood: { mood: string }[];
    entries: number;
}

export default function Page() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [moods, setMoods] = useState<{ mood: string }[]>([]);
    const [entries, setEntries] = useState(0);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const { users, mood, entries } = await response.json();

                setStats({ users, mood, entries });
                setUsers(users);
                setMoods(mood);
                setEntries(entries);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);


    // console.log("Users:", JSON.stringify(users, null, 2));
    // console.log("Moods:", JSON.stringify(moods, null, 2));
    // console.log("Entries:", JSON.stringify(entries, null, 2));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
                <p className="ml-4 text-blue-600 font-semibold text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600 font-medium">
                <svg
                    className="w-6 h-6 mr-2 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                    />
                </svg>
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Real-time analytics and user management
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live Status
                        </div>
                    </div>
                </div>
                {/* <UsersTable users={users} /> */}
                {/* Stats Cards */}
                <StatsCard moods={moods} users={users} entries={entries} />

                {/* Wellbeing / Risk Alerts */}
                <RiskAlertsPanel />

                {/* Moods Chart */}
                <div id="mood-chart" className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Mood Distribution</h2>
                    <MoodsChart moods={moods} />
                </div>

                {/* Notifications Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Management</h2>
                    <NotificationsPanel />
                </div>

                {/* Users Table */}
                <div id="users-table" className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">User Database</h2>
                    <UsersTable users={users} />
                </div>
            </div>
        </AdminLayout>

    );
}
