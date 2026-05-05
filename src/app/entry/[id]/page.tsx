import Link from "next/link";
import { auth } from "@/app/lib/auth";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import {
    ArrowLeft,
    Clock,
    Sparkles,
    MessageCircle,
    Pencil,
    BookOpen,
    ChevronRight,
} from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";

function getMoodGradient(score: number) {
    if (score > 6) return "from-emerald-400 via-teal-400 to-cyan-500";
    if (score > 2) return "from-violet-500 via-indigo-500 to-blue-500";
    if (score > -2) return "from-blue-400 via-indigo-400 to-violet-400";
    if (score > -6) return "from-purple-500 via-violet-500 to-indigo-500";
    return "from-slate-500 via-slate-400 to-blue-400";
}

function getMoodEmoji(mood: string): string {
    const m = (mood ?? "").toLowerCase();
    if (m.includes("happy") || m.includes("joy") || m.includes("excit")) return "😊";
    if (m.includes("calm") || m.includes("peace") || m.includes("content")) return "😌";
    if (m.includes("grateful") || m.includes("thankful") || m.includes("blessed")) return "🥰";
    if (m.includes("loved") || m.includes("love")) return "❤️";
    if (m.includes("motivated") || m.includes("inspired") || m.includes("energe")) return "✨";
    if (m.includes("anxious") || m.includes("worr") || m.includes("stress")) return "😰";
    if (m.includes("sad") || m.includes("depress") || m.includes("unhappy")) return "😔";
    if (m.includes("angry") || m.includes("frustrat")) return "😤";
    if (m.includes("tired") || m.includes("exhaust")) return "😴";
    if (m.includes("neutral") || m.includes("okay") || m.includes("fine")) return "😐";
    return "💭";
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-gray-500 font-medium">Please log in to view this entry.</p>
                    <Link href="/login" className="text-indigo-600 hover:underline text-sm font-semibold">
                        Go to login →
                    </Link>
                </div>
            </div>
        );
    }

    try {
        const { id } = await params;
        const response = await axios.get(`${process.env.BASEURL}/api/entries/${id}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            withCredentials: true,
        });

        const entry = response.data;
        const score: number = typeof entry.score === "number" ? entry.score : 0;
        const gradient = getMoodGradient(score);
        const emoji = getMoodEmoji(entry.mood ?? "");

        const fullDate = entry.createdAt
            ? format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")
            : "Unknown Date";
        const shortDate = entry.createdAt
            ? format(new Date(entry.createdAt), "MMM d")
            : "";
        const time = entry.createdAt
            ? format(new Date(entry.createdAt), "h:mm a")
            : "";

        const wordCount = entry.content
            ? entry.content.trim().split(/\s+/).filter(Boolean).length
            : 0;

        const scorePercent = Math.min(100, Math.max(0, Math.round(((score + 10) / 20) * 100)));
        const scoreLabel = score > 0 ? `+${score}` : `${score}`;

    return (
            <div className="min-h-screen bg-[#F8FAFC]">

                {/* ── Sticky nav bar ── */}
                <div className="sticky top-20 z-40 px-4 pt-3">
                    <div className="max-w-3xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-sm border border-white/60">
                        <Link
                            href="/profile"
                            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Entries
                        </Link>

                        <div className="flex items-center gap-1">
                            <Link href={`/entry/${entry._id}/edit`}>
                                <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition">
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                            </Link>
                            <DeleteButton entryId={entry._id} accessToken={session.accessToken} />
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 pt-5 pb-20 space-y-5">

                    {/* ── Hero card ── */}
                    <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} shadow-2xl`}>
                        {/* decorative blobs */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

                        <div className="relative z-10 p-7 md:p-10">
                            {/* top row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Personal Journal
                                    </p>
                                    <h1 className="text-white font-black text-2xl md:text-3xl leading-tight tracking-tight">
                                        {fullDate}
                                    </h1>
                                    <div className="flex items-center gap-3 text-white/70 text-xs font-semibold pt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {time}
                                        </span>
                                        <span className="w-0.5 h-3 bg-white/30 rounded-full" />
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {wordCount} words
                                        </span>
                                    </div>
                                </div>

                                {/* mood pill */}
                                <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-center">
                                    <div className="text-3xl leading-none">{emoji}</div>
                                    <p className="text-white font-black text-xs mt-1.5 capitalize tracking-wide">
                                        {entry.mood}
                                    </p>
                                </div>
                            </div>

                            {/* mood score bar */}
                            <div className="mt-6 space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Mood Score</span>
                                    <span className="text-white font-black text-sm">{scoreLabel} / 10</span>
                                </div>
                                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/80 rounded-full"
                                        style={{ width: `${scorePercent}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-white/40 text-[9px] font-bold uppercase tracking-widest">
                                    <span>Low</span>
                                    <span>Neutral</span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Journal paper ── */}
                    <div className="relative">
                        {/* Polaroid photo */}
                        {entry.imgUrl && (
                            <div className="absolute -top-5 right-3 md:right-6 z-10 rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default">
                                <div className="bg-white p-2 pb-7 shadow-xl rounded-md">
                                    <Image
                                        src={entry.imgUrl}
                                        width={110}
                                        height={110}
                                        alt="Attached memory"
                                        unoptimized
                                        className="object-cover rounded-sm w-[90px] h-[90px] md:w-[110px] md:h-[110px]"
                                    />
                                    <p className="font-handwriting text-gray-400 text-xs text-center absolute bottom-1.5 left-0 right-0">
                                        memory
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Paper card */}
                        <div className="bg-[#FEFDF8] rounded-3xl shadow-md border border-amber-100/60 overflow-hidden">
                            {/* coloured top strip */}
                            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                            {/* ruled-line effect */}
                            <div className="px-7 md:px-12 pt-10 pb-12"
                                style={{
                                    backgroundImage: "repeating-linear-gradient(transparent, transparent 39px, #e8e8e8 39px, #e8e8e8 40px)",
                                    backgroundPositionY: "12px",
                                }}
                            >
                                {/* Red margin line */}
                                <div className="relative">
                                    <div className="absolute -left-7 md:-left-12 top-0 bottom-0 w-px bg-red-300/40" />
                                    <p className="font-handwriting text-3xl md:text-[2.6rem] text-gray-800 leading-[2.5rem] tracking-wide whitespace-pre-wrap min-h-[120px]">
                                        {entry.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Echo's Reflection ── */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* header */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="font-black text-gray-900 text-sm tracking-tight">Echo's Reflection</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    AI insight · {shortDate}
                                </p>
                            </div>
                        </div>

                        {/* body */}
                        <div className="px-6 md:px-8 py-6 space-y-5">
                            <div className="flex gap-3">
                                <div className="w-1 rounded-full bg-gradient-to-b from-indigo-400 to-violet-400 flex-shrink-0" />
                                <p className="text-gray-700 text-base leading-relaxed italic">
                                    "{entry.comment}"
                                </p>
                            </div>

                            <Link
                                href={{ pathname: "/chat", query: { entryContent: entry.content } }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200/60 hover:shadow-xl hover:shadow-indigo-200/80 transition-all group"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Talk to Echo about this
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        );
    } catch (err) {
        console.error("Error fetching entry:", err);
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                        <BookOpen className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-gray-700 font-semibold">Could not load this entry.</p>
                    <p className="text-gray-400 text-sm">It may have been deleted or you may not have access.</p>
                    <Link href="/profile" className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Back to profile
                    </Link>
                </div>
            </div>
        );
    }
}
