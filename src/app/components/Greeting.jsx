"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Lock, PencilLine, TrendingUp } from "lucide-react";

export default function GreetingsPage({ name }) {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("morning");
        else if (hour < 18) setGreeting("afternoon");
        else setGreeting("Good evening");
    }, []);

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const features = [

        {
            title: "Write & Reflect",
            description: "Capture your thoughts, feelings, and experiences",
            navigate: "/entry",
            icon: <PencilLine className="text-indigo-600 w-5 h-5 group-hover:scale-110 transition-transform" />,
        },
        {
            title: "Mood Analytics",
            description: "Your mood patterns will be visualized as you create journal entries",
            navigate: "/profile",
            icon: <TrendingUp className="text-indigo-600 w-5 h-5 group-hover:scale-110 transition-transform" />,
        },
        {
            title: "Revisit Memories",
            description: "Look back on your past entries and reflect",
            navigate: "/memory",
            icon: <CalendarDays className="text-indigo-600 w-5 h-5 group-hover:scale-110 transition-transform" />,
        },
        {
            title: "Private and Encrypted",
            description: "Your data is stored securely and privately",
            navigate: "/legal/privacy",
            icon: <Lock className="text-indigo-600 w-5 h-5 group-hover:scale-110 transition-transform" />,
        },
    ];

    return (
        <main className="min-h-screen text-gray-800 flex flex-col items-center justify-center px-6 py-16">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    How is your <span className="text-indigo-500">{greeting}</span>, {name}?
                </h1>

                <div className="flex justify-center items-center gap-2 text-indigo-600 mb-4">
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-lg font-medium">
                        Today:{" "}
                        <span className="text-gray-700 font-semibold">
                            {today}
                        </span>
                    </span>
                </div>

                <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                    Welcome to your <span className="text-indigo-600 font-medium">Echo</span> —
                    a space to <em>Write</em>, <em>Reflect</em>, and <em>Grow</em> 🚀☁️.
                    Start capturing your thoughts and track your mood over time.
                </p>

                <Link
                    href="/entry"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3 px-6 rounded-full shadow-md transition-all duration-200"
                >
                    <PencilLine className="w-4 h-4" />
                    Create Today's Journal Entry
                </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
                {features.map((feature, idx) => (
                    <Link
                        href={feature.navigate}
                        key={idx}
                        className="group border border-gray-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 rounded-xl p-6 transition-all duration-200 shadow-sm"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                {/* <PencilLine className="text-indigo-600 w-5 h-5 group-hover:scale-110 transition-transform" /> */}
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-700">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-snug">{feature.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>

    );
}
