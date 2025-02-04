import { NextRequest, NextResponse } from "next/server";
import {
    GoogleGenerativeAI,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API;

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const response = await model.generateContent({
            contents: [
                {
                    role: "model",
                    parts: [
                        {
                            text: `You are an empathetic chatbot named Echo. 
              - Respond with warmth and support.
              - Do not judge, interrupt, or assume.
              - Provide a safe space where users can share their thoughts freely.
              - Use understanding and compassionate language.
              - If a user is distressed, gently encourage self-care without diagnosing.
              - Keep user engazing by asking question. 
              `
                        },
                    ],
                },
                { role: "user", parts: [{ text: message }] },
            ],
        });

        const reply = response.response?.candidates[0]?.content?.parts[0]?.text || "I'm here to listen.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
