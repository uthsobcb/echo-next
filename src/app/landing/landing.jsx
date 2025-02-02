'use client'
import { useState } from "react";
import { CheckCircle, Star, BookOpen } from "lucide-react";
import Link from "next/link";

export function Card({ children, className }) {
    return (
        <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>
    );
}

export default function LandingPage() {
    const [pricing, setPricing] = useState("monthly");

    return (
        <div className="w-full min-h-screen flex flex-col items-center">
            <section className="text-center py-20 px-6 max-w-3xl">
                <h1 className="text-5xl font-bold">Meet Echo: Your AI Journaling Companion</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Track your thoughts, moods, and insights with Echo – the AI-powered journaling app that grows with you.
                </p>
                <p className="mt-2 text-md text-gray-500">Enjoy Echo for free, or upgrade to premium for unlimited access!</p>
                <br />
                <Link className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6" href="/register">
                    Get Started for Free
                    <br />
                </Link>

            </section>

            <div className="flex flex-col md:flex-row bg-gray-50 rounded-xl">
                <section className="py-16 px-6 md:w-1/2 text-center">
                    <div className="max-w-lg mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800">What is Journaling?</h2>
                        <p className="text-gray-600 mt-6 text-lg">
                            Journaling is the practice of writing down your thoughts, emotions, and daily experiences. It helps you process your feelings, track your growth, and clear your mind.
                        </p>
                    </div>
                </section>

                <div className="hidden md:block w-px bg-gray-300 self-stretch mx-4"></div>

                <section className="py-16 px-6 md:w-1/2">
                    <div className="max-w-lg mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-800">Why Journaling is Good for Your Mental Health</h2>
                        <div className="mt-8">
                            <ul className="space-y-4">
                                <li className="flex items-center text-xl font-medium text-gray-800 transition-colors duration-200 hover:text-blue-600">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <circle cx="10" cy="10" r="8" />
                                    </svg>
                                    <span>Reduces Stress & Anxiety</span>
                                </li>
                                <li className="flex items-center text-xl font-medium text-gray-800 transition-colors duration-200 hover:text-blue-600">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <circle cx="10" cy="10" r="8" />
                                    </svg>
                                    <span>Enhances Self-Awareness</span>
                                </li>
                                <li className="flex items-center text-xl font-medium text-gray-800 transition-colors duration-200 hover:text-blue-600">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <circle cx="10" cy="10" r="8" />
                                    </svg>
                                    <span>Improves Emotional Well-Being</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <section className="py-16 px-6 max-w-4xl">
                <h2 className="text-3xl font-semibold text-center">Why Choose Echo?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                        { title: "Unlimited Journaling", desc: "Never run out of space to write your thoughts." },
                        { title: "AI Mood Insights", desc: "Get deep insights into your emotional patterns." },
                        { title: "Custom Echo Themes", desc: "Personalize your Echo’s look and feel." },
                        { title: "Premium AI Chatbot", desc: "Chat with an AI assistant that listens with empathy and supports you." },
                    ].map((feature, index) => (
                        <Card key={index} className="text-center">
                            <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
                            <h3 className="text-xl font-medium">{feature.title}</h3>
                            <p className="text-gray-600 mt-2">{feature.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="py-16 px-6 max-w-3xl text-center">
                <h2 className="text-3xl font-semibold">Simple & Affordable Pricing</h2>
                <Card className="mt-6 bg-gray-100">
                    <h3 className="text-2xl font-bold">$1 / Month</h3>
                    <p className="text-gray-600 mt-2">Unlimited journaling, AI insights, empathetic chatbot, and more!</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6">
                        Subscribe Now
                    </button>


                </Card>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-6 max-w-4xl text-center">
                <h2 className="text-3xl font-semibold">What Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[
                        { name: "Alex", review: "Echo transformed the way I track my emotions!" },
                        { name: "Jamie", review: "The AI insights are so helpful and spot on." },
                    ].map((testimonial, index) => (
                        <Card key={index}>
                            <Star className="text-yellow-500 mx-auto mb-3" size={32} />
                            <p className="text-lg">"{testimonial.review}"</p>
                            <p className="text-gray-600 mt-2">- {testimonial.name}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
