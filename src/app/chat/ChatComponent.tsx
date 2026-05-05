"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Send, Loader2, User, Plus, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "ai";
    text: string;
    timestamp: Date | string;
}

interface Chat {
    _id: string;
    messages: Message[];
    threadSummary?: string;
    updatedAt: Date | string;
}

interface ChatBoxProps {
    user: {
        image?: string;
        name?: string;
        email?: string;
    } | null;
}

const ChatBox = ({ user }: ChatBoxProps) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State management
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userImageError, setUserImageError] = useState(false);
    const [oldChats, setOldChats] = useState<Chat[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

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
        if (entryContent && !loading) {
            const sendInitialMessage = async () => {
                const response = await axios.post("/api/chat", {
                    message: entryContent,
                    chatId: null
                });
                setMessages(response.data.messages);
                setCurrentChatId(response.data.chatId);
                router.replace(`/chat/${response.data.chatId}`);
                updateChatHistory(response.data.chatId, response.data.messages);
            };
            sendInitialMessage();
        }
    }, [entryContent]);

    // Update chat history
    const updateChatHistory = (chatId: string, newMessages: Message[]) => {
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

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length]);

    // Handlers for sidebar sync
    const handleChatDeleted = (id: string) => {
        setOldChats(prev => prev.filter(c => c._id !== id));
        if (currentChatId === id) {
            setMessages([]);
            setCurrentChatId(null);
            router.push('/chat/new');
        }
    };

    const handleChatRenamed = (id: string, newTitle: string) => {
        setOldChats(prev => prev.map(c =>
            c._id === id ? { ...c, threadSummary: newTitle } : c
        ));
    };

    // Send message handler
    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMessage: Message = {
            role: "user",
            text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Handle quick suggestion
    const handleQuickSuggestion = (text: string) => {
        sendMessage(text);
    };

    // Message bubble component
    const MessageBubble = ({ message, index }: { message: Message, index: number }) => {
        const isUser = message.role === "user";
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-3 mb-6`}
            >
                {!isUser && (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                    >
                        <Image
                            src={botImage}
                            alt="Echo Bot"
                            width={40}
                            height={40}
                            className="rounded-full shadow-md border-2 border-white"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
                    </motion.div>
                )}
                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%] md:max-w-[70%]`}>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${isUser
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-indigo-50/50 shadow-md"
                        }`}>
                        <p className="whitespace-pre-wrap font-medium">
                            {message.text}
                        </p>
                    </div>
                </div>
                {isUser && (
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                        {userImageError ? (
                            <User className="w-5 h-5 text-gray-400" />
                        ) : (
                            <Image
                                src={userImage || ""}
                                alt="User"
                                width={40}
                                height={40}
                                unoptimized
                                className="object-cover"
                                onError={() => setUserImageError(true)}
                            />
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white">
            <Sidebar
                chats={oldChats}
                currentChatId={currentChatId}
                onChatDeleted={handleChatDeleted}
                onChatRenamed={handleChatRenamed}
            />

            <main className="flex flex-col flex-1 max-w-full relative shadow-2xl">
                {/* Header */}
                <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg md:hidden">
                            <Plus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight">Echo Chat</h1>
                            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                <ShieldCheck size={12} />
                                <span>End-to-end Encrypted</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-100">
                            <Lock size={10} className="text-gray-400" />
                            <span className="text-[10px] text-gray-500 font-bold">Secure Session</span>
                        </div>
                        <Link
                            href="/chat/new"
                            className="md:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-100"
                        >
                            <Plus className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/30 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-lg text-center space-y-6"
                            >
                                <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 rotate-6">
                                    <Send className="text-white w-8 h-8 -rotate-12" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    How is your heart today?
                                </h2>

                                <p className="text-gray-500 font-medium leading-relaxed">
                                    I'm your safe space. Everything we share is encrypted and private. What's on your mind?
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10">
                                    {[
                                        "Help me process my day",
                                        "Feeling a bit overwhelmed",
                                        "I had a huge win today!",
                                        "Just need someone to listen"
                                    ].map((text) => (
                                        <button
                                            key={text}
                                            onClick={() => handleQuickSuggestion(text)}
                                            className="px-4 py-3 text-sm bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all text-gray-700 font-bold text-left flex items-center gap-3 group"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-indigo-100 group-hover:bg-indigo-600 transition-colors" />
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-2">
                            <AnimatePresence>
                                {messages.map((message, i) => (
                                    <MessageBubble key={`${message.role}-${i}`} message={message} index={i} />
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start items-end gap-3 pb-8"
                                >
                                    <Image
                                        src={botImage}
                                        alt="Echo Bot"
                                        width={40}
                                        height={40}
                                        className="rounded-full animate-bounce shadow-md"
                                    />
                                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-75" />
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse delay-150" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} className="h-10" />
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="p-4 md:p-6 bg-white border-t border-gray-50 max-w-4xl mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="relative flex items-center gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-inner"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
                            placeholder="Share your thoughts..."
                            className="flex-1 bg-transparent py-3 px-6 text-gray-800 placeholder-gray-400 outline-none font-medium"
                            disabled={loading}
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full text-white font-black shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="hidden md:inline">Send</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                    <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
                        Echo is an AI companion and not a replacement for professional help.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ChatBox;
