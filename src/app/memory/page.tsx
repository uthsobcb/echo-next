import { auth } from "@/app/lib/auth";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { BookOpen, Sparkles, CalendarDays, PenLine } from "lucide-react";
import MemoryEntries from "./MemoryEntries";

const QUOTES = [
    { text: "Sometimes you will never know the value of a moment until it becomes a memory.", author: "Dr. Seuss" },
    { text: "The secret of a good memory is attention, and attention to a subject depends on our interest in it.", author: "William Walker Atkinson" },
    { text: "Memories are the key not to the past, but to the future.", author: "Corrie ten Boom" },
    { text: "One day you will look back and see that all along you were blooming.", author: "Morgan Harper Nichols" },
];

export default async function MemoryPage() {
    const session = await auth();

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-gray-500 font-medium">Please log in to view your memories.</p>
                    <Link href="/login" className="text-indigo-600 hover:underline text-sm font-semibold">
                        Go to login →
                    </Link>
                </div>
            </div>
        );
    }

    let journalEntries: any[] = [];
    try {
        const response = await axios.get(`${process.env.BASEURL}/api/entries`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            withCredentials: true,
        });
        journalEntries = response.data ?? [];
    } catch (error: any) {
        console.error("Error fetching entries:", error.response?.data || error.message);
    }

    // Stats derived server-side
    const totalEntries  = journalEntries.length;
    const uniqueMoods   = new Set(journalEntries.map((e: any) => (e.mood ?? "").toLowerCase())).size;
    const oldestEntry   = journalEntries.length
        ? journalEntries.reduce((acc: any, e: any) =>
            new Date(e.createdAt) < new Date(acc.createdAt) ? e : acc
          )
        : null;
    const journalingSince = oldestEntry
        ? format(new Date(oldestEntry.createdAt), "MMM yyyy")
        : null;

    // Pick a random quote (deterministic per day via date seed)
    const dayIndex = new Date().getDate() % QUOTES.length;
    const quote = QUOTES[dayIndex];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900">

                {/* Atmospheric blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/25 rounded-full blur-3xl translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />

                {/* Subtle dot grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />

                <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-14">

                    {/* Label */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-7 h-7 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em]">Your Journal</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                        Your{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Memories
                        </span>
                    </h1>
                    <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-10">
                        A quiet space to look back, reflect, and notice how far you&apos;ve come.
                    </p>

                    {/* Stats row */}
                    {totalEntries > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <div>
                                    <p className="text-white font-black text-lg leading-none">{totalEntries}</p>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
                                        {totalEntries === 1 ? "Entry" : "Entries"}
                                    </p>
                                </div>
                            </div>

                            {journalingSince && (
                                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                                    <CalendarDays className="w-4 h-4 text-violet-400" />
                                    <div>
                                        <p className="text-white font-black text-lg leading-none">{journalingSince}</p>
                                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Since</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                                <span className="text-lg leading-none">🎭</span>
                                <div>
                                    <p className="text-white font-black text-lg leading-none">{uniqueMoods}</p>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
                                        {uniqueMoods === 1 ? "Mood" : "Moods"}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/entry"
                                className="flex items-center gap-2 bg-white text-indigo-700 font-black text-sm px-4 py-2.5 rounded-2xl hover:bg-indigo-50 transition shadow-lg shadow-black/20"
                            >
                                <PenLine className="w-4 h-4" />
                                New entry
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href="/entry"
                            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm px-5 py-3 rounded-2xl transition shadow-xl shadow-indigo-900/50"
                        >
                            <PenLine className="w-4 h-4" />
                            Write your first memory
                        </Link>
                    )}

                    {/* Quote */}
                    <div className="mt-10 border-t border-white/10 pt-8">
                        <p className="text-white/40 text-sm italic leading-relaxed max-w-lg">
                            &ldquo;{quote.text}&rdquo;
                        </p>
                        <p className="text-white/25 text-xs font-bold mt-2">— {quote.author}</p>
                    </div>
                </div>
            </div>

            {/* ── Entries ── */}
            <div className="pt-6">
                <MemoryEntries entries={journalEntries} />
            </div>
        </div>
    );
}
