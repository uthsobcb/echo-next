'use client'
import { useState } from "react";
import { CheckCircle, Star } from "lucide-react";

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
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6">
                    Get Started for Free
                </button>

            </section>

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
