'use client';

import { useEffect, useState } from 'react';

export default function BreathingSession() {
    const totalSessionTime = 5 * 60; // in seconds (e.g. 5 mins)
    const [sessionTimeLeft, setSessionTimeLeft] = useState(totalSessionTime);

    const stages = [
        { label: 'Inhale', duration: 4 },
        { label: 'Hold', duration: 2 },
        { label: 'Exhale', duration: 4 },
        { label: 'Hold', duration: 2 },
    ];

    const [stageIndex, setStageIndex] = useState(0);
    const [stageTimeLeft, setStageTimeLeft] = useState(stages[0].duration);

    // Timer for total session
    useEffect(() => {
        const sessionTimer = setInterval(() => {
            setSessionTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(sessionTimer);
    }, []);

    // Timer for current stage
    useEffect(() => {
        if (sessionTimeLeft === 0) return;

        const stageTimer = setInterval(() => {
            setStageTimeLeft((prev) => {
                if (prev > 1) return prev - 1;

                // Move to next stage
                const nextIndex = (stageIndex + 1) % stages.length;
                setStageIndex(nextIndex);
                setStageTimeLeft(stages[nextIndex].duration);
                return stages[nextIndex].duration;
            });
        }, 1000);

        return () => clearInterval(stageTimer);
    }, [stageIndex, sessionTimeLeft]);

    const minutes = Math.floor(sessionTimeLeft / 60);
    const seconds = sessionTimeLeft % 60;

    const progress = 1 - stageTimeLeft / stages[stageIndex].duration;
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    if (sessionTimeLeft === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <p className="text-3xl font-bold text-purple-600">Session Complete!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="relative w-64 h-64">
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
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                <img
                    src="/meditate.gif"
                    alt="Breathing Animation"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Current Stage Label */}
            <p className="mt-4 text-xl text-purple-600 font-medium animate-pulse">
                {stages[stageIndex].label}
            </p>

            {/* Per-stage countdown */}
            <p className="text-lg text-gray-700">
                {stageTimeLeft}s
            </p>

            {/* Total session timer */}
            <p className="mt-2 text-md font-semibold text-gray-500">
                {minutes}:{seconds.toString().padStart(2, '0')} left
            </p>
        </div>
    );
}
