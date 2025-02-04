"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const ChatBox = () => {
    const searchParams = useSearchParams();
    const entryContent = searchParams.get("entryContent"); // Get the entry content from query params

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to send a message
    const sendMessage = async (text, isAuto = false) => {
        if (!text.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { role: "user", text }]);

        try {
            setLoading(true);
            const res = await axios.post("/api/chat", { message: text });
            const aiReply = res.data.reply || "I'm here to listen.";

            // Add AI response
            setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) => [...prev, { role: "ai", text: "Oops! Something went wrong." }]);
        } finally {
            setInput("");
            setLoading(false);
        }
    };

    // Initiate conversation automatically if entryContent is provided
    useEffect(() => {
        if (entryContent) {
            sendMessage(entryContent, true);
        }
    }, [entryContent]); // Runs only when the component mounts and entryContent exists

    return (
        <div className="flex items-center justify-center">
            <div className="w-4/5 lg:w-3/5 h-[90vh] flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[75%] px-4 py-2 text-[16px] leading-relaxed rounded-lg shadow-md ${msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-gray-800 self-start"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="max-w-[75%] px-4 py-2 text-[16px] leading-relaxed rounded-lg shadow-md bg-gray-200 text-gray-800 self-start">
                            Typing...
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="w-full flex items-center space-x-2 bg-gray-50 p-4 border-t border-gray-300">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 outline-none rounded-full text-gray-700 bg-gray-100 placeholder-gray-400"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full text-[15px] font-medium shadow-md hover:bg-blue-600 transition"
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
