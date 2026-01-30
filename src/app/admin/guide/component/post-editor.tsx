'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import {
    ArrowLeft, Save, Globe, Lock, Trash2, Image as ImageIcon,
    Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
    List, ListOrdered, Heading1, Heading2, Quote,
    Undo, Redo, Code
} from 'lucide-react';
import Link from 'next/link';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-white border-b border-gray-100 sticky top-0 z-30">
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('code') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Inline Code"
            >
                <Code size={18} />
            </button>

            <div className="w-px h-6 bg-gray-100 mx-1 self-center" />

            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="H1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="H2"
            >
                <Heading2 size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Quote"
            >
                <Quote size={18} />
            </button>

            <div className="w-px h-6 bg-gray-100 mx-1 self-center" />

            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-gray-100 mx-1 self-center" />

            <button
                onClick={(e) => { e.preventDefault(); setLink(); }}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Add Link"
            >
                <LinkIcon size={18} />
            </button>

            <div className="flex-1" />

            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function PostEditor() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params.id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: '',
        published: false
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const uploadData = new FormData();
            uploadData.append("image", file);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`,
                uploadData
            );

            const imageUrl = res.data.data.url;
            setFormData(prev => ({ ...prev, coverImage: imageUrl }));
            toast.success("Image uploaded successfully!", { id: toastId });
        } catch (error) {
            console.error("ImgBB Upload Error:", error);
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline cursor-pointer',
                },
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-indigo max-w-none focus:outline-none min-h-[500px] p-8 font-medium text-gray-700 leading-[1.8] text-lg',
            },
        },
    });

    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`/api/posts/${params.id}`);
                    const post = res.data;
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        coverImage: post.coverImage || '',
                        tags: post.tags?.join(', ') || '',
                        published: post.published
                    });
                    if (editor) {
                        editor.commands.setContent(post.content);
                    }
                } catch (error) {
                    toast.error("Failed to load post");
                    router.push('/admin/guide');
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [isEdit, params.id, router, editor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !isEdit) {
                updated.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
            };

            if (isEdit) {
                await axios.patch(`/api/posts/${params.id}`, payload);
                toast.success("Post updated!");
            } else {
                await axios.post('/api/posts', payload);
                toast.success("Post created!");
                router.push('/admin/guide');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>

            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/guide" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <ArrowLeft size={20} className="text-gray-400" />
                        </Link>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">
                            {isEdit ? 'Edit Guide' : 'New Guide'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, published: !p.published }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${formData.published
                                ? 'bg-green-50 text-green-600'
                                : 'bg-amber-50 text-amber-600'
                                }`}
                        >
                            {formData.published ? <Globe size={14} /> : <Lock size={14} />}
                            {formData.published ? 'Published' : 'Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                            {isEdit ? 'Save Changes' : 'Create Post'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-12" onSubmit={(e) => e.preventDefault()}>
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Guide Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter a catchy title..."
                                className="w-full text-4xl font-black text-gray-900 placeholder-gray-200 outline-none border-b-2 border-transparent focus:border-indigo-100 transition-colors pb-4"
                            />
                        </div>

                        {/* Editor Container */}
                        <div className="overflow-hidden bg-gray-50 rounded-3xl border border-gray-100 focus-within:border-indigo-100 transition-all shadow-inner relative flex flex-col">
                            <MenuBar editor={editor} />
                            <EditorContent editor={editor} className="flex-1" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* URL Slug */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">URL Slug</label>
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                /guide/
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none text-gray-900 flex-1"
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Short Excerpt (SEO)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={4}
                                placeholder="What is this guide about?"
                                className="w-full text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:border-indigo-100 transition-all resize-none"
                            />
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cover Image URL</label>
                            <div className="space-y-3">
                                <div className="relative group">
                                    <input
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full text-xs font-bold text-gray-900 bg-gray-50 p-4 pl-10 rounded-xl border border-gray-100 outline-none focus:border-indigo-100 transition-all"
                                    />
                                    <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-all disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                        ) : (
                                            <ImageIcon size={14} />
                                        )}
                                        {uploading ? "Uploading..." : "Upload from Device"}
                                    </button>
                                </div>
                            </div>
                            {formData.coverImage && (
                                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden shadow-md">
                                    <img src={formData.coverImage} className="object-cover w-full h-full" alt="Preview" />
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tags (comma separated)</label>
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Mindfulness, Tech, Health"
                                className="w-full text-xs font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:border-indigo-100 transition-all"
                            />
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
