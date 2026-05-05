"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
    Search, SortDesc, SortAsc, BookOpen, ChevronRight, X, PenLine,
} from "lucide-react";

type FilterKey = "all" | "positive" | "neutral" | "difficult";

const FILTERS: { key: FilterKey; label: string; emoji: string }[] = [
    { key: "all",       label: "All",       emoji: "✦" },
    { key: "positive",  label: "Positive",  emoji: "😊" },
    { key: "neutral",   label: "Neutral",   emoji: "😐" },
    { key: "difficult", label: "Difficult", emoji: "😔" },
];

function getMoodGradient(score: number) {
    if (score > 6)  return "from-emerald-400 to-teal-500";
    if (score > 2)  return "from-violet-500 to-indigo-500";
    if (score > -2) return "from-blue-400 to-indigo-400";
    if (score > -6) return "from-purple-500 to-violet-500";
    return "from-slate-400 to-slate-500";
}

function getMoodEmoji(mood: string): string {
    const m = (mood ?? "").toLowerCase();
    if (m.includes("happy") || m.includes("joy") || m.includes("excit"))             return "😊";
    if (m.includes("calm") || m.includes("peace") || m.includes("content"))          return "😌";
    if (m.includes("grateful") || m.includes("thankful") || m.includes("blessed"))   return "🥰";
    if (m.includes("loved") || m.includes("love"))                                   return "❤️";
    if (m.includes("motivated") || m.includes("inspired") || m.includes("energe"))   return "✨";
    if (m.includes("anxious") || m.includes("worr") || m.includes("stress"))         return "😰";
    if (m.includes("sad") || m.includes("depress") || m.includes("unhappy"))         return "😔";
    if (m.includes("angry") || m.includes("frustrat"))                               return "😤";
    if (m.includes("tired") || m.includes("exhaust"))                                return "😴";
    if (m.includes("neutral") || m.includes("okay") || m.includes("fine"))          return "😐";
    return "💭";
}

function truncate(text: string, words: number) {
    const arr = (text ?? "").trim().split(/\s+/);
    return arr.length <= words ? text : arr.slice(0, words).join(" ") + "…";
}

function wordCount(text: string) {
    return (text ?? "").trim().split(/\s+/).filter(Boolean).length;
}

interface Entry {
    _id: string;
    mood: string;
    score: number;
    content: string;
    comment?: string;
    imgUrl?: string;
    createdAt: string;
}

export default function MemoryEntries({ entries }: { entries: Entry[] }) {
    const [search, setSearch]   = useState("");
    const [filter, setFilter]   = useState<FilterKey>("all");
    const [newest, setNewest]   = useState(true);

    const filtered = useMemo(() => {
        let list = [...entries];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (e) =>
                    (e.content ?? "").toLowerCase().includes(q) ||
                    (e.mood ?? "").toLowerCase().includes(q),
            );
        }

        if (filter === "positive")  list = list.filter((e) => (e.score ?? 0) > 0);
        if (filter === "neutral")   list = list.filter((e) => (e.score ?? 0) === 0);
        if (filter === "difficult") list = list.filter((e) => (e.score ?? 0) < 0);

        list.sort((a, b) => {
            const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return newest ? -diff : diff;
        });

        return list;
    }, [entries, search, filter, newest]);

    return (
        <div className="max-w-5xl mx-auto px-4 pb-20 space-y-6">

            {/* ── Search + controls ── */}
            <div className="sticky top-20 z-30 pt-3">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">

                    {/* Text search */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by mood or content…"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter pills + sort */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilter(f.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        filter === f.key
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    <span>{f.emoji}</span>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setNewest((n) => !n)}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition px-3 py-1.5 rounded-full hover:bg-indigo-50"
                        >
                            {newest ? <SortDesc className="w-3.5 h-3.5" /> : <SortAsc className="w-3.5 h-3.5" />}
                            {newest ? "Newest first" : "Oldest first"}
                        </button>
                    </div>
                </div>

                {/* Result count */}
                <p className="text-xs text-gray-400 font-bold px-1 pt-2">
                    {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                    {search && ` matching "${search}"`}
                </p>
            </div>

            {/* ── Entry grid ── */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-5 py-24 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="w-9 h-9 text-indigo-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-700 font-semibold text-lg">
                            {search || filter !== "all" ? "No matching entries found" : "Your story starts here"}
                        </p>
                        <p className="text-gray-400 text-sm max-w-xs">
                            {search || filter !== "all"
                                ? "Try a different search term or filter."
                                : "Write your first journal entry and it will appear here."}
                        </p>
                    </div>
                    {!search && filter === "all" && (
                        <Link
                            href="/entry"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition"
                        >
                            <PenLine className="w-4 h-4" />
                            Write your first entry
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((entry) => {
                        const score    = entry.score ?? 0;
                        const gradient = getMoodGradient(score);
                        const emoji    = getMoodEmoji(entry.mood ?? "");
                        const words    = wordCount(entry.content);
                        const preview  = truncate(entry.content, 30);
                        const scoreLabel = score > 0 ? `+${score}` : `${score}`;

                        const dateObj = entry.createdAt ? new Date(entry.createdAt) : null;
                        const dayName  = dateObj ? format(dateObj, "EEEE")          : "";
                        const dateFull = dateObj ? format(dateObj, "MMM d, yyyy")   : "Unknown date";
                        const timeStr  = dateObj ? format(dateObj, "h:mm a")        : "";

                        return (
                            <Link
                                key={entry._id}
                                href={`/entry/${entry._id}`}
                                className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {/* Mood gradient strip */}
                                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                                <div className="p-5 space-y-4">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {dayName}
                                            </p>
                                            <p className="text-lg font-black text-gray-900 leading-tight">
                                                {dateFull}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{timeStr}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <span className="text-2xl">{emoji}</span>
                                            <span className="text-xs font-bold text-gray-600 capitalize">{entry.mood}</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                score > 0
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : score < 0
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}>
                                                {scoreLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content preview */}
                                    <div className="relative">
                                        {entry.imgUrl && (
                                            <div className="float-right ml-3 mb-1 shrink-0">
                                                <Image
                                                    src={entry.imgUrl}
                                                    width={64}
                                                    height={64}
                                                    alt="Memory"
                                                    unoptimized
                                                    className="w-14 h-14 object-cover rounded-lg shadow-sm rotate-1"
                                                />
                                            </div>
                                        )}
                                        <p className="font-handwriting text-xl text-gray-700 leading-snug overflow-hidden">
                                            {preview}
                                        </p>
                                        <div className="clear-both" />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {words} {words === 1 ? "word" : "words"}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-500 group-hover:text-indigo-700 transition-colors">
                                            Read entry
                                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
