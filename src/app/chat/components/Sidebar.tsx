import Link from 'next/link';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

interface SidebarProps {
    chats: Chat[];
    currentChatId: string | null;
    onChatDeleted?: (id: string) => void;
    onChatRenamed?: (id: string, newTitle: string) => void;
}

export default function Sidebar({ chats = [], currentChatId = null, onChatDeleted, onChatRenamed }: SidebarProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleRename = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.patch(`/api/chat/${id}`, { threadSummary: editValue });
            setEditingId(null);
            onChatRenamed?.(id, editValue);
            toast.success("Chat renamed");
        } catch (error) {
            toast.error("Failed to rename chat");
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.delete(`/api/chat/${id}`);
            setDeletingId(null);
            onChatDeleted?.(id);
            toast.success("Chat deleted");
            if (currentChatId === id) {
                router.push('/chat/new');
            }
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    const startEditing = (e: React.MouseEvent, chat: Chat) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(chat._id);
        setEditValue(chat.threadSummary || chat.messages?.[0]?.text || "New Chat");
    };

    return (
        <aside className="hidden md:flex flex-col w-72 bg-gray-50 border-r overflow-y-auto shadow-inner z-10 h-screen">
            <div className="p-6">
                <Link
                    href="/chat/new"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold transition hover:bg-indigo-700 shadow-lg shadow-indigo-100 mb-6"
                >
                    <Plus className="w-5 h-5" />
                    New Echo
                </Link>

                <div className="flex flex-col space-y-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Recent Chats</p>
                    {chats.map((chat) => (
                        <div key={chat._id} className="group relative">
                            {editingId === chat._id ? (
                                <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-indigo-200">
                                    <input
                                        autoFocus
                                        className="flex-1 bg-transparent text-sm outline-none px-1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(e as any, chat._id)}
                                    />
                                    <button onClick={(e) => handleRename(e, chat._id)} className="text-green-600 hover:bg-green-50 p-1 rounded-md">
                                        <Check size={16} />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded-md">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href={`/chat/${chat._id}`}
                                    className={`block w-full text-left px-4 py-3 rounded-xl transition hover:bg-white border text-sm group ${chat._id === currentChatId
                                            ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50'
                                            : 'border-transparent text-gray-600 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="font-bold truncate pr-12">
                                        {chat.threadSummary || chat.messages?.[0]?.text || 'New Chat'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => startEditing(e, chat)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDeletingId(chat._id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </Link>
                            )}

                            {/* Delete Confirmation Overlay */}
                            {deletingId === chat._id && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-around z-20 px-2 border border-red-100">
                                    <span className="text-[10px] font-black text-red-600 uppercase">Delete?</span>
                                    <div className="flex gap-1">
                                        <button onClick={(e) => handleDelete(e, chat._id)} className="bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold">Yes</button>
                                        <button onClick={(e) => { e.preventDefault(); setDeletingId(null); }} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold">No</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
