"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Send, Loader2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ChatBox = ({ user }) => {
    const searchParams = useSearchParams();
    const entryContent = searchParams.get("entryContent");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userImageError, setUserImageError] = useState(false);
    const chatRef = useRef(null);
    const [oldChats, setOldChats] = useState([]);

    const botImage = "/assets/loading.png";
    const userImage = user?.image;

    // fetch all chats from the database from api /api/chat
    useEffect(() => {
        const oldChats = async () => {
            const res = await axios.get("/api/chat");
            setOldChats(res.data);
            console.log("oldChats", res.data);
        }
        oldChats();
    }, []);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;


        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");

        try {
            setLoading(true);
            const res = await axios.post("/api/chat", { message: text });
            const aiReply = res.data.reply || "I'm here to listen.";

            setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) => [...prev, { role: "ai", text: "Oops! Something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (entryContent) sendMessage(entryContent);
    }, [entryContent]);

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r overflow-y-auto shadow-md z-10">
                <div className="flex flex-col p-4 space-y-2">
                    {oldChats.map((chat, i) => (
                        <Link
                            key={i}
                            href={`/chat/${chat._id}`}
                            className="w-full text-left px-4 py-2 rounded-lg transition hover:bg-blue-50 border border-gray-100 text-sm font-medium truncate"
                        >
                            {chat.message || `Chat ${i + 1}`}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex flex-col flex-1 max-w-full relative">
                {/* Header */}
                <header className="p-4 bg-blue-600 text-white text-lg font-semibold shadow-sm">
                    Echo Chat
                </header>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 scroll-smooth">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                            <div
                                key={i}
                                className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-3`}
                            >
                                {!isUser && (
                                    <Image
                                        src={botImage}
                                        alt="Echo Bot"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover shadow"
                                    />
                                )}
                                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]"`}>
                                    <div
                                        className={`p-3 rounded-2xl shadow-sm ${isUser
                                                ? "bg-blue-600 text-white"
                                                : "bg-white border border-gray-200 text-gray-800"
                                            }`}
                                    >
                                        <p className="text-sm md:text-base leading-snug whitespace-pre-wrap">
                                            {msg.text}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {isUser ? "You" : "Echo Bot"} • {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                                {isUser && (
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow">
                                        {userImageError ? (
                                            <User className="w-6 h-6 text-gray-500" />
                                        ) : (
                                            <Image
                                                src={userImage}
                                                alt="User"
                                                width={40}
                                                height={40}
                                                unoptimized
                                                className="rounded-full object-cover"
                                                onError={() => setUserImageError(true)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex justify-start items-end gap-3">
                            <Image
                                src={botImage}
                                alt="Echo Bot"
                                width={40}
                                height={40}
                                className="rounded-full object-cover animate-pulse"
                            />
                            <div className="flex flex-col items-start max-w-[70%]">
                                <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                    <p className="text-sm md:text-base text-gray-800">Thinking...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Input Bar */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                            placeholder="Type a message..."
                            className="flex-1 p-3 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>

    );
};

export default ChatBox;
