import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import Mood from "@/app/models/Mood";
import UserModel from "@/app/models/User";
import { decrypt } from "@/app/lib/encryption";
import OpenAI from "openai";

// ─── Config ───────────────────────────────────────────────────────────────────

const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://my-echo.space",
        "X-Title": "Echo Space",
    },
});

type Range = "week" | "month" | "year";
const RANGE_DAYS: Record<Range, number> = { week: 7, month: 30, year: 365 };

// ─── Stop-words ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
    "yours", "yourself", "he", "him", "his", "she", "her", "hers", "it", "its",
    "they", "them", "their", "theirs", "what", "which", "who", "this", "that",
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should",
    "may", "might", "must", "can", "could", "not", "and", "but", "or", "nor",
    "for", "so", "yet", "both", "either", "neither", "although", "since", "while",
    "the", "a", "an", "to", "of", "in", "on", "at", "by", "as", "with", "about",
    "into", "through", "during", "before", "after", "above", "below", "between",
    "out", "off", "over", "under", "then", "once", "just", "also", "up", "if",
    "when", "than", "too", "very", "get", "got", "go", "went", "from", "more",
    "no", "all", "each", "few", "how", "some", "such", "own", "same", "other",
    "any", "was", "one", "two", "they", "now", "day", "today", "like", "know",
    "feel", "felt", "think", "thought", "need", "want", "really", "much"
]);

// ─── Topic classifier ─────────────────────────────────────────────────────────

const TOPIC_KEYWORDS: Record<string, string[]> = {
    Work: ["work", "job", "meeting", "project", "deadline", "office", "boss", "client", "career", "task", "email", "presentation", "colleague", "team", "manager"],
    Family: ["family", "mom", "dad", "mother", "father", "sister", "brother", "kids", "child", "children", "husband", "wife", "partner", "parents", "home"],
    Health: ["health", "sleep", "tired", "exercise", "gym", "run", "walk", "diet", "eat", "doctor", "pain", "sick", "mental", "anxiety", "stress", "meditation", "breathe"],
    Goals: ["goal", "goals", "plan", "plans", "future", "dream", "achieve", "success", "growth", "learn", "study", "improve", "habit", "progress", "target"],
    Gratitude: ["grateful", "gratitude", "thankful", "blessed", "appreciate", "appreciate", "thankful", "happy", "joy", "love", "wonderful", "amazing", "great", "positive"],
};

function classifyTopics(text: string): string[] {
    const lower = text.toLowerCase();
    return Object.entries(TOPIC_KEYWORDS)
        .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
        .map(([topic]) => topic);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLocalDateStr(date: Date, tz: string): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(date);
}

function getDayLabel(date: Date, tz: string): string {
    return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(date);
}

function buildDateRange(days: number, tz: string): string[] {
    const dates: string[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(getLocalDateStr(d, tz));
    }
    return dates;
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

// ─── AI insights caching ──────────────────────────────────────────────────────
// In-process map: "userId::date" → string[]
// Lightweight for serverless (resets per cold start, which is fine — once/day
// per warm instance). For a proper cache, use Redis/KV.
const insightsCache = new Map<string, string[]>();

async function getAiInsights(
    userId: string,
    moodSummary: string,
    topTopics: { topic: string; count: number }[]
): Promise<string[]> {
    const todayKey = `${userId}::${new Date().toISOString().slice(0, 10)}`;
    if (insightsCache.has(todayKey)) return insightsCache.get(todayKey)!;

    const topicsText = topTopics.map(t => `${t.topic} (${t.count}x)`).join(", ") || "general";

    try {
        const completion = await openrouter.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a motivational journaling coach. Keep responses brief, warm, and personal. Return ONLY a JSON array of 2 short insight strings, no markdown."
                },
                {
                    role: "user",
                    content: `Given a user's recent journal stats — mood summary: "${moodSummary}", top topics: ${topicsText} — write 2 short motivational insight bullets (start each with an emoji). Example format: ["🔥 You're on a roll this week!", "💡 Try writing about your goals more often."]. Return ONLY the JSON array.`
                }
            ],
            max_tokens: 150,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || "[]";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const insights = Array.isArray(parsed) ? parsed.slice(0, 2) : ["📈 Keep up the great journaling habit!", "💡 Consistency is the key to self-growth."];
        insightsCache.set(todayKey, insights);
        return insights;
    } catch {
        return ["📈 Keep up the great journaling habit!", "💡 Consistency is the key to self-growth."];
    }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        await connect();

        const session = await auth(req);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        // Validate range param
        const rawRange = req.nextUrl.searchParams.get("range") ?? "week";
        if (!["week", "month", "year"].includes(rawRange)) {
            return NextResponse.json({ error: "Invalid range. Use week, month, or year." }, { status: 400 });
        }
        const range = rawRange as Range;
        const days = RANGE_DAYS[range];

        // Fetch user for timezone + streak
        const dbUser = await UserModel.findById(userId);
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const tz = dbUser.timezone || "UTC";
        const now = new Date();
        const rangeStart = new Date(now);
        rangeStart.setDate(rangeStart.getDate() - days);

        const prevRangeStart = new Date(rangeStart);
        prevRangeStart.setDate(prevRangeStart.getDate() - days);

        // Fetch entries for current and previous period (for comparison)
        const [currentEntries, previousEntries] = await Promise.all([
            Mood.find({ userId, createdAt: { $gte: rangeStart, $lte: now } }).sort({ createdAt: 1 }),
            Mood.find({ userId, createdAt: { $gte: prevRangeStart, $lt: rangeStart } }),
        ]);

        // Decrypt content for text analysis
        const decryptedEntries = currentEntries.map(e => ({
            ...e.toObject(),
            content: (() => {
                try { return e.content?.includes(":") ? decrypt(e.content) : e.content; }
                catch { return ""; }
            })()
        }));

        // ── Stats ──────────────────────────────────────────────────────────────
        const totalEntries = currentEntries.length;
        const avgWordCount = totalEntries === 0 ? 0 :
            Math.round(decryptedEntries.reduce((sum, e) => sum + countWords(e.content), 0) / totalEntries);

        const stats = {
            totalEntries,
            currentStreak: dbUser.currentStreak ?? 0,
            bestStreak: dbUser.maxStreak ?? 0,
            avgWordCount,
        };

        // ── Mood Timeline ──────────────────────────────────────────────────────
        const moodTimeline = currentEntries.map(e => ({
            day: getDayLabel(e.createdAt, tz),
            date: getLocalDateStr(e.createdAt, tz),
            mood: e.mood?.toLowerCase() ?? "",
            score: e.score ?? 0,
        }));

        // ── Activity Calendar ──────────────────────────────────────────────────
        const entryDatesSet = new Set(currentEntries.map(e => getLocalDateStr(e.createdAt, tz)));
        const allDates = buildDateRange(days, tz);
        const activityCalendar = allDates.map(date => ({ date, hasEntry: entryDatesSet.has(date) }));

        // ── Writing Trend (daily entry count) ─────────────────────────────────
        const writingTrendMap: Record<string, number> = {};
        for (const e of currentEntries) {
            const label = getLocalDateStr(e.createdAt, tz);
            writingTrendMap[label] = (writingTrendMap[label] ?? 0) + 1;
        }
        const writingTrend = allDates.map(date => ({
            label: new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short", day: "numeric" }).format(new Date(date + "T12:00:00Z")),
            count: writingTrendMap[date] ?? 0,
        }));

        // ── Weekly Entries (group into weeks) ─────────────────────────────────
        const weeklyMap: Record<string, number> = {};
        for (const e of currentEntries) {
            const d = new Date(e.createdAt);
            const weekNum = Math.floor((days - Math.floor((now.getTime() - d.getTime()) / 86400000)) / 7);
            const label = `W${Math.max(1, weekNum + 1)}`;
            weeklyMap[label] = (weeklyMap[label] ?? 0) + 1;
        }
        const numWeeks = Math.ceil(days / 7);
        const weeklyEntries = Array.from({ length: numWeeks }, (_, i) => ({
            label: `W${i + 1}`,
            count: weeklyMap[`W${i + 1}`] ?? 0,
        }));

        // ── Top Topics ─────────────────────────────────────────────────────────
        const topicCounts: Record<string, number> = {};
        for (const e of decryptedEntries) {
            for (const topic of classifyTopics(e.content)) {
                topicCounts[topic] = (topicCounts[topic] ?? 0) + 1;
            }
        }
        const topTopics = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([topic, count]) => ({ topic, count }));

        // ── Common Words ───────────────────────────────────────────────────────
        const wordFreq: Record<string, number> = {};
        for (const e of decryptedEntries) {
            for (const word of tokenize(e.content)) {
                wordFreq[word] = (wordFreq[word] ?? 0) + 1;
            }
        }
        const commonWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, frequency]) => ({ word, frequency }));

        // ── Writing Trend Comparison ───────────────────────────────────────────
        const curr = currentEntries.length;
        const prev = previousEntries.length;
        let writingTrendComparison: string;
        if (prev === 0) {
            writingTrendComparison = curr > 0 ? "+100%" : "0%";
        } else {
            const pct = Math.round(((curr - prev) / prev) * 100);
            writingTrendComparison = pct >= 0 ? `+${pct}%` : `${pct}%`;
        }

        // ── AI Insights ────────────────────────────────────────────────────────
        const moodLabels = currentEntries.map(e => e.mood).filter(Boolean);
        const moodFreq: Record<string, number> = {};
        for (const m of moodLabels) moodFreq[m] = (moodFreq[m] ?? 0) + 1;
        const dominantMood = Object.entries(moodFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral";
        const moodSummary = `dominant mood this period is ${dominantMood}, average score ${moodLabels.length > 0
                ? (currentEntries.reduce((s, e) => s + (e.score ?? 0), 0) / currentEntries.length).toFixed(1)
                : "0"
            }/10 across ${totalEntries} entries`;

        const aiInsights = await getAiInsights(userId, moodSummary, topTopics);

        // ── Response ───────────────────────────────────────────────────────────
        return NextResponse.json({
            stats,
            moodTimeline,
            writingTrend,
            weeklyEntries,
            topTopics,
            commonWords,
            activityCalendar,
            aiInsights,
            writingTrendComparison,
        });

    } catch (error) {
        console.error("Error in /api/insights:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
