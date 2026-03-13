"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ShieldAlert, Check, BellRing } from "lucide-react";

interface RiskAlert {
    _id: string;
    severity: "low" | "moderate" | "high";
    indicators: string[];
    triggerType: "immediate" | "threshold";
    notifiedUser: boolean;
    acknowledgedByAdmin: boolean;
    createdAt: string;
    userId: { name: string; email: string } | null;
}

const SEVERITY_STYLE: Record<RiskAlert["severity"], string> = {
    high: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50",
    moderate: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
    low: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50",
};

export default function RiskAlertsPanel() {
    const [alerts, setAlerts] = useState<RiskAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const fetchAlerts = async (all: boolean) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/risk-alerts${all ? "" : "?unacknowledged=true"}`);
            const data = await res.json();
            if (res.ok) setAlerts(data.alerts);
        } catch {
            toast.error("Failed to fetch wellbeing alerts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts(showAll);
    }, [showAll]);

    const acknowledge = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/risk-alerts/${id}`, { method: "PATCH" });
            if (!res.ok) throw new Error();
            toast.success("Marked as reviewed");
            setAlerts((prev) => showAll
                ? prev.map((a) => (a._id === id ? { ...a, acknowledgedByAdmin: true } : a))
                : prev.filter((a) => a._id !== id));
        } catch {
            toast.error("Failed to update alert");
        }
    };

    const unacknowledgedCount = alerts.filter((a) => !a.acknowledgedByAdmin).length;

    return (
        <div id="risk-alerts-panel" className="bg-white dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-red-500" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Wellbeing Alerts</h2>
                    {!showAll && unacknowledgedCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                            {unacknowledgedCount} unreviewed
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setShowAll((v) => !v)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 uppercase tracking-widest"
                >
                    {showAll ? "Show unreviewed only" : "Show all"}
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
                            <AlertTriangle size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium italic">
                            {showAll ? "No wellbeing alerts recorded." : "No unreviewed alerts. Nice."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                                    <th className="px-6 py-4">Severity</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Indicators</th>
                                    <th className="px-6 py-4">Trigger</th>
                                    <th className="px-6 py-4">When</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {alerts.map((a) => (
                                    <tr key={a._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${SEVERITY_STYLE[a.severity]}`}>
                                                {a.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 dark:text-slate-200">
                                            {a.userId ? (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs">{a.userId.name}</span>
                                                    <span className="text-[10px] text-slate-400">{a.userId.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">Deleted user</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {a.indicators.length === 0 ? (
                                                    <span className="text-slate-400 text-xs">—</span>
                                                ) : a.indicators.map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                {a.notifiedUser && <BellRing size={12} className="text-blue-500" />}
                                                {a.triggerType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-slate-500">
                                            {new Date(a.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {a.acknowledgedByAdmin ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">Reviewed</span>
                                            ) : (
                                                <button
                                                    onClick={() => acknowledge(a._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                                                >
                                                    <Check size={12} />
                                                    Mark reviewed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
