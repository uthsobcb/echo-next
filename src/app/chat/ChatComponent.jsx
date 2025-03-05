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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full sm:max-w-full lg:max-w-3xl h-[80vh] sm:h-[85vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-6 border-b relative">
                    <h2 className="text-3xl font-bold text-center text-white tracking-wide">ECHO CHATBOT</h2>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Image src={botImage} alt="Echo Logo" width={48} height={48} className="rounded-full" />
                    </div>
                </div>

                <div ref={chatRef} className="flex-1 overflow-y-auto p-8 space-y-12 flex flex-col justify-end scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                    {visibleMessages.map((msg, index) => (
                        <div key={index} className="flex flex-col items-center space-y-4 animate-fadeIn">
                            {msg.role === "ai" ? (
                                <Image
                                    src={botImage}
                                    alt="Echo Bot"
                                    width={96}
                                    height={96}
                                    className="rounded-full shadow-xl border-2 border-blue-200 hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            ) : (
                                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-xl">
                                    <User className="text-white w-12 h-12" />
                                </div>
                            )}

                            <div className="text-xl font-semibold text-gray-700">
                                {msg.role === "ai" ? "Echo Bot" : "You"}
                            </div>
                            <div
                                className={`px-8 py-5 text-2xl leading-relaxed rounded-2xl shadow-lg text-center max-w-2xl ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tl-3xl"
                                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-tr-3xl"
                                } hover:shadow-xl transition-all duration-300 ease-in-out`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex flex-col items-center space-y-4 animate-fadeIn">
                            <Image 
                                src='/assets/loading.png' 
                                alt="Echo Talking" 
                                height={96} 
                                width={96} 
                                className="animate-pulse"
                            />
                            <div className="text-xl font-semibold text-gray-700">Echo Bot</div>
                            <div className="px-8 py-5 text-xl leading-relaxed rounded-2xl shadow-lg bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 animate-pulse max-w-lg text-center">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full flex items-center bg-white/90 p-6 border-t border-gray-200 shadow-lg backdrop-blur-lg">
                    <input
                        type="text"
                        className="flex-1 px-8 py-5 text-xl text-gray-800 bg-gray-50 outline-none rounded-full placeholder-gray-400 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
                        placeholder="Type your message here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                        disabled={loading}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        className="ml-4 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                <span>Processing</span>
                            </>
                        ) : (
                            <>
                                <Send size={24} />
                                <span>Send</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
