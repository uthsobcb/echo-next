"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Graduate Student",
            content: "Echo has transformed how I process my thoughts. The AI insights are incredibly accurate and have helped me understand my emotional patterns better.",
            rating: 5,
            avatar: "SC"
        },
        {
            name: "Marcus Johnson",
            role: "Software Engineer",
            content: "The todo extraction feature is a game-changer. I no longer lose track of tasks buried in my journal entries. Absolutely love it!",
            rating: 5,
            avatar: "MJ"
        },
        {
            name: "Emily Rodriguez",
            role: "Therapist",
            content: "I recommend Echo to all my clients. The mood tracking and analytics provide valuable insights that complement our therapy sessions.",
            rating: 5,
            avatar: "ER"
        },
        {
            name: "David Kim",
            role: "Entrepreneur",
            content: "Best journaling app I've ever used. The OCR feature lets me digitize my handwritten notes instantly. Worth every penny!",
            rating: 5,
            avatar: "DK"
        }
    ];

    const faqs = [
        {
            question: "Is Echo really free?",
            answer: "Yes! Echo offers a generous free tier with all core features including journaling, mood tracking, and AI analysis. Premium features like advanced analytics and unlimited OCR scans are available in our paid plans."
        },
        {
            question: "How secure is my data?",
            answer: "Your privacy is our top priority. All journal entries are encrypted end-to-end using AES-256 encryption. We never read your entries, and you're the only one with access to your data."
        },
        {
            question: "Can I export my journal entries?",
            answer: "Absolutely! You can export all your entries in multiple formats including PDF, Markdown, and JSON. Your data is always yours to keep."
        },
        {
            question: "Does the AI read all my entries?",
            answer: "The AI processes your entries locally on your device for mood analysis. Only anonymized, encrypted metadata is used to improve our models. Your actual journal content never leaves your device unencrypted."
        },
        {
            question: "What makes Echo different from other journaling apps?",
            answer: "Echo combines traditional journaling with cutting-edge AI features like mood analysis, smart todo extraction, OCR scanning, and a conversational AI companion. Plus, we prioritize privacy with end-to-end encryption."
        },
        {
            question: "Can I use Echo on multiple devices?",
            answer: "Yes! Echo syncs seamlessly across all your devices - phone, tablet, and computer. Your entries are always up-to-date wherever you are."
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

            {/* Navigation */}
            <nav className="relative z-10 bg-white/50 backdrop-blur-md border-b border-gray-200 sticky top-0">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Sparkles className="w-8 h-8 text-indigo-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Echo
                            </span>
                        </motion.div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-4">
                                <Link
                                    href="/login"
                                    className="px-6 py-2 rounded-full border border-indigo-300 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg shadow-indigo-300 hover:shadow-indigo-400"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

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
                        </div>

                        {/* Right: Animated Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                        >
                            {/* Phone Mockup */}
                            <div className="relative mx-auto w-[300px] h-[600px]">
                                {/* Phone Frame */}
                                <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl p-3">
                                    {/* Screen */}
                                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                                        {/* Status Bar */}
                                        <div className="h-8 bg-gray-50 flex items-center justify-between px-6 text-xs">
                                            <span>9:41</span>
                                            <div className="flex gap-1">
                                                <div className="w-4 h-4 bg-green-500 rounded-full" />
                                            </div>
                                        </div>

                                        {/* App Content */}
                                        <div className="p-4 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-lg">Today's Entry</h3>
                                                <Sparkles className="w-5 h-5 text-indigo-600" />
                                            </div>

                                            {/* Mood Selector */}
                                            <div className="flex gap-2">
                                                {["😊", "😐", "😢", "😴", "🎉"].map((emoji, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.2 }}
                                                        className={`w-10 h-10 rounded-full ${i === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gray-100'} flex items-center justify-center text-xl cursor-pointer`}
                                                    >
                                                        {emoji}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Journal Text */}
                                            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ delay: 1, duration: 1 }}
                                                    className="h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "80%" }}
                                                    transition={{ delay: 1.2, duration: 1 }}
                                                    className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "60%" }}
                                                    transition={{ delay: 1.4, duration: 1 }}
                                                    className="h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded"
                                                />
                                            </div>

                                            {/* AI Insight Card */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 2 }}
                                                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Brain className="w-4 h-4" />
                                                    <span className="text-sm font-semibold">AI Insight</span>
                                                </div>
                                                <p className="text-xs opacity-90">Your mood is trending positive this week! 📈</p>
                                            </motion.div>

                                            {/* Todo Items */}
                                            <div className="space-y-2">
                                                {["Review project notes", "Call mom"].map((task, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 2.2 + i * 0.2 }}
                                                        className="flex items-center gap-2 bg-gray-50 rounded-xl p-3"
                                                    >
                                                        <div className="w-4 h-4 rounded border-2 border-indigo-600" />
                                                        <span className="text-sm">{task}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute -right-4 top-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-3 shadow-xl"
                                >
                                    <Heart className="w-6 h-6 text-white" />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -left-4 bottom-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-3 shadow-xl"
                                >
                                    <ListTodo className="w-6 h-6 text-white" />
                                </motion.div>
                            </div>
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
            </section>

            {/* Features Section */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* Comparison Table */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* Use Cases */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* Stats Section with Animated Counters */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* Testimonials */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                    {testimonial.avatar}
                                </div>
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
            </section>

            {/* Video Demo */}
            <section id="demo" className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* FAQ Section */}
            <section className="relative z-10 container mx-auto px-6 py-20">
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
            </section>

            {/* Trust Badges */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <h3 className="text-center text-lg text-gray-600 mb-8">
                        Trusted by users worldwide
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, label: "AES-256 Encrypted" },
                            { icon: Lock, label: "GDPR Compliant" },
                            { icon: Award, label: "Best App 2024" },
                            { icon: Users, label: "10K+ Users" }
                        ].map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 backdrop-blur-sm"
                            >
                                <badge.icon className="w-10 h-10 text-indigo-600" />
                                <span className="text-sm font-semibold text-center text-gray-700">
                                    {badge.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Newsletter Signup */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="p-12 rounded-3xl bg-white/80 border-gray-200 border backdrop-blur-sm">
                        <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-gray-700 mb-8">
                            Get the latest features, tips, and insights delivered to your inbox
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full bg-white border-gray-300 text-gray-900 border focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Subscribe
                            </button>
                        </form>

                        {newsletterStatus === "success" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-green-600 flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                <span>Thanks for subscribing!</span>
                            </motion.div>
                        )}

                        {newsletterStatus === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-red-600 flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                <span>Please enter a valid email</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Final CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-20 mb-20">
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
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Echo
                            </span>
                        </div>
                        <div className="flex gap-8 text-gray-600">
                            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">
                                Terms
                            </Link>
                            <Link href="/guide" className="hover:text-indigo-600 transition-colors">
                                Guide
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm">
                            © 2024 Echo. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
