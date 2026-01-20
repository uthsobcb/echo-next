"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Sparkles, Brain, Lock, TrendingUp, Heart, Camera, MessageCircleHeart,
    ListTodo, LucideFlower, CalendarDays, PencilLine, ChevronDown,
    Mail, Check, X, Play, Shield, Award, Users,
    ArrowRight, Star, Menu, ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [email, setEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState(null);
    const [openFAQ, setOpenFAQ] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    // Sticky CTA on scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowStickyCTA(window.scrollY > 800);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Newsletter submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email && email.includes("@")) {
            setNewsletterStatus("success");
            setEmail("");
            setTimeout(() => setNewsletterStatus(null), 3000);
        } else {
            setNewsletterStatus("error");
            setTimeout(() => setNewsletterStatus(null), 3000);
        }
    };

    const features = [
        {
            icon: PencilLine,
            title: "Write & Reflect",
            description: "Capture your thoughts, feelings, and experiences with our intuitive journaling interface.",
            gradient: "from-blue-500 to-indigo-500",
            demo: "Real-time auto-save"
        },
        {
            icon: Brain,
            title: "AI Mood Analysis",
            description: "Advanced AI analyzes your entries to detect mood patterns and provide personalized insights.",
            gradient: "from-indigo-500 to-purple-500",
            demo: "98% accuracy"
        },
        {
            icon: Camera,
            title: "OCR Text Scanning",
            description: "Scan handwritten notes with your camera and convert them to digital text instantly.",
            gradient: "from-purple-500 to-pink-500",
            demo: "Multi-language support"
        },
        {
            icon: ListTodo,
            title: "Smart Todo Extraction",
            description: "AI automatically identifies and organizes tasks from your journal entries.",
            gradient: "from-green-500 to-emerald-500",
            demo: "Auto-categorization"
        },
        {
            icon: MessageCircleHeart,
            title: "Chat with Echo",
            description: "24/7 AI companion that remembers your conversations and provides emotional support.",
            gradient: "from-pink-500 to-rose-500",
            demo: "Context-aware responses"
        },
        {
            icon: TrendingUp,
            title: "Mood Analytics",
            description: "Visualize your emotional journey with interactive charts and mood heatmaps.",
            gradient: "from-blue-500 to-cyan-500",
            demo: "Weekly insights"
        },
        {
            icon: CalendarDays,
            title: "Memory Timeline",
            description: "Revisit and reflect on your past entries with intelligent search and calendar view.",
            gradient: "from-orange-500 to-amber-500",
            demo: "Smart search"
        },
        {
            icon: LucideFlower,
            title: "Guided Meditation",
            description: "Built-in breathing exercises with ambient sounds to help you find calm and clarity.",
            gradient: "from-teal-500 to-green-500",
            demo: "5-min sessions"
        },
        {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "Your thoughts are private. Military-grade encryption ensures complete security.",
            gradient: "from-gray-600 to-slate-600",
            demo: "AES-256 encryption"
        }
    ];

    // const testimonials = [
    //     {
    //         name: "Sarah Chen",
    //         role: "Graduate Student",
    //         content: "Echo has transformed how I process my thoughts. The AI insights are incredibly accurate and have helped me understand my emotional patterns better.",
    //         rating: 5,
    //         avatar: "SC"
    //     },
    //     {
    //         name: "Marcus Johnson",
    //         role: "Software Engineer",
    //         content: "The todo extraction feature is a game-changer. I no longer lose track of tasks buried in my journal entries. Absolutely love it!",
    //         rating: 5,
    //         avatar: "MJ"
    //     },
    //     {
    //         name: "Emily Rodriguez",
    //         role: "Therapist",
    //         content: "I recommend Echo to all my clients. The mood tracking and analytics provide valuable insights that complement our therapy sessions.",
    //         rating: 5,
    //         avatar: "ER"
    //     },
    //     {
    //         name: "David Kim",
    //         role: "Entrepreneur",
    //         content: "Best journaling app I've ever used. The OCR feature lets me digitize my handwritten notes instantly. Worth every penny!",
    //         rating: 5,
    //         avatar: "DK"
    //     }
    // ];

    const testimonials = [
        {
            name: "Shihab",
            role: "Daily User",
            content: "It's fun journaling & chatting with Echo. Very well done!",
            avatar: "/assets/shihab.png",
            rating: 5
        },
        {
            name: "Arafath",
            role: "Student",
            content: "The AI insights are so helpful and spot on.",
            avatar: "/assets/arafath.png",
            rating: 5
        },
        {
            name: "Evak Chan",
            role: "from ProductHunt",
            content: "The feature of tracking mood is fantastic. Through long-term use, users can clearly see the trajectory of their emotional development and make adjustments or improvements based on the data. Congrats on the launch!",
            avatar: "https://ph-avatars.imgix.net/7875988/8f14992b-b3b1-4b30-83ca-f683b37d0e8d.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1",
            rating: 5
        },
        {
            name: "Md Mobashir Hasan",
            role: "from ProductHunt",
            content: "Love what you have built, Uthsob! Echo feels warm, thoughtful, and real. The mood-based journaling and focus on privacy are amazing. Maybe voice notes could be a cool add-on for days when typing feels hard. Keep going — Echo is something special! ☁️✨",
            avatar: "https://ph-avatars.imgix.net/5085015/cfa4d47f-0001-4181-a126-440f48e1368c.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&frame=1&dpr=1",
            rating: 5
        },
    ];

    const faqs = [
        {
            question: "How does Echo's AI mood analysis work?",
            answer: "Echo uses advanced natural language processing to analyze the emotional tone, sentiment, and psychological patterns in your writing. It provides real-time insights while maintaining complete privacy through end-to-end encryption."
        },
        {
            question: "Can I scan handwritten journal pages?",
            answer: "Yes! Echo includes advanced OCR (Optical Character Recognition) technology. Simply use your device's camera to scan handwritten notes, and they'll be converted to searchable digital text automatically."
        },
        {
            question: "How does the smart todo extraction work?",
            answer: "Echo's AI reads your journal entries and automatically identifies actionable tasks, goals, and commitments. These are organized into categories like 'personal', 'work', or 'mental health' and tracked separately from your journal."
        },
        {
            question: "Is my data really private and secure?",
            answer: "Absolutely. Echo uses military-grade end-to-end encryption. Your journal content is encrypted before it leaves your device, and even we can't read it. You have full control over your data with export capabilities."
        },
        {
            question: "What makes Echo's AI chat different from other chatbots?",
            answer: "Echo remembers your conversation history and learns from your journaling patterns to provide personalized, contextual support. It's designed specifically for emotional wellness and mental health conversations."
        },
        {
            question: "Can I use Echo offline?",
            answer: "Yes! Echo is a Progressive Web App (PWA) that works offline. You can write entries without an internet connection, and they'll sync when you're back online."
        },
        {
            question: "How do the guided meditations work?",
            answer: "Echo includes built-in breathing exercises with visual guides, ambient sounds, and customizable durations. It's designed to help you center yourself before journaling or whenever you need a moment of calm."
        },
        {
            question: "Can I export my data?",
            answer: "Yes! You own your data completely. You can export all your entries, mood data, and insights in standard formats anytime. No vendor lock-in, ever."
        }
    ];



    const useCases = [
        {
            icon: Users,
            title: "Students",
            description: "Track academic progress, manage stress, and extract study tasks automatically from your notes.",
            benefits: ["Stress management", "Task tracking", "Study insights"]
        },
        {
            icon: Brain,
            title: "Professionals",
            description: "Reflect on work challenges, track career growth, and maintain work-life balance.",
            benefits: ["Career reflection", "Goal tracking", "Productivity boost"]
        },
        {
            icon: Heart,
            title: "Mental Wellness",
            description: "Monitor emotional health, identify triggers, and build healthier thought patterns.",
            benefits: ["Mood tracking", "Pattern recognition", "Emotional growth"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 overflow-hidden">

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Sticky CTA */}
            <AnimatePresence>
                {showStickyCTA && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 right-8 z-40"
                    >
                        <Link
                            href="/register"
                            className="flex items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 font-semibold"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 py-20 md:py-32">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 border-indigo-200 text-indigo-700 border text-sm mb-6">
                                    ✨ AI-Powered Journaling Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                            >
                                Write, Reflect, and
                                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Grow with Echo
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-700 mb-10"
                            >
                                Your personal AI companion for journaling. Track your mood, extract tasks automatically, chat with Echo, and discover insights about your emotional journey.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link
                                    href="/register"
                                    className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-xl shadow-indigo-300 hover:shadow-indigo-400 text-lg font-semibold hover:scale-105 transform text-center"
                                >
                                    Start Journaling Free
                                </Link>
                                <Link
                                    href="#demo"
                                    className="px-8 py-4 rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-lg font-semibold hover:scale-105 transform text-center"
                                >
                                    Watch Demo
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 text-sm text-gray-600"
                            >
                                <p>✓ No credit card required  ✓ Free forever  ✓ End-to-end encrypted</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200"
                            >
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-medium text-green-700">
                                    📱 Android App Coming Soon!
                                </span>
                            </motion.div>
                        </div>

                        {/* Right: Animated Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative z-10"
                        >


                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative rounded-3xl overflow-hidden backdrop-blur-sm"
                            >
                                <Image
                                    src="/assets/image.png"
                                    alt="Echo App Interface"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover rounded-2xl"
                                    priority
                                />

                                {/* Glass Reflection Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-2xl" />
                            </motion.div>

                            {/* Floating Element: Mood Analysis */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                                transition={{ delay: 0.8, duration: 4, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute -right-8 top-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <Sparkles className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium">Current Mood</div>
                                        <div className="text-sm font-bold text-gray-800">Productive & Calm</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element: Heart/Likes */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                className="absolute -right-4 bottom-40 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-3 shadow-xl"
                            >
                                <Heart className="w-6 h-6 text-white" />
                            </motion.div>

                            {/* Floating Element: Task Completion */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                className="absolute -left-8 bottom-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <ListTodo className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium">Daily Tasks</div>
                                        <div className="text-sm font-bold text-gray-800">4/5 Completed</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element: Streak */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, rotate: [0, 5, 0] }}
                                transition={{ delay: 1, duration: 5, repeat: Infinity }}
                                className="absolute -left-4 top-24 bg-gradient-to-br from-orange-400 to-amber-500 text-white p-3 rounded-2xl shadow-lg"
                            ></motion.div>

                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex justify-center mt-16"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-gray-600"
                        >
                            <ChevronDown className="w-8 h-8" />
                        </motion.div>
                    </motion.div>
                </div>
            </section >

            {/* Features Section */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Everything You Need for
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Mindful Journaling
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                        Powerful AI features to enhance your self-reflection journey
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl bg-white/80 border-gray-200 hover:border-indigo-300 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                            <div className="text-sm font-semibold text-indigo-600">
                                {feature.demo}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section >

            {/* Comparison Table */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        Why Choose
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Echo?
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg text-center mb-12">
                        See how Echo compares to traditional journaling
                    </p>

                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-6 text-left">Feature</th>
                                    <th className="p-6 text-center">Traditional Journaling</th>
                                    <th className="p-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Echo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: "Mood Tracking", traditional: false, echo: true },
                                    { feature: "AI Insights", traditional: false, echo: true },
                                    { feature: "Task Extraction", traditional: false, echo: true },
                                    { feature: "OCR Scanning", traditional: false, echo: true },
                                    { feature: "Search & Filter", traditional: false, echo: true },
                                    { feature: "Cloud Sync", traditional: false, echo: true },
                                    { feature: "Privacy & Encryption", traditional: true, echo: true },
                                    { feature: "AI Companion Chat", traditional: false, echo: true },
                                ].map((row, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border-t border-gray-200"
                                    >
                                        <td className="p-6 font-medium">{row.feature}</td>
                                        <td className="p-6 text-center">
                                            {row.traditional ? (
                                                <Check className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-gray-400 mx-auto" />
                                            )}
                                        </td>
                                        <td className="p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                            {row.echo ? (
                                                <Check className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-gray-400 mx-auto" />
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </section >

            {/* Use Cases */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Perfect For
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Everyone
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                        Whether you're a student, professional, or focused on mental wellness
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 rounded-2xl bg-white/80 border-gray-200 border backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                                <useCase.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                            <p className="text-gray-600 mb-6">{useCase.description}</p>
                            <ul className="space-y-2">
                                {useCase.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section >

            {/* Stats Section with Animated Counters */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { number: "10K+", label: "Active Users" },
                            { number: "500K+", label: "Journal Entries" },
                            { number: "95%", label: "User Satisfaction" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200 border"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                                    className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-gray-700 text-lg">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section >

            {/* Testimonials */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Loved by
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Thousands
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                        See what our users have to say about their Echo experience
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/80 border-gray-200 border backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" />
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                "{testimonial.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section >

            {/* Video Demo */}
            < section id="demo" className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        See Echo in
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Action
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg mb-12">
                        Watch a quick walkthrough of Echo's powerful features
                    </p>

                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center group cursor-pointer hover:shadow-2xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300"
                        >
                            <Play className="w-8 h-8 text-indigo-600 ml-1" />
                        </motion.div>
                        <div className="absolute bottom-8 left-8 right-8 text-left">
                            <div className="text-white text-2xl font-bold mb-2">Echo Product Demo</div>
                            <div className="text-white/80">3 minutes • Full feature walkthrough</div>
                        </div>
                    </div>
                </motion.div>
            </section >

            {/* FAQ Section */}
            < section className="relative z-10 container mx-auto px-6 py-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        Frequently Asked
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-gray-700 text-lg text-center mb-12">
                        Everything you need to know about Echo
                    </p>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 border-gray-200 border backdrop-blur-sm rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-indigo-50 transition-colors"
                                >
                                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="w-6 h-6 flex-shrink-0" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFAQ === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section >



            {/* Final CTA Section */}
            < section className="relative z-10 container mx-auto px-6 py-20 mb-20" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Join thousands of users who have transformed their mental wellness with Echo.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-10 py-5 rounded-full bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-300 shadow-xl text-xl font-semibold hover:scale-105 transform"
                    >
                        Get Started for Free
                    </Link>
                </motion.div>
            </section >

        </div >
    );
}
