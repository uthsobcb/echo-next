"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

export default function NewChat() {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [chats, setChats] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('/api/chat');
                setChats(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        fetchChats();
    }, []);

    const startChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post('/api/chat', { message });
            router.push(`/chat/${response.data.chatId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar chats={chats} currentChatId={null} />

            <main className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl text-center space-y-8">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Where should we begin?
                        </h1>

                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Hi, I'm Echo. I'm here to listen and chat with you about anything that's on your mind.
                        </p>

                        <form onSubmit={startChat} className="w-full max-w-xl mx-auto mt-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full p-4 pr-16 text-lg rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !message.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </div>
                        </form>

                        <div className="flex flex-wrap justify-center gap-2 mt-8">
                            <button
                                onClick={() => setMessage("How can you help me with my mental well-being?")}
                                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Mental well-being
                            </button>
                            <button
                                onClick={() => setMessage("I'm feeling stressed and need someone to talk to.")}
                                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Feeling stressed
                            </button>
                            <button
                                onClick={() => setMessage("Can you help me develop better coping strategies?")}
                                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Coping strategies
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 