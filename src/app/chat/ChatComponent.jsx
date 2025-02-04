"use client";

import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { role: "user", text: "How does Echo chat work? Can it really understand what I'm saying?" },
        { role: "ai", text: "Echo listens to you attentively and responds with empathy. It doesn’t judge, interrupt, or assume—just a space where you can share your thoughts freely." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("/api/chat", { message: input });
            const aiReply = res.data.reply || "I'm here to listen.";

            setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) => [...prev, { role: "ai", text: "Oops! Something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-4/5 lg:w-3/5 h-[90vh] flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[75%] px-4 py-2 text-[16px] leading-relaxed rounded-lg shadow-md ${msg.role === "user"
                                ? "bg-blue-500 text-white self-end ml-auto"
                                : "bg-gray-200 text-gray-800 self-start"
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
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
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
