'use client';

import { useState } from "react";
import { CheckCircle, Star, BookOpen, Heart, Sparkles, PenTool } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Card({ children, className = "" }) {
    return (
        <div className={`bg-white shadow-xl rounded-2xl p-8 transition-transform transform hover:scale-105 ${className}`}>
            {children}
        </div>
    );
}

export default function LandingPage() {

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4">
            <section className="text-center py-20 px-6 max-w-3xl">
                <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">Meet Echo: Your AI Journaling Companion</h1>
                <p className="mt-6 text-xl text-gray-700 leading-relaxed">
                    Track your thoughts, moods, and insights with Echo – the AI-powered journaling app that grows with you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">

                    <Link href="/register" className="inline-block mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all">
                        Get Started for Free
                    </Link>
                    {/* <Link
                        href="https://www.producthunt.com/posts/your-product-slug"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex mt-8 bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-red-700 transition-all"
                    >
                        <Image
                            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=0065000&theme=light"
                            alt="Product Hunt Badge"
                            className="h-6"
                            height={20}
                            width={20}
                        />
                        <span className="hidden sm:inline">Vote on Product Hunt</span>
                    </Link> */}

                </div>
            </section >

            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl">

                <section className="py-16 px-8 md:w-1/2 text-center">

                    <div className="max-w-lg mx-auto">
                        <h2 className="text-4xl font-bold text-gray-800">What is Journaling?</h2>
                        <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                            Journaling is the practice of writing down your thoughts, emotions, and daily experiences. It helps you process your feelings, track your growth, and clear your mind.
                        </p>

                    </div>
                </section>

                <div className="hidden md:block w-px bg-gray-300 self-stretch mx-6"></div>

                <section className="py-16 px-8 md:w-1/2">
                    <div className="max-w-lg mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-800">Why Journaling is Good for Your Mental Health</h2>
                        <ul className="mt-10 space-y-6">
                            {["Reduces Stress & Anxiety", "Enhances Self-Awareness", "Improves Emotional Well-Being", "Boosts Creativity"].map((text, idx) => (
                                <li key={idx} className="flex items-center text-xl font-medium text-gray-800 transition-colors duration-200 hover:text-blue-600">
                                    <Sparkles className="text-purple-500 mr-3" size={26} />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div >


            <section className="py-20 px-6 max-w-4xl">
                <h2 className="text-4xl font-semibold text-center">Why Choose Echo?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {[
                        { title: "Unlimited Journaling", desc: "Never run out of space to write your thoughts.", icon: PenTool },
                        { title: "AI Mood Insights", desc: "Get deep insights into your emotional patterns.", icon: Heart },
                        { title: "Custom Echo Themes", desc: "Personalize your Echo’s look and feel.", icon: Sparkles },
                        { title: "Premium AI Chatbot", desc: "Chat with an AI assistant that listens with empathy and supports you.", icon: CheckCircle },
                    ].map((feature, index) => (
                        <Card key={index} className="text-center">
                            <feature.icon className="text-blue-500 mx-auto mb-4" size={36} />
                            <h3 className="text-2xl font-medium text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600 mt-3">{feature.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>
            <section className="py-20 px-6 max-w-4xl text-center">
                <h2 className="text-4xl font-semibold">What Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {[
                        { name: "Shihab", review: "It’s fun journaling & chatting with Echo. Very well done!" },
                        { name: "Arafath", review: "The AI insights are so helpful and spot on." },
                    ].map((testimonial, index) => (
                        <Card key={index}>
                            <Star className="text-yellow-500 mx-auto mb-4" size={36} />
                            <p className="text-lg font-medium leading-relaxed">"{testimonial.review}"</p>
                            <p className="text-gray-600 mt-3">- {testimonial.name}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </div >
    );
}
