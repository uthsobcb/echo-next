import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { connect } from "@/app/lib/mongodb";
import Post from "@/app/models/Post";
import { ArrowRight, Clock, User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guide & Insights | Echo AI Companion",
    description: "Explore our collection of articles on mindfulness, mental well-being, and how to get the most out of your Echo AI companion.",
    openGraph: {
        title: "Guide & Insights | Echo AI Companion",
        description: "Your journey to mindfulness and emotional growth starts here.",
        type: "website",
    }
};

async function getPosts() {
    await connect();
    return Post.find({ published: true }).sort({ createdAt: -1 }).lean();
}

export default async function GuidePage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        The Echo <span className="text-indigo-200">Guide</span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed">
                        Insights, techniques, and stories to help you navigate your emotional journey and find your inner balance.
                    </p>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
            </section>

            {/* Posts Grid */}
            <section className="py-20 container mx-auto px-6">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-400">Coming soon! We're preparing insightful content for you.</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <Link
                                href={`/guide/${post.slug}`}
                                key={post._id.toString()}
                                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={post.coverImage || "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=2070&auto=format&fit=crop"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {Math.ceil(post.content.length / 1000)} min read
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={12} />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 font-medium mb-6 line-clamp-3 text-sm leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center text-indigo-600 font-black text-sm group-hover:gap-2 transition-all">
                                        Read Story <ArrowRight size={16} className="ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
