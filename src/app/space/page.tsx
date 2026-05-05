"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCcw, Sparkles, Heart, Lock, Trophy, User as UserIcon, PenLine } from "lucide-react";
import { toast } from "sonner";
import ScratchCard from "@/components/Space/ScratchCard";
import EtherealBackground from "@/components/Space/EtherealBackground";

interface Status {
    canDraw: boolean;
    requiresMessage: boolean;
    nextAvailableAt: string | null;
    drawCount: number;
}

interface LeaderboardEntry {
    _id: string;
    count: number;
    name: string;
    image?: string;
}

type Mode = "draw" | "post";

function Countdown({ nextAvailableAt }: { nextAvailableAt: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calc = () => {
            const diff = new Date(nextAvailableAt).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft("Available now");
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`);
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [nextAvailableAt]);

    return (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Next reveal in{" "}
            <span className="text-indigo-400">{timeLeft}</span>
        </p>
    );
}

export default function SpacePage() {
    const [mode, setMode] = useState<Mode>("draw");
    const [status, setStatus] = useState<Status | null>(null);
    const [message, setMessage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [currentCardContent, setCurrentCardContent] = useState<string | null>(null);
    const [isLoadingCard, setIsLoadingCard] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
    const [sentMessages, setSentMessages] = useState<{ id: number, content: string }[]>([]);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/space/draw");
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch status:", error);
        }
    }, []);

    const fetchLeaderboard = useCallback(async () => {
        setIsLoadingLeaderboard(true);
        try {
            const res = await fetch("/api/space/leaderboard");
            const data = await res.json();
            setLeaderboard(data.data || []);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setIsLoadingLeaderboard(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        fetchLeaderboard();
    }, [fetchStatus, fetchLeaderboard]);

    const handlePostMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message || message.length < 5) {
            toast.error("Share a bit more kindness!");
            return;
        }

        const currentMsg = message;
        setIsPosting(true);
        try {
            const res = await fetch("/api/space/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: currentMsg })
            });
            if (res.ok) {
                const id = Date.now();
                setSentMessages(prev => [...prev, { id, content: currentMsg }]);
                setTimeout(() => {
                    setSentMessages(prev => prev.filter(m => m.id !== id));
                }, 4000);

                toast.success("Kindness shared with the world!");
                setMessage("");
                fetchStatus();
                fetchLeaderboard();
                setMode("draw"); // Switch back to draw after posting
            } else {
                toast.error("Couldn't share right now.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDrawCard = async () => {
        if (!status?.canDraw) return;

        setIsLoadingCard(true);
        setIsRevealed(false);
        setCurrentCardContent(null);

        try {
            const statusRes = await fetch("/api/space/draw");
            const statusData = await statusRes.json();

            if (!statusData.canDraw) {
                toast.error("Patience is a virtue! Check limits.");
                setIsLoadingCard(false);
                return;
            }

            if (statusData.requiresMessage) {
                toast.info("Share a kind word to unlock this energy!");
                setMode("post"); // Switch to post mode to help the user
                setIsLoadingCard(false);
                return;
            }

            const drawRes = await fetch("/api/space/draw", { method: "POST" });
            if (!drawRes.ok) {
                const err = await drawRes.json();
                toast.error(err.error || "Energy flow interrupted.");
                setIsLoadingCard(false);
                return;
            }

            const msgRes = await fetch("/api/space/message");
            if (msgRes.status === 404) {
                setCurrentCardContent("Waiting for echoes... Be the first to start the ripple!");
            } else if (msgRes.ok) {
                const msgData = await msgRes.json();
                setCurrentCardContent(msgData.data.content);
            } else {
                toast.error("Failed to find a message.");
            }

            fetchStatus();
        } catch (error) {
            toast.error("Connection lost in the ripples.");
        } finally {
            setIsLoadingCard(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-900 font-sans pb-20">
            <EtherealBackground />

            {/* Ripple heart animations for sent messages */}
            <AnimatePresence>
                {sentMessages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 0], scale: [0, 1.5, 2, 4], y: -800, x: (Math.random() - 0.5) * 400 }}
                        transition={{ duration: 4, ease: "circOut" }}
                        className="fixed pointer-events-none z-50 flex flex-col items-center"
                        style={{ left: "50%", bottom: "20%" }}
                    >
                        <Heart className="text-rose-500 w-12 h-12 fill-rose-500/20" />
                        <span className="mt-2 text-indigo-700 font-black text-lg drop-shadow-[0_2px_10px_rgba(255,255,255,1)]">
                            {msg.content}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="max-w-xl mx-auto py-12 px-6 relative z-10 space-y-12">

                {/* Header (Inspired by mobile rewards) */}
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight text-indigo-900"
                    >
                        {mode === "draw" ? (currentCardContent ? "Hooray!" : "Echo Sanctuary") : "Spread Light"}
                    </motion.h1>
                    <p className="text-indigo-900/40 text-sm font-bold uppercase tracking-[0.2em]">
                        {mode === "draw"
                            ? (currentCardContent ? "You've unlocked a message" : "Reveal your hidden reward")
                            : "Your kindness matters"}
                    </p>
                </div>

                {/* Main Unified Card */}
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3.5rem] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 flex flex-col items-center relative overflow-hidden"
                >
                    {/* Mode Toggle at top */}
                    <div className="flex bg-slate-100 p-1.5 rounded-full mb-8 relative z-20">
                        <button
                            onClick={() => setMode("draw")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${mode === "draw" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Reveal
                        </button>
                        <button
                            onClick={() => setMode("post")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${mode === "post" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <PenLine className="w-3.5 h-3.5" />
                            Share
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {mode === "draw" ? (
                            <motion.div
                                key="draw-mode"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="w-full flex flex-col items-center space-y-8"
                            >
                                <div className="flex flex-col items-center justify-center w-full min-h-[300px]">
                                    {currentCardContent ? (
                                        <div className="relative">
                                            <ScratchCard onReveal={() => setIsRevealed(true)}>
                                                <div className="flex flex-col items-center space-y-4 max-w-[240px]">
                                                    <Heart className="text-rose-500 w-10 h-10 animate-pulse fill-rose-500/10" />
                                                    <p className="text-xl font-black italic text-slate-800 leading-relaxed tracking-tight text-center">
                                                        "{currentCardContent}"
                                                    </p>
                                                </div>
                                            </ScratchCard>
                                            {!isRevealed && (
                                                <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-indigo-400 text-center animate-pulse">
                                                    Scratch to reveal
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-[320px] aspect-[4/3] bg-indigo-50 border-2 border-dashed border-indigo-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-indigo-200">
                                            {isLoadingCard ? (
                                                <RefreshCcw className="w-12 h-12 animate-spin text-indigo-400" />
                                            ) : (
                                                <>
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-100">
                                                        <Lock className="w-8 h-8 text-indigo-400" />
                                                    </div>
                                                    <p className="text-xs font-black uppercase tracking-widest">Awaiting Echo</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {!currentCardContent && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDrawCard}
                                        disabled={!status?.canDraw || (status?.requiresMessage && !isRevealed) || isLoadingCard}
                                        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl transition-all duration-500 text-lg ${status?.canDraw && (!status.requiresMessage)
                                            ? "bg-indigo-600 text-white shadow-indigo-200/60"
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                            }`}
                                    >
                                        {status?.requiresMessage ? "Post Message to Unlock" : "Reveal Reward"}
                                    </motion.button>
                                )}

                                {status?.nextAvailableAt && !currentCardContent && (
                                    <Countdown nextAvailableAt={status.nextAvailableAt} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="post-mode"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full flex flex-col items-center space-y-8"
                            >
                                <form onSubmit={handlePostMessage} className="w-full space-y-6">
                                    <div className="relative group">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write a message of hope..."
                                            className="w-full h-48 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:bg-white resize-none transition-all placeholder:text-slate-300 text-slate-800 text-lg font-medium outline-none"
                                        />
                                        <div className="absolute top-6 right-6 opacity-40">
                                            <Sparkles className="text-indigo-400 w-6 h-6" />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isPosting || message.length < 5}
                                        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-30"
                                    >
                                        {isPosting ? (
                                            <RefreshCcw className="w-8 h-8 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-6 h-6" />
                                                Share Light
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-8 text-center leading-relaxed">
                                    Sharing your kindness unlocks an extra reveal for yourself.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress dots at bottom (Inspired by the reward screen) */}
                    <div className="flex gap-1.5 mt-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${status?.drawCount && status.drawCount >= i ? "bg-indigo-500 w-4" : "bg-slate-200"}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Leaderboard - Centered and Slim */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-white/90 rounded-[3rem] p-10 shadow-xl shadow-indigo-50/50 border border-white backdrop-blur-3xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Soul Stars</h2>
                            <p className="text-indigo-600/40 font-bold uppercase tracking-[0.2em] text-[10px]">Top Light-Bearers</p>
                        </div>
                        <Trophy className="text-yellow-500 w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                        {isLoadingLeaderboard ? (
                            <div className="flex justify-center py-10">
                                <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin" />
                            </div>
                        ) : leaderboard.length > 0 ? (
                            leaderboard.slice(0, 5).map((entry, index) => (
                                <div
                                    key={entry._id}
                                    className="flex items-center justify-between p-4 group hover:bg-slate-50 rounded-[2rem] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 text-center font-black italic text-slate-200">{index + 1}</div>
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden shadow-sm">
                                            {entry.image ? (
                                                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="text-indigo-300 w-6 h-6" />
                                            )}
                                        </div>
                                        <p className="font-black text-slate-800 uppercase tracking-tighter">{entry.name}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                                        <span className="text-sm font-black text-slate-900">{entry.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-slate-300 text-xs font-black uppercase tracking-widest">Sanctuary is quiet...</p>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
