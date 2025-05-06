import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../../models/Chat";
import { connect } from "../../lib/mongodb";
import { auth } from "auth";
import mongoose from "mongoose";

import type { IMessage } from "../../models/Chat";

const apiKey = process.env.GEMINI_API!;
const genAI = new GoogleGenerativeAI(apiKey);
const SYSTEM_PROMPT = `You are Echo, an empathetic AI companion designed to support users through journaling and self-reflection.

Your role is to:
- Respond with warmth, compassion, and non-judgmental tone.
- Acknowledge the user's emotions without offering clinical diagnosis.
- Encourage self-awareness, emotional insight, and gentle self-care.
- Keep the user engaged by asking thoughtful, reflective, or open-ended questions.
- Avoid giving direct advice unless explicitly asked.
- Do not assume facts beyond what the user has shared.

You will be given:
1. Summaries of the user's previous conversations with Echo — use them as background knowledge to understand the user's recurring struggles, emotional patterns, or personal growth.
2. A summary of the current conversation to date — use it to continue the chat without repeating past content.
3. A message from the user — this is what you must directly respond to.

Always aim to make the user feel heard, seen, and safe.

Begin the response now.`;

export async function POST(req: NextRequest) {
    try {
        const { message, chatId } = await req.json();
        const session = await auth();
        const user = session?.user;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Fetch or create the current chat
        let chat = chatId
            ? await Chat.findById(chatId).exec()
            : await Chat.create({
                userId: user.id,
                messages: [],
                threadSummary: "",
                createdAt: new Date(),
                updatedAt: new Date()
            });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        // Fetch summaries from user's other chats (exclude current chat)
        const otherChats = await Chat.find({
            userId: user.id,
            _id: { $ne: chat._id }
        })
            .select("threadSummary")
            .lean();

        const globalContext = otherChats
            .filter(c => c.threadSummary)
            .slice(-5) // Limit to last 5 summaries for token efficiency
            .map((c, i) => `Chat ${i + 1} Summary: ${c.threadSummary}`)
            .join("\n\n");

        // Add new user message
        const newUserMessage: IMessage = {
            role: 'user',
            text: message,
            timestamp: new Date()
        };
        chat.messages.push(newUserMessage);

        // Build system-level prompt with context from other chats and this one
        const fullPrompt = `${SYSTEM_PROMPT}

Here are summaries from the user's previous conversations:
${globalContext || "No prior summaries available."}

Current conversation summary so far:
${chat.threadSummary || "No summary yet."}

Now continue the conversation below.`;

        const chatHistory = [
            { role: "model", parts: [{ text: fullPrompt }] },
            ...chat.messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }))
        ];

        const response = await model.generateContent({ contents: chatHistory });

        const reply = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to listen.";

        const aiMessage: IMessage = {
            role: 'ai',
            text: reply,
            timestamp: new Date()
        };
        chat.messages.push(aiMessage);

        // Update thread summary for this chat
        const summaryPrompt = `Summarize the following conversation in 3–4 sentences, showing warmth and empathy:\n\n` +
            chat.messages.map(m => `${m.role === 'user' ? "User" : "Echo"}: ${m.text}`).join("\n");

        const summaryRes = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: summaryPrompt }] }]
        });

        const newSummary = summaryRes.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (newSummary) {
            chat.threadSummary = newSummary;
        }

        chat.updatedAt = new Date();
        await chat.save();

        return NextResponse.json({
            reply,
            chatId: chat._id,
            messages: chat.messages
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connect();

        const chats = await Chat.find({ userId: user.id })
            .sort({ updatedAt: -1 })
            .lean()
            .exec();

        return NextResponse.json(chats);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat history" },
            { status: 500 }
        );
    }
}