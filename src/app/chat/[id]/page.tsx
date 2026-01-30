"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Image from 'next/image';
import { Send, User, ArrowLeft, Plus, Loader2, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import { Chat, Message } from '@/types';

export default function ChatDetails() {
    const params = useParams();
    const router = useRouter();
    const [chat, setChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [oldChats, setOldChats] = useState<Chat[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch all chats for the sidebar
    useEffect(() => {
        const fetchOldChats = async () => {
            try {
                const res = await fetch("/api/chat");
                if (!res.ok) {
                    throw new Error('Failed to fetch chats');
                }
                const data = await res.json();
                setOldChats(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchOldChats();
    }, []);

    useEffect(() => {
        if (params.id !== 'new') {
            fetchChat();
        } else {
            setLoading(false);
        }
    }, [params.id]);

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
        if (chat?.messages?.length && chat.messages.length > 0) {
            scrollToBottom();
        }
    }, [chat?.messages?.length]);

    const fetchChat = async () => {
        try {
            const response = await fetch(`/api/chat/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to load chat');
            }
            const data = await response.json();
            setChat(data);
            setError(null);
        } catch (err) {
            setError('Failed to load chat');
            console.error('Error fetching chat:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);

        // Scroll to bottom immediately when user sends message
        setTimeout(scrollToBottom, 100);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newMessage,
                    chatId: params.id === 'new' ? null : params.id
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            setChat(prev => ({
                ...prev,
                _id: data.chatId,
                messages: data.messages,
                updatedAt: new Date()
            }));
            setNewMessage('');

            // Update oldChats list
            setOldChats((prev: Chat[]) => {
                const chatIndex = prev.findIndex(c => c._id === data.chatId);
                if (chatIndex >= 0) {
                    const updatedChats = [...prev];
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        messages: data.messages,
                        updatedAt: new Date()
                    };
                    return updatedChats;
                } else {
                    return [{
                        _id: data.chatId,
                        messages: data.messages,
                        updatedAt: new Date()
                    }, ...prev];
                }
            });

            // Update URL if this is a new chat
            if (params.id === 'new') {
                router.replace(`/chat/${data.chatId}`);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar chats={oldChats} currentChatId={null} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar chats={oldChats} currentChatId={null} />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link href="/chat" className="text-blue-500 hover:underline">
                        Return to Chats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar chats={oldChats} currentChatId={chat?._id || null} />

            {/* Main Chat Area */}
            <main className="flex flex-col flex-1 max-w-full relative">
                {/* Header */}
                <header className="p-4 bg-blue-600 text-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/chat" className="md:hidden">
                            <ArrowLeft className="w-6 h-6 text-white hover:text-blue-100" />
                        </Link>
                        <h1 className="text-lg font-semibold">Echo Chat</h1>
                    </div>
                    <Link
                        href="/chat/new"
                        className="md:hidden flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Link>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                    {chat?.messages?.map((message, index) => (
                        <div
                            key={`${index}-${message.timestamp}`}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                        >
                            {message.role === 'ai' && (
                                <Image
                                    src="/assets/loading.png"
                                    alt="Echo Bot"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover shadow"
                                />
                            )}
                            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                <div
                                    className={`p-3 rounded-2xl shadow-sm ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm md:text-base leading-snug whitespace-pre-wrap">
                                        {message.text}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 mt-1">
                                    {message.role === 'user' ? 'You' : 'Echo Bot'} • {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            {message.role === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow">
                                    <User className="w-6 h-6 text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))}

                    {sending && (
                        <div className="flex justify-start items-end gap-3">
                            <Image
                                src="/assets/loading.png"
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

                    <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-3 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
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
}
