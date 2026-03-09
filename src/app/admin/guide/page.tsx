'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Globe, Lock, Eye, Search, Filter, Calendar, User, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from '../component/admin-layout';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
    _id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    author: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
}

export default function AdminGuidePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/api/posts?all=true');
            setPosts(res.data);
        } catch (error) {
            toast.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(`/api/posts/${id}`);
            toast.success("Post deleted");
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const togglePublish = async (post: Post) => {
        try {
            await axios.patch(`/api/posts/${post._id}`, { published: !post.published });
            toast.success(post.published ? "Post unpublished" : "Post published");
            setPosts(posts.map(p => p._id === post._id ? { ...p, published: !p.published } : p));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'published' && post.published) ||
            (filter === 'draft' && !post.published);
        return matchesSearch && matchesFilter;
    });

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Content Management</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Create and manage your educational guides and blog posts.</p>
                    </div>
                    <Link
                        href="/admin/guide/new"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Plus size={20} /> New Article
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm"
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('published')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'published' ? 'bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setFilter('draft')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'draft' ? 'bg-slate-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}
                        >
                            Drafts
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-slate-800/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No articles found</h3>
                            <p className="text-slate-500">We couldn't find any posts matching your criteria. Try adjusting your search or create a new one.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-[32px] border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all overflow-hidden flex flex-col"
                                >
                                    {/* Cover Preview */}
                                    <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                        {post.coverImage ? (
                                            <img src={post.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Eye size={48} className="opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md transition-all ${post.published
                                                    ? "bg-emerald-500/90 text-white"
                                                    : "bg-amber-500/90 text-white"
                                                    }`}
                                            >
                                                {post.published ? <Globe size={12} /> : <Lock size={12} />}
                                                {post.published ? "Live" : "Draft"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-tight">
                                                    Guide
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">/ {post.slug}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h3>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/guide/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-900 rounded-xl transition-all"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/guide/${post._id}/edit`}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-900 rounded-xl transition-all"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-900 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
