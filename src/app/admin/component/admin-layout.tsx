"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Bell,
    Menu,
    X,
    ChevronRight,
    FileText,
    BarChart3,
    ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { name: "Users", icon: Users, href: "/admin#users-table" },
        { name: "Wellbeing Alerts", icon: ShieldAlert, href: "/admin#risk-alerts-panel" },
        { name: "Guides", icon: FileText, href: "/admin/guide" },
        { name: "Notifications", icon: Bell, href: "/admin#notifications-panel" },
        { name: "Analytics", icon: BarChart3, href: "/admin#mood-chart" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex overflow-hidden">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="hidden lg:flex flex-col bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 relative z-20 transition-all duration-300 shadow-xl"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-2"
                            >
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"}
                `}>
                                    <item.icon size={20} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600"} />
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="whitespace-nowrap flex-1"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                    {isSidebarOpen && isActive && <ChevronRight size={14} className="opacity-50" />}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg dark:text-white">Echo</span>
                    </div>

                    <div className="flex-1 hidden lg:flex items-center">
                        <div className="text-sm text-slate-400 font-medium">Pages / <span className="text-slate-800 dark:text-white font-bold">System Status</span></div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scroll-smooth">
                    {children}
                </div>
            </main>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-[#1e293b] z-50 p-6 lg:hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                                    <span className="font-bold text-xl dark:text-white tracking-tight">Echo Admin</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                                            <item.icon size={20} />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
