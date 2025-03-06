"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Send, Loader2, User } from "lucide-react";
import Image from "next/image";

const ChatBox = () => {
    const searchParams = useSearchParams();
    const entryContent = searchParams.get("entryContent");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    const botImage = "/assets/loading.png";

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
        <div className="flex items-center justify-center  w-full">
            <div className="flex flex-col w-full md:w-3/4 h-screen max-w-4xl">
                {/* Chat Header */}
                <header className="p-3 md:p-4 bg-gray-800 text-white text-base md:text-lg font-semibold shadow flex items-center">
                    Echo Chat
                </header>

                {/* Chat Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                            <div key={i} className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? "ml-auto items-end" : "items-start"}`}>
                                <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-center space-x-1 md:space-x-2`}>
                                    <div className="relative flex flex-col items-center">
                                        <div className={`relative p-2 md:p-3 ${isUser
                                            ? "bg-gradient-to-r from-blue-600 to-blue-700"
                                            : "bg-gradient-to-r from-cyan-600 to-blue-600"
                                            } text-white rounded-lg shadow-lg mb-2 text-sm md:text-base`}>
                                            <p>{msg.text}</p>
                                            <div className={`absolute w-2 md:w-3 h-2 md:h-3 ${isUser
                                                ? "bg-blue-700"
                                                : "bg-blue-600"
                                                } transform rotate-45 bottom-[-4px] md:bottom-[-6px] left-1/2 -translate-x-1/2`}></div>
                                        </div>
                                        <Image
                                            src={isUser ? "/assets/user-avatar.png" : botImage}
                                            alt={isUser ? "User" : "Echo Bot"}
                                            height={20}
                                            width={20}
                                            className="w-16 h-16 md:w-20 md:h-20"
                                        />
                                    </div>
                                </div>
                                <span className="text-[10px] md:text-xs text-gray-400 mt-1">
                                    {isUser ? "You" : "Echo Bot"} • {new Date().toLocaleTimeString()}
                                </span>
                            </div>
                        );
                    })}

                    {loading && (
                        <div className={`flex flex-col max-w-[85%] md:max-w-[70%] items-start`}>
                            <div className="flex justify-start items-center space-x-1 md:space-x-2">
                                <div className="relative flex flex-col items-center">
                                    <div className="relative p-2 md:p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-lg mb-2 text-sm md:text-base">
                                        <p>Thinking...</p>
                                        <div className="absolute w-2 md:w-3 h-2 md:h-3 bg-blue-600 transform rotate-45 bottom-[-4px] md:bottom-[-6px] left-1/2 -translate-x-1/2"></div>
                                    </div>
                                    <Image
                                        src={botImage}
                                        alt="Echo Bot"
                                        height={20}
                                        width={20}
                                        className="w-16 h-16 md:w-20 md:h-20 animate-pulse"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="p-2 md:p-4bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center space-x-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 md:p-3 rounded-full bg-gray-700 text-white outline-none text-sm md:text-base"
                        disabled={loading}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        className="bg-green-500 px-4 md:px-6 py-2 md:py-3 rounded-full text-white text-sm md:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
