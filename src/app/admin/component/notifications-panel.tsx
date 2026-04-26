"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Users, History, Calendar, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    _id: string;
    title: string;
    body: string;
    type: string;
    sentAt: string | null;
    scheduledAt: string;
    userId?: {
        name: string;
        email: string;
    } | null;
}

export default function NotificationsPanel() {
    const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
    const [broadcastMode, setBroadcastMode] = useState<'all' | 'individual'>('all');
    const [users, setUsers] = useState<{_id: string; name: string; email: string}[]>([]);
    const [broadcastLoading, setBroadcastLoading] = useState(false);
    const [history, setHistory] = useState<Notification[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        type: "CUSTOM",
        scheduledAt: "",
        userId: ""
    });

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users/list");
            const data = await res.json();
            if (res.ok && data.users) {
                setUsers(data.users);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch("/api/admin/notifications/list");
            const data = await res.json();
            if (res.ok) {
                setHistory(data.notifications);
            }
        } catch (err) {
            toast.error("Failed to fetch notification logs");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (broadcastMode === 'individual' && !formData.userId) {
            toast.error("Please select a recipient");
            return;
        }
        
        setBroadcastLoading(true);

        try {
            const endpoint = formData.userId
                ? "/api/admin/notifications/send-to-user"
                : "/api/admin/notifications/broadcast";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            toast.success(formData.userId ? "Individual message dispatched" : "System-wide broadcast engaged");
            setFormData({
                title: "",
                body: "",
                type: "CUSTOM",
                scheduledAt: "",
                userId: ""
            });
            if (activeTab === 'history') fetchHistory();
        } catch (err: any) {
            toast.error(err.message || "Communication failure");
        } finally {
            setBroadcastLoading(false);
        }
    };

    return (
        <div id="notifications-panel" className="bg-white dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex p-2 bg-slate-50 dark:bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('send')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-2xl transition-all ${activeTab === 'send'
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                >
                    <Send size={16} />
                    Dispatch
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-2xl transition-all ${activeTab === 'history'
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                >
                    <History size={16} />
                    Log History
                </button>
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'send' ? (
                        <motion.form
                            key="send-form"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onSubmit={handleSend} className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Message Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Attention Users!"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white appearance-none"
                                    >
                                        <option value="CUSTOM">General Message</option>
                                        <option value="SYSTEM">Critical System</option>
                                        <option value="JOURNAL">Journal Nudge</option>
                                        <option value="STREAK">Streak Recovery</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Content Body</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    placeholder="Enter your message here..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Schedule Dispatch (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.scheduledAt}
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Recipient Mode</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setBroadcastMode('all'); setFormData({ ...formData, userId: "" }); }}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                                                broadcastMode === 'all'
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            <Users size={16} />
                                            All Users
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBroadcastMode('individual')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                                                broadcastMode === 'individual'
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-700"
                                            }`}
                                        >
                                            <Send size={16} />
                                            Individual
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {broadcastMode === 'individual' && (
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Recipient</label>
                                    <select
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white appearance-none"
                                    >
                                        <option value="">Select a user...</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={broadcastLoading}
                                className="relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all w-full md:w-auto mt-4 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {broadcastLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                )}
                                <span className="uppercase tracking-widest text-xs">
                                    {broadcastMode === 'all' ? "Execute Broadcast" : "Transmit to User"}
                                </span>
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="history-list"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                        >
                            {loadingHistory ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
                                        <History size={40} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-medium italic">No communication logs recorded.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Message Details</th>
                                                <th className="px-6 py-4">Destination</th>
                                                <th className="px-6 py-4 text-right whitespace-nowrap">Timeline</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {history.map((n) => (
                                                <tr key={n._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        {n.sentAt ? (
                                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/50 w-fit">
                                                                <MessageSquare size={12} />
                                                                <span className="text-[10px] font-black uppercase tracking-tight">Delivered</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800/50 w-fit">
                                                                <Clock size={12} />
                                                                <span className="text-[10px] font-black uppercase tracking-tight">Enqueued</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{n.title}</div>
                                                        <div className="text-slate-500 dark:text-slate-400 line-clamp-1 text-xs">{n.body}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                                                        {n.userId ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-[10px]">
                                                                    {n.userId.name.charAt(0)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-xs leading-none">{n.userId.name}</span>
                                                                    <span className="text-[10px] text-slate-400 mt-0.5">{n.userId.email}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50 w-fit">
                                                                <Users size={12} />
                                                                <span className="text-[10px] font-bold uppercase tracking-tight italic">Broadcast</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-slate-500 whitespace-nowrap text-[10px] font-bold text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-slate-800 dark:text-slate-200">{new Date(n.scheduledAt).toLocaleDateString()}</span>
                                                            <span className="text-slate-400">{new Date(n.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
