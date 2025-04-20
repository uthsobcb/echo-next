import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Sidebar({ chats = [], currentChatId = null }) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r overflow-y-auto shadow-md z-10">
            <div className="p-4">
                <Link
                    href="/chat/new"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:bg-blue-700 mb-4"
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </Link>
            </div>
            <div className="flex flex-col p-4 space-y-2">
                {chats.map((chat) => (
                    <Link
                        key={chat._id}
                        href={`/chat/${chat._id}`}
                        className={`w-full text-left px-4 py-2 rounded-lg transition hover:bg-blue-50 border ${chat._id === currentChatId ? 'bg-blue-50 border-blue-200' : 'border-gray-100'
                            } text-sm font-medium`}
                    >
                        <div className="truncate">
                            {chat.messages?.[0]?.text || 'New Chat'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                        </div>
                    </Link>
                ))}
            </div>
        </aside>
    );
} 