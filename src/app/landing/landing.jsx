'use client';

import { useState } from "react";
import { CheckCircle, Star, BookOpen, Heart, Sparkles, PenTool, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Card({ children, className = "" }) {
    return (
        <div className={`bg-white shadow-xl rounded-2xl p-8 transition-transform transform hover:scale-105 ${className}`}>
            {children}
        </div>
    );
}


const steps = [
    {
        title: "Step 1: Sign Up",
        description: "Create a free account to start your AI journaling journey.",
        image: "/assets/signup.png",
    },
    {
        title: "Step 2: Express yourself",
        description: "Write, add images, or scan handwritten notes seamlessly.",
        image: "/assets/entry.png",
    },
    // {
    //     title: "Step 3: AI Insights",
    //     description: "Get meaningful AI-powered insights based on your journaling habits.",
    //     image: "/images/insights.gif",
    // },
    // {
    //     title: "Step 4: Track Your Progress",
    //     description: "Monitor your mood trends and personal growth over time.",
    //     image: "/images/track.gif",
    // },
];

const faqs = [
    {
        question: "How does Echo help with journaling?",
        answer: "Echo provides AI-powered insights, mood tracking, and writing prompts to help you reflect on your thoughts.",
    },
    {
        question: "Can I attach images to my journal entries?",
        answer: "Yes! You can upload images or even scan handwritten notes to digitize your journal.",
    },
    {
        question: "Is my data private and secure?",
        answer: "Absolutely. We use end-to-end encryption to ensure your journal remains private and accessible only to you.",
    },
    {
        question: "Can I access my journal from multiple devices?",
        answer: "Yes, Echo syncs across all your devices so you can write anytime, anywhere.",
    },
];



export default function LandingPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center  px-4">

            <section className="text-center py-20 px-6 max-w-3xl">
                <p className="p-2 bg-gray-400/35 text-gray-600 border rounded-full max-w-48 mx-auto">✨ Introducing</p>

                <h1 className="text-6xl font-extrabold text-gray-900 leading-tight"><span className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-blue-200 text-transparent bg-clip-text">Echo </span> { }: Your AI Journaling Companion</h1>
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


            <section className="w-full py-20 bg-aliceblue text-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-5xl font-bold text-center mb-16 tracking-tight">
                        How It Works
                    </h2>
                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center gap-12 
                ${index % 2 === 1 ? "md:flex-row-reverse" : ""} transition-transform duration-300`}
                            >
                                {/* Text Content */}
                                <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
                                    <h3 className="text-3xl font-semibold">{step.title}</h3>
                                    <p className="mt-4 text-lg text-gray-600">{step.description}</p>
                                </div>

                                <div className="hidden md:block w-[3px] bg-gradient-to-b from-gray-300 to-gray-500 h-40"></div>

                                <div className="w-full md:w-1/2 relative">
                                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-300 hover:shadow-xl transition">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

            <section className="w-full py-20 bg-aliceblue text-gray-900">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl font-bold text-center mb-12 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                            >
                                <button
                                    className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium hover:bg-gray-100 transition"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.question}
                                    <ChevronDown
                                        className={`w-6 h-6 text-gray-600 transition-transform ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 py-4 text-gray-600 border-t border-gray-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div >
    );
}
