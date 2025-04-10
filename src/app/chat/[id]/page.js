"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Send, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatDetails() {
    const params = useParams();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchChat();
    }, [params.id]);

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    const fetchChat = async () => {
        try {
            const response = await axios.get(`/api/chat/${params.id}`);
            setChat(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load chat');
            console.error('Error fetching chat:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post('/api/chat', {
                message: newMessage,
                chatId: params.id
            });

            setChat(prev => ({
                ...prev,
                messages: [
                    ...(prev.messages || []),
                    { role: 'user', text: newMessage },
                    { role: 'ai', text: response.data.reply }
                ]
            }));
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/chat" className="text-blue-500 hover:underline">
                    Return to Chats
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center">
                <Link href="/chat" className="mr-4">
                    <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                </Link>
                <h1 className="text-xl font-semibold">Chat with Echo</h1>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat?.messages?.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                        {message.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Image
                                    src="/assets/loading.png"
                                    alt="Echo"
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                        <div className={`max-w-[70%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'} rounded-lg px-4 py-2`}>
                            <p className="text-sm">{message.text}</p>
                        </div>
                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="bg-white border-t p-4 sticky bottom-0">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
