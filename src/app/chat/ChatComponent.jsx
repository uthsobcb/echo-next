"use client";

import React, { useState } from "react";

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { role: "user", text: "How does Echo chat work? Can it really understand what I'm saying?" },
        { role: "ai", text: "Ech listens to you attentively and responds with empathy. It doesn’t judge, interrupt, or assume—just a space where you can share your thoughts freely." },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() !== "") {
            setMessages([...messages, { role: "user", text: input }]);
            setInput("");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
            <div className=" w-2/3 rounded-lg p-5">
                <div>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 text-[16px] leading-relaxed ${msg.role === "user"
                                ? "bg-[#b6e4ff] text-[#4A4A4A] rounded-lg px-4 py-2 shadow-sm"
                                : "text-[#2F4F2F] px-2"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>


            <div className="w-2/3 flex items-center justify-between space-x-2 mt-8 bg-white p-3 rounded-full shadow-md border border-gray-200">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 outline-none rounded-full text-gray-700 bg-gray-100 placeholder-gray-400"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded-full text-[15px] font-medium shadow-sm hover:bg-gray-400 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
