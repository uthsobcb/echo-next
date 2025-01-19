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
                    content: "You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should contain only a single-word mood descriptor (e.g., 'happy', 'anxious', 'excited', 'frustrated'). Do not include any explanations or additional text."
                },
                {
                    role: "user",
                    content: `Analyze the mood from the following journal entry and provide a single-word response:\n\n"${content}"`
                },
            ],
        });

        const mood = completion.choices[0]?.message?.content?.trim();
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
            mood,
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
