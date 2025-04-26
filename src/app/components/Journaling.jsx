'use client';

import { Rocket, Search, Smile, Palette } from 'lucide-react';

export default function JournalingSection() {
    return (
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl">

            {/* Left Side */}
            <section className="py-16 px-8 md:w-1/2 flex flex-col justify-center text-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
                <div className="max-w-md mx-auto space-y-8">
                    <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
                        What’s Journaling Anyway?
                    </h2>

                    <div className="text-gray-600 text-lg leading-relaxed space-y-5 text-start">
                        <p className="transition-all duration-700">
                            Journaling is like texting your brain — but deeper.
                        </p>
                        <p className="transition-all duration-700 delay-100">
                            Capture your chaos, sort your feels, track your growth.
                        </p>
                        <p className="transition-all duration-700 delay-100">
                            Build self-awareness with every word.</p>
                        <p className="transition-all duration-700 delay-300">
                            (Way cheaper than therapy. No cap.)
                        </p>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="hidden md:flex justify-center items-center mx-4">
                <div className="relative flex items-center justify-center">
                    <div className="w-1 h-40 bg-gradient-to-b from-blue-400 to-teal-400 rounded-full opacity-70 animate-pulse"></div>
                </div>
            </div>

            {/* Right Side */}
            <section className="py-16 px-8 md:w-1/2 flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
                <div className="max-w-md mx-auto space-y-8">
                    <h2 className="text-5xl font-extrabold text-center text-gray-800 leading-tight">
                        Why Your Brain Loves Journaling
                    </h2>

                    <ul className="mt-10 space-y-6 text-left">
                        <li className="flex items-center gap-3 text-xl font-medium text-gray-700 transition-all duration-700">
                            <Rocket className="w-6 h-6 text-blue-500 hover:scale-110 hover:text-blue-600 transition-all duration-300" />
                            <span>Stress? Send it to orbit.</span>
                        </li>
                        <li className="flex items-center gap-3 text-xl font-medium text-gray-700 transition-all duration-700 delay-100">
                            <Search className="w-6 h-6 text-blue-500 hover:scale-110 hover:text-blue-600 transition-all duration-300" />
                            <span>Find your realest self.</span>
                        </li>
                        <li className="flex items-center gap-3 text-xl font-medium text-gray-700 transition-all duration-700 delay-200">
                            <Smile className="w-6 h-6 text-blue-500 hover:scale-110 hover:text-blue-600 transition-all duration-300" />
                            <span>Mood boost unlocked. ✨</span>
                        </li>
                        <li className="flex items-center gap-3 text-xl font-medium text-gray-700 transition-all duration-700 delay-300">
                            <Palette className="w-6 h-6 text-blue-500 hover:scale-110 hover:text-blue-600 transition-all duration-300" />
                            <span>Creativity unlocked. 🎨</span>
                        </li>
                    </ul>
                </div>
            </section>

        </div>
    );
}
