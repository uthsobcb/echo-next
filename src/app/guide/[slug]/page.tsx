import React from "react";
import Image from "next/image";
import { connect } from "@/app/lib/mongodb";
import Post from "@/app/models/Post";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await connect();
    const post = await Post.findOne({ slug, published: true }).lean();

    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | Echo Guide`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage || ""],
            type: "article",
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    await connect();
    const post: any = await Post.findOne({ slug, published: true }).lean();

    if (!post) notFound();

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Header Content */}
            <div className="bg-gray-50 py-12 md:py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link
                        href="/guide"
                        className="inline-flex items-center text-sm font-bold text-indigo-600 mb-8 hover:gap-2 transition-all group"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Guides
                    </Link>

                    <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {Math.ceil(post.content.length / 1000)} min read
                        </span>
                        <span className="flex items-center gap-1 text-indigo-600">
                            <User size={14} />
                            {post.author}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-6">
                        {post.excerpt}
                    </p>
                </div>
            </div>

            {/* Cover Image */}
            <div className="container mx-auto px-6 max-w-5xl -mt-10 md:-mt-16 mb-16">
                <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src={post.coverImage || "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=2070&auto=format&fit=crop"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="prose prose-lg prose-indigo max-w-none mb-16 blog-content">
                    <div
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                    />
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                        {post.tags.map((tag: string) => (
                            <span key={tag} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer CTA */}
                <div className="mt-20 p-10 bg-indigo-600 rounded-[2.5rem] text-center shadow-xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-white mb-4">Start your journey with Echo</h3>
                        <p className="text-indigo-100 font-medium mb-8 max-w-md mx-auto">
                            Transform your reflections into growth with your empathetic AI companion.
                        </p>
                        <Link
                            href="/chat/new"
                            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
                        >
                            Open Chat
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
