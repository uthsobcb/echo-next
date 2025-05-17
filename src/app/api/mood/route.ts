import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/app/lib/mongodb";
import { auth } from "auth";
import Mood from "@/app/models/Mood";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import {
    GoogleGenerativeAI,
} from "@google/generative-ai";
import { decrypt, encrypt } from "@/app/lib/encryption";

const apiKey = process.env.GEMINI_API;

const genAI = new GoogleGenerativeAI(apiKey);

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

        const previousEntries = await Mood.find({ userId: user?.id })
            .sort({ createdAt: -1 })
            .limit(3);

        const decryptedEntries = previousEntries.map(entry => decrypt(entry.content));
        const journalHistory = decryptedEntries.join("\n\n");



        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:
        Context: Below is a brief history of this user's recent journal entries to help you understand their ongoing emotional trends:
        ${journalHistory}
  - \`mood\`: An object containing:
  - \`label\`: A single, commonly used word that represents the overall emotional tone, avoiding complex or overly paraphrased terms.
  - \`score\`: A numerical rating out of 10, where positive scores indicate positive mood, 0 means neutral negetive score indicated negative mode.
  - \`comment\`: A supportive message based on the mood and context of this entry and recent entries of (journalHistory) offering suggestions for improvement if needed.
  Ensure the response is empathetic and concise.
  - \`todo\`: A list of tasks, goals, or plans explicitly or implicitly mentioned by the user in the journal entry. Extract actionable items in a clear and concise manner.
Analyze the following journal entry and provide the requested JSON response: "${content}"`;

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });


        const response = result.response;
        const mood = response.candidates[0].content.parts[0].text;

        console.log(mood);

        function cleanResponse(response) {
            return response.replace(/```json|```/g, '').trim();
        }

        //OAI method
        // const completion = await openai.chat.completions.create({
        //     model: "gpt-4",
        //     messages: [
        //         {
        //             role: "system",
        //             content: "You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:\n\n- `mood`: An object containing:\n  - `label`: A single word representing the overall emotional tone.\n  - `score`: A numerical rating out of 20, where higher scores indicate a more positive mood.\n  - `comment`: A supportive message based on the mood, offering encouragement or suggestions for improvement if needed.\n\nEnsure the response is empathetic and concise."
        //         },
        //         {
        //             role: "user",
        //             content: `Analyze the following journal entry and provide the requested JSON response:\n\n"${content}"`
        //         },
        //     ],
        // });


        // const mood = completion.choices[0]?.message?.content?.trim();

        let parsedMood;
        try {
            const cleanedResponse = typeof mood === "string" ? cleanResponse(mood) : mood;

            parsedMood = typeof cleanedResponse === "string" ? JSON.parse(cleanedResponse) : cleanedResponse;

            // If `parsedMood` has a nested "mood" key, extract the inner mood object.
            if (parsedMood.mood) {
                parsedMood = parsedMood.mood;
            }

            // OAI method
            // parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;
            // If `parsedMood` has a nested "mood" key, extract the correct value
            // if (parsedMood.mood) {
            //     parsedMood = parsedMood.mood; // This ensures you're only getting the inner mood object
            // }
        } catch (error) {
            console.error("Error parsing mood:", error);
            parsedMood = { label: "Unknown", score: 0, comment: "No valid response received." };
        }
        // const parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;

        if (!mood) {
            return NextResponse.json({ error: "Failed to detect mood." }, { status: 500 });
        }

        await connect();


        const encryptedContent = encrypt(content);

        const newMood = new Mood({
            userId: user?.id,
            mood: parsedMood?.label,
            score: parsedMood?.score,
            comment: parsedMood?.comment,
            content: encryptedContent,
            imgUrl: imgUrl || "",
            todo: parsedMood?.todo,
            createdAt: new Date(),
        });
        console.log("Saving mood with todos:", parsedMood?.todo);
        await newMood.save();

        return NextResponse.json({
            message: "Mood saved successfully.", mood: parsedMood.label, comment: parsedMood.comment, score: parsedMood.score,
        });
    } catch (error) {
        console.error("Error in mood route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
