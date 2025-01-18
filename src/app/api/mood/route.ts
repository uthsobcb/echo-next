import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
// import { connectToDatabase } from "@/app/lib/mongodb";

const openai = new OpenAI({ apiKey: process.env.API_KEY || "" });


export async function POST(req: Request) {
    try {
        // Verify JWT
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
        }

        // const token = authHeader.split(" ")[1];
        // let decoded: any;
        // try {
        //     decoded = jwt.verify(token, JWT_SECRET);
        // } catch (err) {
        //     return NextResponse.json({ error: "Unauthorized: Invalid token." }, { status: 401 });
        // }

        const { content } = await req.json();
        if (!content) {
            return NextResponse.json({ error: "Journal entry is required." }, { status: 400 });
        }

        // Call OpenAI API for mood detection
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that detects moods from journal entries." },
                { role: "user", content: `Analyze the mood from this journal entry: ${content}` },
            ],
        });

        const mood = completion.choices[0]?.message?.content?.trim();
        if (!mood) {
            return NextResponse.json({ error: "Failed to detect mood." }, { status: 500 });
        }

        // Save mood to MongoDB
        // await connectToDatabase();

        // const newMood = new Mood({ userId: decoded.userId, mood, content });
        // await newMood.save();

        return NextResponse.json({ message: "Mood saved successfully.", mood });
    } catch (error) {
        console.error("Error in mood route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

// export async function GET(req: Request) {
//     try {
//         // Verify JWT
//         const authHeader = req.headers.get("authorization");
//         if (!authHeader) {
//             return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1];
//         let decoded: any;
//         try {
//             decoded = jwt.verify(token, JWT_SECRET);
//         } catch (err) {
//             return NextResponse.json({ error: "Unauthorized: Invalid token." }, { status: 401 });
//         }

//         // Fetch moods from MongoDB
//         await connectToDatabase();

//         const moods = await Mood.find({ userId: decoded.userId });
//         return NextResponse.json(moods);
//     } catch (error) {
//         console.error("Error in mood route:", error);
//         return NextResponse.json({ error: "Internal server error." }, { status: 500 });
//     }
// }
