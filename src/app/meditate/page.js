'use client';

import { useEffect, useState, useRef } from 'react';

export default function BreathingSession() {
    const stages = [
        { label: 'Inhale', duration: 4 },
        { label: 'Hold', duration: 4 },
        { label: 'Exhale', duration: 4 },
        { label: 'Hold', duration: 2 },
    ];

    const [stageIndex, setStageIndex] = useState(0);
    const [stageTimeLeft, setStageTimeLeft] = useState(stages[0].duration);

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

    return (
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
            <audio ref={backgroundAudio} src="/meditation.mp3" />
        </div>
    );
}
