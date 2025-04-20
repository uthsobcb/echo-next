"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Send, Loader2, User, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./components/Sidebar";

const ChatBox = ({ user }) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const chatRef = useRef(null);

    // State management
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userImageError, setUserImageError] = useState(false);
    const [oldChats, setOldChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);

    // Constants
    const botImage = "/assets/loading.png";
    const userImage = user?.image;
    const entryContent = searchParams.get("entryContent");

    // Fetch chat history
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get("/api/chat");
                setOldChats(res.data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, []);

    // Load specific chat
    useEffect(() => {
        const loadChat = async () => {
            if (params.id && params.id !== 'new') {
                try {
                    setLoading(true);
                    const chat = oldChats.find(c => c._id === params.id);
                    if (chat) {
                        setMessages(chat.messages || []);
                        setCurrentChatId(chat._id);
                    }
                } catch (error) {
                    console.error("Error loading chat:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMessages([]);
                setCurrentChatId(null);
            }
        };
        loadChat();
    }, [params.id, oldChats]);

    // Handle initial entry content
    useEffect(() => {
        if (entryContent) {
            sendMessage(entryContent);
        }
    }, [entryContent]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    // Update chat history
    const updateChatHistory = (chatId, newMessages) => {
        setOldChats(prev => {
            const chatIndex = prev.findIndex(c => c._id === chatId);
            if (chatIndex >= 0) {
                const updatedChats = [...prev];
                updatedChats[chatIndex] = {
                    ...updatedChats[chatIndex],
                    messages: newMessages,
                    updatedAt: new Date()
                };
                return updatedChats;
            }
            return [{
                _id: chatId,
                messages: newMessages,
                updatedAt: new Date()
            }, ...prev];
        });
    };

    // Send message handler
    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;

        setMessages(prev => [...prev, {
            role: "user",
            text,
            timestamp: new Date()
        }]);
        setInput("");

        try {
            setLoading(true);
            const response = await axios.post("/api/chat", {
                message: text,
                chatId: currentChatId
            });

            setMessages(response.data.messages);

            if (!currentChatId) {
                setCurrentChatId(response.data.chatId);
                router.replace(`/chat/${response.data.chatId}`);
            }

            updateChatHistory(response.data.chatId, response.data.messages);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                role: "ai",
                text: "Oops! Something went wrong.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Handle quick suggestion
    const handleQuickSuggestion = (text) => {
        setInput(text);
    };

    // Message bubble component
    const MessageBubble = ({ message }) => {
        const isUser = message.role === "user";
        return (
            <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-3`}>
                {!isUser && (
                    <Image
                        src={botImage}
                        alt="Echo Bot"
                        width={40}
                        height={40}
                        className="rounded-full object-cover shadow"
                    />
                )}
                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div className={`p-3 rounded-2xl shadow-sm ${isUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-800"
                        }`}>
                        <p className="text-sm md:text-base leading-snug whitespace-pre-wrap">
                            {message.text}
                        </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                        {isUser ? "You" : "Echo Bot"} • {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                </div>
                {isUser && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow">
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
    };

    return (
        <div className="flex h-screen">
            <Sidebar chats={oldChats} currentChatId={currentChatId} />

            <main className="flex flex-col flex-1 max-w-full relative">
                {/* Header */}
                <header className="p-4 bg-blue-600 text-white shadow-sm flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Echo Chat</h1>
                    <Link
                        href="/chat/new"
                        className="md:hidden flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Link>
                </header>

                {/* Chat Messages or Welcome Screen */}
                <div ref={chatRef} className="flex-1 overflow-y-auto bg-gray-50">
                    {messages.length === 0 ? (
                        // Welcome Screen
                        <div className="flex items-center justify-center h-full p-4">
                            <div className="w-full max-w-2xl text-center space-y-8">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Where should we begin?
                                </h1>

                                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                                    Hi, I'm Echo. I'm here to listen and chat with you about anything that's on your mind.
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handleQuickSuggestion("How can you help me with my mental well-being?")}
                                        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Mental well-being
                                    </button>
                                    <button
                                        onClick={() => handleQuickSuggestion("I'm feeling stressed and need someone to talk to.")}
                                        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Feeling stressed
                                    </button>
                                    <button
                                        onClick={() => handleQuickSuggestion("Can you help me develop better coping strategies?")}
                                        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Coping strategies
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Chat Messages
                        <div className="p-4 space-y-6">
                            {messages.map((message, i) => (
                                <MessageBubble key={i} message={message} />
                            ))}

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
                    )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
                            placeholder="Type a message..."
                            className="flex-1 p-3 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ChatBox;
