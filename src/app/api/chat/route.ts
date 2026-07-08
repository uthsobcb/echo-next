import { NextRequest, NextResponse } from "next/server";
import Chat from "../../models/Chat";
import { connect } from "../../lib/mongodb";
import { auth } from "@/app/lib/auth";
import { encrypt, decrypt } from "@/app/lib/encryption";
import OpenAI from "openai";

import type { IMessage } from "../../models/Chat";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://echo-companion.vercel.app", // Change this to your site's URL
        "X-Title": "Echo Companion",
    },
});

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

Always aim to make the user feel heard, seen, and safe.`;

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

        // Fetch or create the current chat
        let chat = chatId
            ? await Chat.findOne({ _id: chatId, userId: user.id }).exec()
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

        // Decrypt history for AI context
        const decryptedThreadSummary = chat.threadSummary ? decrypt(chat.threadSummary) : "";
        const decryptedMessages = chat.messages.map(m => ({
            ...m,
            text: decrypt(m.text)
        }));

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
            .map((c, i) => `Chat ${i + 1} Summary: ${decrypt(c.threadSummary as string)}`)
            .join("\n\n");

        // Add new user message (Encrypted for storage)
        const newUserMessage: IMessage = {
            role: 'user',
            text: encrypt(message),
            timestamp: new Date()
        };
        chat.messages.push(newUserMessage);

        // Build system-level prompt
        const fullSystemPrompt = `${SYSTEM_PROMPT}

Here are summaries from the user's previous conversations:
${globalContext || "No prior summaries available."}

Current conversation summary so far:
${decryptedThreadSummary || "No summary yet."}`;

        // Prepare messages for OpenRouter (OpenAI compatible)
        const chatHistory: any[] = [
            { role: "system", content: fullSystemPrompt },
            ...decryptedMessages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: "user", content: message }
        ];

        const response = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free", // Updated to the user's preferred free model
            messages: chatHistory,
        });

        const reply = response.choices[0]?.message?.content || "I'm here to listen.";

        const aiMessage: IMessage = {
            role: 'ai',
            text: encrypt(reply),
            timestamp: new Date()
        };
        chat.messages.push(aiMessage);

        // Update thread summary
        const allDecryptedMessages = [...decryptedMessages, { role: 'user', text: message }, { role: 'ai', text: reply }];
        const summaryPrompt = `Summarize the following conversation in 3–4 sentences, showing warmth and empathy:\n\n` +
            allDecryptedMessages.map(m => `${m.role === 'user' ? "User" : "Echo"}: ${m.text}`).join("\n");

        const summaryRes = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages: [{ role: "user", content: summaryPrompt }],
            max_tokens: 150
        });

        const newSummary = summaryRes.choices[0]?.message?.content;
        if (newSummary) {
            chat.threadSummary = encrypt(newSummary);
        }

        chat.updatedAt = new Date();
        await chat.save();

        return NextResponse.json({
            reply,
            chatId: chat._id,
            messages: [
                ...decryptedMessages,
                { role: 'user', text: message, timestamp: newUserMessage.timestamp },
                { role: 'ai', text: reply, timestamp: aiMessage.timestamp }
            ]
        });

    } catch (error) {
        console.error("OpenRouter API Error:", error);
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

        // Decrypt thread summaries for the list view
        const decryptedChats = chats.map(chat => ({
            ...chat,
            threadSummary: chat.threadSummary ? decrypt(chat.threadSummary) : ""
        }));

        return NextResponse.json(decryptedChats);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat history" },
            { status: 500 }
        );
    }
}