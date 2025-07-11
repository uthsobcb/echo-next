'use client';

import { useEffect, useState, useRef } from 'react';

export default function BreathingSession() {
    const stages = [
        { label: 'Inhale', duration: 5 },
        { label: 'Hold', duration: 5 },
        { label: 'Exhale', duration: 5 },
        { label: 'Hold', duration: 3 },
    ];

    const [stageIndex, setStageIndex] = useState(0);
    const [stageTimeLeft, setStageTimeLeft] = useState(stages[0].duration);
    const [hasStarted, setHasStarted] = useState(false);

    const backgroundAudio = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setStageTimeLeft((prev) => {
                if (prev > 1) return prev - 1;

                const nextIndex = (stageIndex + 1) % stages.length;
                setStageIndex(nextIndex);
                setStageTimeLeft(stages[nextIndex].duration);
                return stages[nextIndex].duration;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stageIndex]);



    useEffect(() => {
        const audio = backgroundAudio.current;
        if (audio) {
            audio.loop = true;
            audio.volume = 0.6;
            audio.play().catch(() => {
                // Autoplay blocked — handled later on click
            });
        }
    }, []);

    const getCircleFill = () => {
        const currentStage = stages[stageIndex].label;
        const stageProgress = 1 - (stageTimeLeft / stages[stageIndex].duration);

        if (currentStage === 'Inhale') {
            return stageProgress; // fill from 0 → 1
        } else if (currentStage === 'Hold') {
            const prevStage = stages[(stageIndex - 1 + stages.length) % stages.length].label;
            return prevStage === 'Inhale' ? 1 : 0;
        } else if (currentStage === 'Exhale') {
            return 1 - stageProgress; // unfill from 1 → 0
        }

        return 0;
    };

    const progress = getCircleFill();
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const handleStart = () => {
        setHasStarted(true);
        backgroundAudio.current?.play().catch(() => { });
    };

    return (
        <>
            <audio ref={backgroundAudio} src="/meditation.mp3" preload="auto" />

            {!hasStarted ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-purple-200">
                        <h2 className="text-3xl font-extrabold text-purple-700 mb-4 tracking-tight">
                            Welcome to Meditation
                        </h2>

                        <p className="text-gray-700 mb-4 leading-relaxed">
                            It's time to relax and reconnect with yourself. Find a comfortable position, leave your worries behind, and take a deep breath. Inhale positivity, hold it within you, and exhale stress and tension. Let each breath guide you into stillness.
                        </p>

                        <p className="text-purple-500 italic mb-3">“Breathe in calm, breathe out peace.”</p>

                        <p className="text-gray-500 text-sm mb-4">
                            You got this 👍! Echo is here with you — holding space, breathing beside you ☁️.
                        </p>

                        <p className="text-sm text-gray-400 mb-6">
                            Each cycle lasts around 5 seconds. Soothing background music will begin when you start.
                        </p>

                        <button
                            onClick={handleStart}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition shadow-md"
                        >
                            Start Meditation
                        </button>
                    </div>

                </div>
            ) :
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="relative w-72 h-72">
                        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke="#8B5CF6"
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-in-out"
                            />
                        </svg>

                        <img
                            src="/meditate.gif"
                            alt="Breathing Animation"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <p className="mt-4 text-xl text-purple-600 font-medium animate-pulse">
                        {stages[stageIndex].label}
                    </p>

                    <p className="text-lg text-gray-700">
                        {stageTimeLeft}s
                    </p>
                    {/* <audio ref={backgroundAudio} src="/meditation.mp3" /> */}
                </div>
            }
        </>
    );
}
