'use client';

import { useState } from "react";
import { CheckCircle, Star, Heart, Sparkles, PenTool, ChevronDown, ArrowRight, User, Lock } from "lucide-react";
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
        title: "Step 1: Express yourself",
        description: "Write, add images, or scan handwritten notes seamlessly.",
        image: "/assets/entry.png",
    },
    {
        title: "Step 2: Echo Analyze mood automatically",
        description: "Echo analyzes your mood automatically, and add a supportive note on your journal.",
        image: "/assets/echo-mood.png",
    },
    {
        title: "Step 3: AI Insights",
        description: "Get meaningful AI-powered insights based on your journaling habits.",
        image: "/assets/Analytics.png",
    },
    {
        title: "Step 4: Chat with Echo",
        description: "Chat with Echo, your AI journaling companion, to get support and guidance.",
        image: "/assets/chat.png",
    },
    {
        title: "Step 5: Get insights on your inbox",
        description: "Get insights right on your inbox, Echo sends a summary of your moods every week.",
        image: "/assets/mail.png",
    }
];

const badges = [
    { id: 1, name: "Echo Sunshine", desc: "Earned by Just joining Echo", img: "/assets/Echos-Sun.png" },
    { id: 2, name: "Pen Whisperer", desc: "Earned by Writing 7 Journals", img: "/assets/badge_1.png" },
    { id: 3, name: "Mindful Scribe", desc: "Earned by Writing 30 Journals", img: "/assets/badge_2.png" },
    { id: 4, name: "Thought Architect", desc: "Earned by Writing 40 Journals", img: "/assets/badge_3.png" },
    { id: 5, name: "Guardian of Inked Wisdom", desc: "Earned by Writing 60 Journals", img: "/assets/badge_4.png" }
];


const faqs = [
    {
        question: "What is Echo?",
        answer: "Echo is an AI-powered journaling app that helps you write, track your mood, and get insights into your emotional patterns.",
    },
    {
        question: "What is Journal?",
        answer: "Journal is a place where you can write down your thoughts, feelings, and experiences. It is a place where you can be yourself and express yourself.",
    },
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
    {
        question: "How do I earn badges?",
        answer: "You earn badges by writing journals. The more you write, the more badges you earn.",
    },
];



export default function LandingPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4">
            <section className="relative w-full flex flex-col items-center">
                <div className="text-center py-20 px-6 max-w-3xl">
                    <p className="p-2 bg-gray-400/35 text-gray-600 border rounded-full max-w-48 mx-auto">✨ Introducing</p>

                    <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
                        <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-blue-200 text-transparent bg-clip-text">Echo </span>
                        { }: Your AI Journaling Companion
                    </h1>
                    <p className="mt-6 text-xl text-gray-700 leading-relaxed">
                        Track your thoughts, moods, and insights with Echo – the AI-powered journaling app that grows with you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <Link
                            href="/register"
                            className="inline-block mt-8 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
                        >
                            Get Started for Free
                        </Link>
                        <button
                            onClick={() => document.getElementById('demoVideo').scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center mt-8 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:text-blue-700 transition-all"
                        >
                            Watch Demo
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Video Section */}
                <div id="demoVideo" className="w-full max-w-6xl mx-auto px-4 mb-20">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                        <div
                            className="relative w-full"
                            style={{
                                position: "relative",
                                boxSizing: "content-box",
                                maxHeight: "80vh",
                                width: "100%",
                                aspectRatio: "1.826086956521739",
                            }}
                        >
                            <iframe
                                src="https://app.supademo.com/embed/cm81zjbhu0hsbicgem08esrl5?embed_v=2"
                                loading="lazy"
                                title="Echo Demo"
                                allow="clipboard-write"
                                frameBorder="0"
                                webkitallowfullscreen="true"
                                mozallowfullscreen="true"
                                allowFullScreen
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add required styles to the head */}
            <style jsx global>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 4s linear infinite;
                }
                
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

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
                        { title: "Secure & Private", desc: "Your data is encrypted and only accessible by you.", icon: Lock },
                        { title: "Custom Echo Themes", desc: "Personalize your Echo's look and feel.", icon: Sparkles },
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



            <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 border rounded-xl">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                            What Our Users Say
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg">
                            Discover how Echo is helping people express themselves
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                name: "Shihab",
                                role: "Daily User",
                                review: "It's fun journaling & chatting with Echo. Very well done!",
                                image: "/assets/shihab.png"
                            },
                            {
                                name: "Arafath",
                                role: "Student",
                                review: "The AI insights are so helpful and spot on.",
                                image: "/assets/arafath.png"
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {testimonial.image ? (
                                            <Image
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="relative">
                                    <span className="absolute top-0 left-0 text-6xl text-blue-100 -z-10">"</span>
                                    <p className="text-gray-700 text-lg leading-relaxed pl-6 italic">
                                        {testimonial.review}
                                    </p>
                                </blockquote>

                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200">
                            See More Reviews
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-blue-50 text-gray-900">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold">Every Entry Counts – Unlock Badges!</h2>
                    <p className="mt-4 text-lg text-gray-700">
                        Stay motivated by unlocking achievements as you build a consistent journaling habit.
                    </p>

                    {/* Badge Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {badges.map((badge, index) => (
                            <div key={index} className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                                <Image src={badge.img} alt="Badge Image" height={250} width={350} className="w-full object-cover" />

                                {/* Overlay Text */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-4 text-center transition-all duration-300 group-hover:bg-black/80">
                                    <h3 className="text-xl">{badge.name}</h3>
                                    <p className="text-sm mt-1">{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>


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
