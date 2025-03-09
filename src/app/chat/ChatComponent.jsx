"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Send, Loader2, User } from "lucide-react";
import Image from "next/image";

const ChatBox = ({ user }) => {
    const searchParams = useSearchParams();
    const entryContent = searchParams.get("entryContent");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userImageError, setUserImageError] = useState(false);
    const chatRef = useRef(null);

    const botImage = "/assets/loading.png";
    const userImage = user?.image;

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
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
            <div className="flex flex-col w-full md:w-3/4 h-[90vh] max-w-4xl bg-white rounded-lg shadow-lg m-4">
                {/* Chat Header */}
                <header className="p-4 bg-blue-600 text-white text-lg font-semibold rounded-t-lg">
                    Echo Chat
                </header>

                {/* Chat Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} items-end space-x-2`}>
                                {!isUser && (
                                    <Image
                                        src={botImage}
                                        alt="Echo Bot"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                )}
                                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}>
                                    <div className={`p-3 rounded-2xl ${isUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200"}`}>
                                        <p className={`text-sm md:text-base ${!isUser && "text-gray-800"}`}>{msg.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {isUser ? "You" : "Echo Bot"} • {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                                {isUser && (
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {userImageError ? (
                                            <User className="w-6 h-6 text-gray-500" />
                                        ) : (
                                            <Image
                                                src={userImage}
                                                alt="User"
                                                width={40}
                                                height={40}
                                                unoptimized={true}
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
                        <div className="flex justify-start items-end space-x-2">
                            <Image
                                src={botImage}
                                alt="Echo Bot"
                                width={40}
                                height={40}
                                className="rounded-full object-cover animate-pulse"
                            />
                            <div className="flex flex-col items-start max-w-[70%]">
                                <div className="p-3 rounded-2xl bg-white border border-gray-200">
                                    <p className="text-sm md:text-base text-gray-800">Thinking...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center space-x-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                            placeholder="Type a message..."
                            className="flex-1 p-3 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
        </div>
    );
};

export default ChatBox;
