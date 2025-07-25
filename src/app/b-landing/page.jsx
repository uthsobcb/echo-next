'use client';
import { useState } from "react";
import {
    CheckCircle, Star, Heart, PenTool, ChevronDown, ArrowRight, User, Lock,
    Camera, Upload, Brain, Calendar, BarChart3, Shield, Mail, Search,
    Download, MessageCircle, Edit3, TrendingUp, Smartphone, Globe, Zap,
    Trophy, Users, Target, Settings, Headphones, RotateCcw, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Move Card component inside the file as an internal component
function Card({ children, className = "" }) {
    return (
        <div className={`bg-white shadow-xl rounded-2xl p-8 transition-transform transform hover:scale-105 ${className}`}>
            {children}
        </div>
    );
}

// Create a placeholder Meditation icon since it's referenced but not imported
const Meditation = Target; // Using Target as placeholder, replace with actual meditation icon

const features = [
    {
        category: "Smart Writing",
        items: [
            { title: "AI-Powered Writing", desc: "Get intelligent writing prompts tailored to your mood and goals", icon: Brain },
            { title: "OCR Text Scanning", desc: "Scan handwritten notes with your camera and convert to digital text", icon: Camera },
            { title: "Image Attachments", desc: "Add photos, sketches, and visual memories to your entries", icon: Upload },
            { title: "Entry Editing", desc: "Edit and refine your past journal entries anytime", icon: Edit3 }
        ]
    },
    {
        category: "Mood Intelligence",
        items: [
            { title: "AI Mood Analysis", desc: "Advanced sentiment analysis provides deep insights into your emotional patterns", icon: Heart },
            { title: "Real-time Analytics", desc: "Interactive charts and visualizations of your mood trends", icon: BarChart3 },
            { title: "Mood Heatmap", desc: "Calendar view showing your journaling consistency and emotional journey", icon: Calendar },
            { title: "Weekly Insights", desc: "Receive personalized mood summaries and patterns via email", icon: Mail }
        ]
    },
    {
        category: "Productivity & Wellness",
        items: [
            { title: "Smart Todo Extraction", desc: "AI automatically identifies and organizes tasks from your journal entries", icon: Target },
            { title: "Guided Meditation", desc: "Built-in breathing exercises with ambient sounds and visual guides", icon: Meditation },
            { title: "Progress Tracking", desc: "Achievement badges and milestones to celebrate your growth", icon: Trophy },
            { title: "Memory Timeline", desc: "Revisit and reflect on your past entries with intelligent search", icon: RotateCcw }
        ]
    },
    {
        category: "AI Companion",
        items: [
            { title: "Echo Chat", desc: "24/7 AI companion that remembers your conversations and provides emotional support", icon: MessageCircle },
            { title: "Contextual Responses", desc: "AI learns from your patterns to provide personalized advice and insights", icon: Zap },
            { title: "Crisis Support", desc: "Intelligent detection of distress with helpful resources and coping strategies", icon: Shield },
            { title: "Growth Coaching", desc: "Personalized recommendations for mental wellness and self-improvement", icon: TrendingUp }
        ]
    },
    {
        category: "Privacy & Control",
        items: [
            { title: "End-to-End Encryption", desc: "Military-grade encryption ensures your thoughts remain completely private", icon: Lock },
            { title: "Data Export", desc: "Download all your data anytime - you own your digital memories", icon: Download },
            { title: "Advanced Search", desc: "Find any entry instantly with powerful search across content and emotions", icon: Search },
            { title: "Profile Management", desc: "Full control over your account, preferences, and privacy settings", icon: Settings }
        ]
    },
    {
        category: "Modern Experience",
        items: [
            { title: "Progressive Web App", desc: "Install on any device, works offline, push notifications", icon: Smartphone },
            { title: "Admin Dashboard", desc: "Comprehensive analytics for understanding user engagement and wellbeing", icon: Users },
            { title: "Cross-Platform", desc: "Seamless experience across desktop, tablet, and mobile devices", icon: Globe },
            { title: "Background Audio", desc: "Ambient sounds and meditation music to enhance your writing experience", icon: Headphones }
        ]
    }
];

const comparisonFeatures = [
    { feature: "AI Mood Analysis", echo: true, traditional: false },
    { feature: "OCR Text Scanning", echo: true, traditional: false },
    { feature: "Smart Todo Extraction", echo: true, traditional: false },
    { feature: "AI Chat Companion", echo: true, traditional: false },
    { feature: "Real-time Analytics", echo: true, traditional: false },
    { feature: "End-to-End Encryption", echo: true, traditional: "Limited" },
    { feature: "Image Attachments", echo: true, traditional: true },
    { feature: "Guided Meditation", echo: true, traditional: false },
    { feature: "Progress Badges", echo: true, traditional: false },
    { feature: "Data Export", echo: true, traditional: "Limited" },
    { feature: "Cross-Platform PWA", echo: true, traditional: false },
    { feature: "Email Insights", echo: true, traditional: false }
];

const workflows = [
    {
        title: "The Traditional Journaler",
        description: "Perfect for those who love the classic pen-to-paper feel",
        steps: [
            { icon: PenTool, text: "Write your thoughts naturally" },
            { icon: Camera, text: "Scan handwritten notes with OCR" },
            { icon: Heart, text: "AI analyzes your mood automatically" },
            { icon: BarChart3, text: "View insights and patterns" }
        ]
    },
    {
        title: "The Digital Native",
        description: "For those who prefer modern, app-based experiences",
        steps: [
            { icon: Brain, text: "Get AI-powered writing prompts" },
            { icon: Upload, text: "Add images and visual memories" },
            { icon: MessageCircle, text: "Chat with Echo for support" },
            { icon: Trophy, text: "Earn badges for consistency" }
        ]
    },
    {
        title: "The Wellness Seeker",
        description: "Focused on mental health and emotional growth",
        steps: [
            { icon: Meditation, text: "Start with guided meditation" },
            { icon: Target, text: "Set wellness goals in entries" },
            { icon: Mail, text: "Receive weekly mood insights" },
            { icon: TrendingUp, text: "Track emotional progress" }
        ]
    }
];

const testimonials = [
    {
        name: "Dr. Sarah Chen",
        role: "Clinical Psychologist",
        review: "Echo's AI-powered mood analysis provides insights that would take weeks to identify in traditional therapy. The encryption and privacy features make it ideal for sensitive emotional work.",
        image: "/assets/arafath.png",
        rating: 5
    },
    {
        name: "Evak Chan",
        role: "ProductHunt User",
        review: "The feature of tracking mood is fantastic. Through long-term use, users can clearly see the trajectory of their emotional development and make adjustments or improvements based on the data. Congrats on the launch!",
        image: null, // Remove problematic external URL
        rating: 5
    },
    {
        name: "Alex Rodriguez",
        role: "Software Engineer",
        review: "The OCR feature is incredible - I can scan my handwritten notes and they become searchable. Echo's AI catches emotional patterns I never noticed myself.",
        image: "/assets/shihab.png",
        rating: 5
    },
    {
        name: "Md Mobashir Hasan",
        role: "ProductHunt User",
        review: "Love what you have built! Echo feels warm, thoughtful, and real. The mood-based journaling and focus on privacy are amazing. Maybe voice notes could be a cool add-on for days when typing feels hard. Keep going — Echo is something special! ☁️✨",
        image: null, // Remove problematic external URL
        rating: 5
    },
    {
        name: "Shihab",
        role: "Daily User",
        review: "It's fun journaling & chatting with Echo. The meditation feature helps me center myself before writing. Very well done!",
        image: "/assets/shihab.png",
        rating: 5
    },
    {
        name: "Arafath",
        role: "Student",
        review: "The AI insights are so helpful and spot on. The todo extraction feature helps me stay organized without extra effort.",
        image: "/assets/arafath.png",
        rating: 5
    }
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

const pricingPlans = [
    {
        name: "Echo Free",
        price: "$0",
        period: "forever",
        description: "Perfect for getting started with AI journaling",
        features: [
            "Unlimited journal entries",
            "Basic mood analysis",
            "OCR text scanning",
            "Image attachments",
            "Basic analytics",
            "End-to-end encryption"
        ],
        cta: "Start Free",
        highlighted: false
    },
    {
        name: "Echo Plus",
        price: "$9",
        period: "month",
        description: "Advanced features for serious journalers",
        features: [
            "Everything in Free",
            "Advanced AI insights",
            "Echo AI chat companion",
            "Smart todo extraction",
            "Guided meditations",
            "Weekly email insights",
            "Priority support",
            "Advanced analytics",
            "Progress badges"
        ],
        cta: "Start Plus Trial",
        highlighted: true
    },
    {
        name: "Echo Pro",
        price: "$99",
        period: "year",
        description: "Ultimate journaling experience with all features",
        features: [
            "Everything in Plus",
            "Admin dashboard access",
            "Custom AI prompts",
            "Advanced export options",
            "White-label options",
            "API access",
            "Custom integrations",
            "Premium support"
        ],
        cta: "Go Pro",
        highlighted: false
    }
];

export default function BLandingPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [activeWorkflow, setActiveWorkflow] = useState(0);

    const toggleFAQ = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 px-6 overflow-hidden w-full">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
                            Echo 2.0
                        </span>
                        <br />
                        <span className="text-gray-800">The Future of Journaling</span>
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        AI-powered journaling with OCR scanning, smart todo extraction, real-time mood analysis,
                        and an empathetic chat companion. Your thoughts, elevated by technology.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                        <Link
                            href="/register"
                            className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-semibold shadow-xl transition-all transform hover:scale-105"
                        >
                            Start Your Journey Free
                            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#features"
                            className="px-10 py-5 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 text-xl font-semibold transition-all transform hover:scale-105"
                        >
                            Explore Features
                        </Link>
                    </div>

                    {/* Feature Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                            <Camera className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                            <h3 className="font-semibold text-gray-900 mb-2">OCR Scanning</h3>
                            <p className="text-gray-600 text-sm">Scan handwritten notes instantly</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                            <Brain className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
                            <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
                            <p className="text-gray-600 text-sm">Deep emotional pattern analysis</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                            <MessageCircle className="w-8 h-8 text-indigo-600 mb-3 mx-auto" />
                            <h3 className="font-semibold text-gray-900 mb-2">Echo Chat</h3>
                            <p className="text-gray-600 text-sm">24/7 AI emotional support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Selection */}
            <section className="py-20 px-6 bg-white w-full" id="workflows">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Choose Your Journaling Style</h2>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {workflows.map((workflow, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveWorkflow(index)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${activeWorkflow === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {workflow.title}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                {workflows[activeWorkflow].title}
                            </h3>
                            <p className="text-lg text-gray-600">
                                {workflows[activeWorkflow].description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {workflows[activeWorkflow].steps.map((step, index) => {
                                const StepIcon = step.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md">
                                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            {StepIcon && <StepIcon className="w-6 h-6 text-blue-600" />}
                                        </div>
                                        <p className="font-medium text-gray-900">{step.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Features */}
            <section className="py-20 px-6 bg-gray-50 w-full" id="features">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Every Feature You Need & More</h2>

                    {features.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="mb-16">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                                {category.category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.items.map((feature, index) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300">
                                            {IconComponent && <IconComponent className="text-blue-500 mx-auto mb-4" size={40} />}
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-20 px-6 bg-white w-full">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Echo vs Traditional Journaling Apps</h2>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-3 bg-gray-50 font-semibold text-gray-900 p-4 text-sm md:text-base">
                            <div>Feature</div>
                            <div className="text-center">Echo</div>
                            <div className="text-center">Others</div>
                        </div>

                        {comparisonFeatures.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 p-4 border-b border-gray-100 items-center text-sm md:text-base">
                                <div className="font-medium text-gray-900 pr-2">{item.feature}</div>
                                <div className="text-center">
                                    {item.echo === true ? (
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                                    ) : item.echo === false ? (
                                        <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                                    ) : (
                                        <span className="text-yellow-600 font-medium text-xs md:text-sm">{item.echo}</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    {item.traditional === true ? (
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto" />
                                    ) : item.traditional === false ? (
                                        <X className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto" />
                                    ) : (
                                        <span className="text-yellow-600 font-medium text-xs md:text-sm">{item.traditional}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 w-full">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Choose Your Plan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`bg-white rounded-2xl p-8 shadow-xl relative ${plan.highlighted ? 'ring-4 ring-blue-500 transform scale-105' : ''
                                }`}>
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {plan.price}
                                        <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                                    </div>
                                    <p className="text-gray-600">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/register"
                                    className={`w-full py-3 px-6 rounded-xl font-semibold text-center block transition-all ${plan.highlighted
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials */}
            <section className="py-20 px-6 bg-white w-full">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Trusted by Users Worldwide</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        {testimonial.image ? (
                                            <Image
                                                src={testimonial.image}
                                                alt={`${testimonial.name} avatar`}
                                                width={48}
                                                height={48}
                                                className="object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <User className={`w-6 h-6 text-gray-400 ${testimonial.image ? 'hidden' : 'block'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg text-gray-900 truncate">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{testimonial.role}</p>
                                    </div>
                                    <div className="flex space-x-1 flex-shrink-0">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <blockquote className="relative">
                                    <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">
                                        "{testimonial.review}"
                                    </p>
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-gray-50 w-full">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium hover:bg-gray-50 transition"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.question}
                                    <ChevronDown className={`w-6 h-6 text-gray-600 transition-transform ${openFaqIndex === index ? "rotate-180" : ""
                                        }`} />
                                </button>
                                {openFaqIndex === index && (
                                    <div className="px-6 py-4 text-gray-600 border-t border-gray-200 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white w-full">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Journaling?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of users who've discovered the power of AI-enhanced self-reflection
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition text-lg"
                        >
                            Start Free Today
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition text-lg"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm opacity-75">
                        <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            100% Private & Encrypted
                        </div>
                        <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Works on All Devices
                        </div>
                        <div className="flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export Anytime
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
