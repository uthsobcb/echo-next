import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../../models/Chat";
import { connect } from "../../lib/mongodb";
import { auth } from "auth";
import mongoose from "mongoose";

const apiKey = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        const { message, chatId } = await req.json();
        const session = await auth();
        const user = session?.user;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connect();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Get previous messages if chatId exists
        let previousMessages = [];
        if (chatId) {
            const existingChat = await Chat.findById(chatId).exec();
            if (existingChat) {
                previousMessages = existingChat.messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));
            }
        }

        const response = await model.generateContent({
            contents: [
                {
                    role: "model",
                    parts: [{
                        text: `You are an empathetic chatbot named Echo. 
- Respond with warmth and support.
- Do not judge, interrupt, or assume.
- Provide a safe space where users can share their thoughts freely.
- Use understanding and compassionate language.
- If a user is distressed, gently encourage self-care without diagnosing.
- Keep user engaging by asking questions.` }]
                },
                ...previousMessages,
                { role: "user", parts: [{ text: message }] }
            ]
        });

        const reply = response.response?.candidates[0]?.content?.parts[0]?.text || "I'm here to listen.";

        let chat;
        if (chatId) {
            chat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: {
                        messages: [
                            { role: 'user', text: message, timestamp: new Date() },
                            { role: 'ai', text: reply, timestamp: new Date() }
                        ]
                    },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            ).exec();
        } else {
            chat = await Chat.create({
                userId: user.id,
                messages: [
                    { role: 'user', text: message, timestamp: new Date() },
                    { role: 'ai', text: reply, timestamp: new Date() }
                ]
            });
        }

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