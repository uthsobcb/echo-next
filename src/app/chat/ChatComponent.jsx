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

    const visibleMessages = messages.slice(-2);
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full sm:max-w-full lg:max-w-2xl h-[70vh] sm:h-full flex flex-col shadow-xl rounded-2xl overflow-hidden border border-gray-300 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-center py-4 bg-blue-800 border-b text-white">ECHO CHATBOT</h2>
                <div ref={chatRef} className="flex-1 overflow-hidden p-6 space-y-10 flex flex-col justify-end">
                    {visibleMessages.map((msg, index) => (
                        <div key={index} className="flex flex-col items-center space-y-3 animate-fadeIn">
                            {msg.role === "ai" ? (
                                <Image
                                    src={botImage}
                                    alt="Echo Bot"
                                    width={84}
                                    height={84}
                                    className="rounded-full shadow-lg border border-gray-300"
                                    priority
                                />
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full shadow-lg border border-gray-400">
                                    <User className="text-gray-700 w-16 h-16" />
                                </div>
                            )}

                            <div className="text-lg font-semibold text-gray-600">
                                {msg.role === "ai" ? "Echo Bot" : "User"}
                            </div>
                            <div
                                className={`px-6 py-4 text-2xl leading-relaxed rounded-xl shadow-md text-center ${msg.role === "user"
                                    ? "bg-blue-500 text-white rounded-tl-xl"
                                    : "bg-gray-200 text-gray-800 rounded-tr-xl"
                                    } transition-all duration-300 ease-in-out`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex flex-col items-center space-y-3 animate-fadeIn">
                            <Image src='/assets/loading.png' alt="Echo Talking" height={96} width={96} />
                            <div className="text-lg font-semibold text-gray-600">Echo Bot</div>
                            <div className="px-6 py-4 text-lg leading-relaxed rounded-xl shadow-md bg-gray-300 text-gray-800 animate-pulse max-w-md text-center">
                                Typing...
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full flex items-center bg-white p-5 border-t border-gray-300 shadow-md backdrop-blur-md">
                    <input
                        type="text"
                        className="flex-1 px-6 py-4 text-lg text-gray-900 bg-white outline-none rounded-full placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                        disabled={loading}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        className="ml-3 px-6 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
