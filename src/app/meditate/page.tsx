'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Stage = { label: string; duration: number };

type Technique = {
    id: string;
    name: string;
    description: string;
    stages: Stage[];
    color: string;
};

const TECHNIQUES: Technique[] = [
    {
        id: '4-7-8',
        name: '4-7-8 Relax',
        description: 'Deep relaxation method. Inhale (4s), hold (7s), and exhale (8s).',
        color: '#8B5CF6', // Purple
        stages: [
            { label: 'Inhale', duration: 4 },
            { label: 'Hold', duration: 7 },
            { label: 'Exhale', duration: 8 }
        ]
    },
    {
        id: 'box',
        name: 'Box Breathing',
        description: 'Focus and calm. Inhale (4s), hold (4s), exhale (4s), hold (4s).',
        color: '#3B82F6', // Blue
        stages: [
            { label: 'Inhale', duration: 4 },
            { label: 'Hold', duration: 4 },
            { label: 'Exhale', duration: 4 },
            { label: 'Hold', duration: 4 }
        ]
    },
    {
        id: 'awake',
        name: 'Awake',
        description: 'Energizing rhythm. Inhale (6s), exhale (2s).',
        color: '#F59E0B', // Amber
        stages: [
            { label: 'Inhale', duration: 6 },
            { label: 'Exhale', duration: 2 }
        ]
    }
];

const DURATIONS = [
    { label: '1 Min', value: 60 },
    { label: '3 Mins', value: 180 },
    { label: '5 Mins', value: 300 }
];

export default function BreathingSession() {
    const [selectedTechnique, setSelectedTechnique] = useState<Technique>(TECHNIQUES[0]);
    const [targetDuration, setTargetDuration] = useState<number>(DURATIONS[0].value);

    const [stageIndex, setStageIndex] = useState(0);
    const [stageTimeLeft, setStageTimeLeft] = useState(0);
    const [totalSessionTime, setTotalSessionTime] = useState(0);

    // Session states
    const [isSetup, setIsSetup] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    // Audio
    const [isMuted, setIsMuted] = useState(false);
    const backgroundAudio = useRef<HTMLAudioElement>(null);

    // Timing logic
    useEffect(() => {
        if (isSetup || !hasStarted || hasFinished) return;

        const stageTimer = setInterval(() => {
            setStageTimeLeft((prev) => {
                if (prev > 1) return prev - 1;
                const nextIndex = (stageIndex + 1) % selectedTechnique.stages.length;
                setStageIndex(nextIndex);
                return selectedTechnique.stages[nextIndex].duration;
            });
        }, 1000);

        const totalTimer = setInterval(() => {
            setTotalSessionTime((prev) => {
                const nextTime = prev + 1;
                if (nextTime >= targetDuration) {
                    handleFinish();
                }
                return nextTime;
            });
        }, 1000);

        return () => {
            clearInterval(stageTimer);
            clearInterval(totalTimer);
        };
    }, [isSetup, hasStarted, hasFinished, stageIndex, selectedTechnique, targetDuration]); // Added handleFinish implicitly via hasFinished

    // Audio Mount logic
    useEffect(() => {
        const audio = backgroundAudio.current;
        if (audio) {
            audio.loop = true;
            audio.volume = isMuted ? 0 : 0.6;
        }
    }, [isMuted]);

    const handleStart = () => {
        setIsSetup(false);
        setStageIndex(0);
        setStageTimeLeft(selectedTechnique.stages[0].duration);
        setTotalSessionTime(0);
        setHasStarted(true);
        setHasFinished(false);

        const audio = backgroundAudio.current;
        if (audio) {
            audio.currentTime = 0;
            if (!isMuted) audio.play().catch(() => { });
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsAnimating(true));
        });
    };

    const handleFinish = () => {
        setHasFinished(true);
        setHasStarted(false);
        setIsAnimating(false);
        backgroundAudio.current?.pause();
    };

    const toggleAudio = () => {
        setIsMuted((prev) => {
            const newMuted = !prev;
            if (backgroundAudio.current) {
                backgroundAudio.current.volume = newMuted ? 0 : 0.6;
                if (!newMuted && hasStarted && !hasFinished) {
                    backgroundAudio.current.play().catch(() => { });
                }
            }
            return newMuted;
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate generic animation state based on standard stages
    const radius = 140;
    const circumference = 2 * Math.PI * radius;

    const getCircleState = () => {
        if (!hasStarted || !isAnimating) return { offset: circumference, duration: 0, scale: 1 };

        const currentStage = selectedTechnique.stages[stageIndex].label;
        const currentDuration = selectedTechnique.stages[stageIndex].duration;

        if (currentStage === 'Inhale') {
            return { offset: 0, duration: currentDuration, scale: 1.15 };
        } else if (currentStage === 'Hold') {
            // Determine if holding full or empty based on previous stage
            const prevStage = selectedTechnique.stages[(stageIndex - 1 + selectedTechnique.stages.length) % selectedTechnique.stages.length].label;
            const isHoldingFull = prevStage === 'Inhale';
            return { offset: isHoldingFull ? 0 : circumference, duration: 0, scale: isHoldingFull ? 1.15 : 1 };
        } else if (currentStage === 'Exhale') {
            return { offset: circumference, duration: currentDuration, scale: 1 };
        }
        return { offset: circumference, duration: 0, scale: 1 };
    };

    const { offset: strokeDashoffset, duration: transitionDuration, scale } = getCircleState();

    if (hasFinished) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 transition-colors duration-1000 bg-white`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <h2 className="text-4xl font-bold mb-4" style={{ color: selectedTechnique.color }}>Session Complete</h2>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        Notice how your body feels right now. Carry this stillness with you.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Time Meditated</p>
                        <p className="text-3xl font-semibold" style={{ color: selectedTechnique.color }}>{formatTime(totalSessionTime)}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setIsSetup(true)}
                            className="px-8 py-3 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Change Settings
                        </button>
                        <button
                            onClick={handleStart}
                            className="px-8 py-3 rounded-full font-medium text-white transition shadow-lg hover:opacity-90"
                            style={{ backgroundColor: selectedTechnique.color }}
                        >
                            Meditate Again
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <audio ref={backgroundAudio} src="/meditation.mp3" preload="auto" />

            <AnimatePresence mode="wait">
                {isSetup ? (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAFA]"
                    >
                        <Link href="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200 transition text-gray-600">
                            <ArrowLeft size={24} />
                        </Link>

                        <div className="max-w-md w-full">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Breathe</h1>
                            <p className="text-gray-500 text-center mb-10">Select a technique to find your center.</p>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Technique</h3>
                                    <div className="space-y-3">
                                        {TECHNIQUES.map((tech) => (
                                            <button
                                                key={tech.id}
                                                onClick={() => setSelectedTechnique(tech)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedTechnique.id === tech.id ? 'bg-white shadow-sm' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}
                                                style={{ borderColor: selectedTechnique.id === tech.id ? tech.color : 'transparent' }}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-gray-800">{tech.name}</span>
                                                    {selectedTechnique.id === tech.id && (
                                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }} />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{tech.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Duration</h3>
                                    <div className="flex gap-3">
                                        {DURATIONS.map((dur) => (
                                            <button
                                                key={dur.value}
                                                onClick={() => setTargetDuration(dur.value)}
                                                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${targetDuration === dur.value ? 'bg-white shadow-sm' : 'border-transparent bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                                style={{ borderColor: targetDuration === dur.value ? selectedTechnique.color : 'transparent', color: targetDuration === dur.value ? selectedTechnique.color : undefined }}
                                            >
                                                {dur.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                style={{ backgroundColor: selectedTechnique.color }}
                            >
                                Begin Session
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-slate-50 transition-colors duration-1000"
                    >
                        {/* Immersive Background Blur - Optional subtle tint based on technique */}
                        <div
                            className="absolute inset-0 opacity-5 pointer-events-none transition-colors duration-3000"
                            style={{ backgroundColor: selectedTechnique.color }}
                        />

                        {/* Top Controls */}
                        <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-10 w-full max-w-2xl mx-auto">
                            <button
                                onClick={handleFinish}
                                className="text-gray-400 hover:text-gray-700 transition"
                            >
                                End Early
                            </button>

                            <div className="text-center">
                                <span className="text-gray-400 font-medium font-mono">
                                    {formatTime(targetDuration - totalSessionTime)}
                                </span>
                            </div>

                            <button
                                onClick={toggleAudio}
                                className="text-gray-400 hover:text-gray-700 transition p-2 rounded-full hover:bg-gray-200/50"
                            >
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                        </div>

                        {/* Central Animation */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            <motion.div
                                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
                                animate={{ scale }}
                                transition={{ duration: transitionDuration, ease: "easeInOut" }}
                            >
                                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r={radius}
                                        stroke="#F3F4F6"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r={radius}
                                        stroke={selectedTechnique.color}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset }}
                                        transition={{ duration: transitionDuration, ease: "easeInOut" }}
                                        strokeLinecap="round"
                                        className="drop-shadow-lg"
                                    />
                                </svg>

                                {/* Inner Content area - can place a very subtle glow or image here */}
                                <div className="absolute inset-4 rounded-full flex items-center justify-center pointer-events-none">
                                    <img
                                        src="/meditate.gif"
                                        alt="Breathing Animation"
                                        className="w-48 h-48 object-contain opacity-80 mix-blend-multiply"
                                    />
                                </div>
                            </motion.div>

                            {/* Prompts */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20 mix-blend-difference mt-64 sm:mt-72">
                                <motion.p
                                    key={selectedTechnique.stages[stageIndex].label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-2xl sm:text-3xl font-medium tracking-wide"
                                    style={{ color: selectedTechnique.color }}
                                >
                                    {selectedTechnique.stages[stageIndex].label}
                                </motion.p>
                                <p className="text-gray-400 mt-2 font-mono text-lg">
                                    {stageTimeLeft}s
                                </p>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
