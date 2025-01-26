import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/app/lib/mongodb";
import { auth } from "auth";
import Mood from "@/app/models/Mood";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function POST(req: Request) {
    try {

        const { content } = await req.json();
        if (!content) {
            return NextResponse.json({ error: "Journal entry is required." }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:\n\n- `mood`: An object containing:\n  - `label`: A single word representing the overall emotional tone.\n  - `score`: A numerical rating out of 20, where higher scores indicate a more positive mood.\n  - `comment`: A supportive message based on the mood, offering encouragement or suggestions for improvement if needed.\n\nEnsure the response is empathetic and concise."
                },
                {
                    role: "user",
                    content: `Analyze the following journal entry and provide the requested JSON response:\n\n"${content}"`
                },
            ],
        });


        const mood = completion.choices[0]?.message?.content?.trim();
        const parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;

        if (!mood) {
            return NextResponse.json({ error: "Failed to detect mood." }, { status: 500 });
        }

        await connect();


        const session = await auth();
        const user = session?.user;
        if (!user) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }
        const newMood = new Mood({
            userId: user?.id,
            mood: parsedMood.label,
            score: parsedMood.score,
            comment: parsedMood.comment,
            content,
            createdAt: new Date(),
        });
        await newMood.save();

        return NextResponse.json({ message: "Mood saved successfully.", mood });
    } catch (error) {
        console.error("Error in mood route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
