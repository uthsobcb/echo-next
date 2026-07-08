import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import Mood from "@/app/models/Mood";
import Todo from "@/app/models/Todo";
import UserModel from "@/app/models/User";
import { encrypt } from "@/app/lib/encryption";
import { recordRiskFlagAndMaybeNotify } from "@/app/lib/safety";

const RISK_INDICATOR_TAGS = [
    "hopelessness",
    "worthlessness",
    "passive-ideation",
    "active-ideation",
    "self-harm-urge",
    "plan-or-method",
    "previous-attempt-mentioned",
    "substance-use-crisis",
] as const;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;



const openrouter = new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        'HTTP-Referer': 'https://echojournal.life',
        'X-Title': 'Echo Space',
    },
});

export async function POST(req: Request) {
    try {

        const { content, imgUrl } = await req.json();
        if (!content) {
            return NextResponse.json({ error: "Journal entry is required." }, { status: 400 });
        }


        await connect();
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }




        const prompt = `You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:
  - \`mood\`: An object containing:
  - \`label\`: A single, commonly used word that represents the overall emotional tone, avoiding complex or overly paraphrased terms.
  - \`score\`: A numerical rating out of 10, where positive scores indicate positive mood, 0 means neutral negetive score indicated negative mode.
  - \`comment\`: A supportive message based on the mood, offering suggestions for improvement if needed.
    - \`todo\`: An array of objects, where each object represents a meaningful, actionable task identified in the journal entry—either explicitly stated or reasonably inferred. Only include tasks that seem important or relevant to the user's well-being or goals; it's not necessary to list everything.
    Each task should follow this structure:
            - \`todo\`: A clear, concise description of the task or goal.
            - \`type\`: The category of the task (e.g., "mental health", "general", "work", "personal").
            - \`status\`: The current status of the task, such as "pending", "completed", or "in progress".
  - \`risk\`: A safety assessment for self-harm or suicidal thoughts. An object containing:
    - \`severity\`: One of "none", "low", "moderate", "high", using this rubric:
      - "none": No indication of self-harm or suicidal thoughts.
      - "low": Passive hopelessness, worthlessness, or exhaustion with life (e.g. "I feel like giving up"), but no wish to die or self-harm.
      - "moderate": Explicit suicidal ideation or self-harm urges without a specific plan, method, or timeline (e.g. "I think about not being here anymore", "I want to hurt myself").
      - "high": Explicit intent, a plan, a method, a timeline, access to means, or a direct statement of wanting to end their life or harm themselves imminently.
    - \`indicators\`: An array of zero or more tags chosen ONLY from this fixed list, whichever apply: ${JSON.stringify(RISK_INDICATOR_TAGS)}. Do not invent new tags and do not quote the journal text.
    Be conservative: only assess above "none" when the text actually supports it, not for ordinary sadness or stress.

Ensure the response is empathetic and concise.
Analyze the following journal entry and provide the requested JSON response: "${content}"`;


        interface TodoItem {
            todo: string;
            type: string;
            status: string;
        }

        function normalizeRisk(raw: any): { severity: "none" | "low" | "moderate" | "high"; indicators: string[] } {
            const severity = ["none", "low", "moderate", "high"].includes(raw?.severity) ? raw.severity : "none";
            const indicators = Array.isArray(raw?.indicators)
                ? raw.indicators.filter((tag: unknown) => (RISK_INDICATOR_TAGS as readonly string[]).includes(tag as string))
                : [];
            return { severity, indicators };
        }

        let mood: string | undefined, parsedMood: any, todos: TodoItem[] = [];
        let risk: { severity: "none" | "low" | "moderate" | "high"; indicators: string[] } = { severity: "none", indicators: [] };
        try {
            const completion = await openrouter.chat.completions.create({
                model: "openai/gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: prompt.replace(`Analyze the following journal entry and provide the requested JSON response: "${content}"`, "")
                    },
                    {
                        role: "user",
                        content: `Analyze the following journal entry and provide the requested JSON response:\n\n"${content}"`
                    },
                ],
            });
            mood = completion.choices[0]?.message?.content?.trim();
        } catch (error) {
            console.error("Error with OpenRouter API:", error);
            return NextResponse.json({ error: "Failed to process mood analysis." }, { status: 500 });
        }

        function extractJson(response: string): string {
            const start = response.indexOf('{');
            const end = response.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                return response.slice(start, end + 1);
            }
            return response.replace(/```json|```/g, '').trim();
        }

        function normalizeStatus(status: string): string {
            const s = status?.toLowerCase().trim();
            if (s === 'in progress' || s === 'in_progress') return 'in-progress';
            if (s === 'completed' || s === 'done') return 'completed';
            return 'pending';
        }

        try {
            const jsonStr = typeof mood === "string" ? extractJson(mood) : JSON.stringify(mood);
            const raw = JSON.parse(jsonStr);

            const rawTodos = Array.isArray(raw.todo) ? raw.todo
                : Array.isArray(raw.todos) ? raw.todos
                : [];

            if (raw.mood) {
                parsedMood = raw.mood;
            } else {
                parsedMood = raw;
            }

            risk = normalizeRisk(raw.risk);

            todos = rawTodos.map((item: any) => ({
                todo: item.todo || item.task || '',
                type: item.type || 'general',
                status: normalizeStatus(item.status || 'pending'),
            })).filter((item: TodoItem) => item.todo.trim() !== '');

        } catch (error) {
            console.error("Error parsing mood:", error);
            parsedMood = { label: "Unknown", score: 0, comment: "No valid response received." };
        }
        // const parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;

        if (!mood) {
            return NextResponse.json({ error: "Failed to detect mood." }, { status: 500 });
        }

        await connect();

        const dbUser = await UserModel.findById(user?.id);
        if (!dbUser) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const userTimezone = dbUser.timezone || "UTC";

        // Gamification Logic
        const now = new Date();
        const currentDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimezone }).format(now);

        let newStreak = dbUser.currentStreak || 0;
        let maxStreak = dbUser.maxStreak || 0;
        let totalXp = dbUser.totalXp || 0;
        let milestoneMessage = null;

        if (!dbUser.lastEntryDate) {
            newStreak = 1;
            totalXp += 10;
        } else {
            const lastEntryStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTimezone }).format(dbUser.lastEntryDate);

            const currentDt = new Date(currentDateStr);
            const lastDt = new Date(lastEntryStr);
            const diffTime = currentDt.getTime() - lastDt.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                totalXp += 10;
            } else if (diffDays === 1) {
                newStreak += 1;
                totalXp += 10;
                if (newStreak % 7 === 0) {
                    totalXp += 50;
                    milestoneMessage = `Wow! ${newStreak} Day Streak! +50 Bonus XP!`;
                }
            } else {
                newStreak = 1;
                totalXp += 10;
            }
        }

        maxStreak = Math.max(maxStreak, newStreak);

        dbUser.currentStreak = newStreak;
        dbUser.maxStreak = maxStreak;
        dbUser.totalXp = totalXp;
        dbUser.lastEntryDate = now;
        await dbUser.save();

        const encryptedContent = encrypt(content);

        const newMood = new Mood({
            userId: user?.id,
            mood: parsedMood?.label,
            score: parsedMood?.score,
            comment: parsedMood?.comment,
            content: encryptedContent,
            imgUrl: imgUrl || "",
            // todo: parsedMood?.todo,
            riskSeverity: risk.severity,
            createdAt: new Date(),
        });
        await newMood.save();

        await recordRiskFlagAndMaybeNotify({
            userId: user.id,
            moodEntryId: newMood._id,
            severity: risk.severity,
            indicators: risk.indicators,
        });

        let savedTodos: TodoItem[] = [];
        if (todos.length > 0) {
            try {
                const newTodo = todos.map(item => ({
                    userId: user?.id,
                    todo: item.todo,
                    type: item.type,
                    status: item.status,
                }));
                await Todo.insertMany(newTodo);
                savedTodos = todos;
            } catch (todoError) {
                console.error("Error saving todos:", todoError);
            }
        }

        return NextResponse.json({
            message: "Mood saved successfully.",
            mood: parsedMood.label,
            comment: parsedMood.comment,
            score: parsedMood.score,
            todo: savedTodos,
            risk: { severity: risk.severity },
            streakData: {
                streak: newStreak,
                totalXp,
                milestoneReached: !!milestoneMessage,
                milestoneMessage: milestoneMessage ?? null,
            }
        });

    } catch (error) {
        console.error("Error in mood route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
