'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Globe, Lock, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Post {
    _id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    author: string;
}

export default function AdminGuidePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Guide Management</h1>
                        <p className="text-gray-500 font-medium">Create and manage your SEO-friendly blog posts.</p>
                    </div>
                    <Link
                        href="/admin/guide/new"
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
                    >
                        <Plus size={20} /> New Post
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Post Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold">
                                            No posts yet. Start by creating your first guide!
                                        </td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-gray-900 mb-1">{post.title}</div>
                                                <div className="text-xs text-gray-400 font-medium">/{post.slug}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => togglePublish(post)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${post.published
                                                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                            : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                        }`}
                                                >
                                                    {post.published ? <Globe size={12} /> : <Lock size={12} />}
                                                    {post.published ? "Published" : "Draft"}
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/guide/${post.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                        title="View Publicly"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/guide/${post._id}/edit`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="Edit Post"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
