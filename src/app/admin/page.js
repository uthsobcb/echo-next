'use client';
import React, { useEffect, useState } from 'react';
import StatsCard from './component/stats-cards';
import MoodsChart from './component/moods-chart';
import UsersTable from './component/users-table';
export default function Page() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [moods, setMoods] = useState([]);
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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);


    console.log("Users:", JSON.stringify(users, null, 2));
    console.log("Moods:", JSON.stringify(moods, null, 2));
    console.log("Entries:", JSON.stringify(entries, null, 2));

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
        <div className="min-h-screen dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Overview of users, moods, and entries
                    </p>
                </div>
                {/* <UsersTable users={users} /> */}
                {/* Stats Cards */}
                <StatsCard moods={moods} users={users} entries={entries} />

                {/* Moods Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Mood Distribution</h2>
                    <MoodsChart moods={moods} />
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User List</h2>
                    <UsersTable users={users} />
                </div>
            </div>
        </div>

    );
}
