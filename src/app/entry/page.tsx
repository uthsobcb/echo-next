'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Flame } from 'lucide-react';

import JournalPrompt from '@/app/components/JournalPrompt';
import ScanComponent from '@/app/components/ScanComponent';
import UploadIcon from '@/app/components/UploadIcon';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Entry = () => {
    const [open, setOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [supportMode, setSupportMode] = useState('reflect');
    const [allowGrowthAnalysis, setAllowGrowthAnalysis] = useState(true);

    const [streakData, setStreakData] = useState<any>(null);
    const [todoSuggestions, setTodoSuggestions] = useState<any[]>([]);

    const handleScannedText = (text: string) => {
        setJournalEntry((prev) => prev + "\n" + text);
    };

    const handleOpen = async () => {
        if (!journalEntry.trim()) {
            setError('Please write something before submitting.');
            toast.info('Please write something before submitting.');
            return;
        }

        setOpen(true);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/mood', {
                content: journalEntry,
                imgUrl: imageUrl,
                supportMode,
                allowGrowthAnalysis: supportMode === 'listen' ? false : allowGrowthAnalysis,
            });

            const { mood, comment, score, streakData, todo } = response.data;
            setMood(mood);
            setComment(comment);
            setScore(score);
            setStreakData(streakData);
            setTodoSuggestions(todo || []);

            toast.success(`Entry saved! +10 XP earned.`);
            if (streakData?.milestoneReached) {
                toast.success(`Milestone! ${streakData.streak} days streak celebration!`, {
                    description: streakData.milestoneMessage
                });
            }
        } catch (err: unknown) {
            let errorMessage = 'An error occurred while analyzing your mood.';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const numericScore = !isNaN(score) && typeof score === 'number' ? score : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="text-4xl md:text-6xl font-handwriting text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-12">
                    Dear Diary...
                </h1>

                <div className="flex justify-center gap-6 mb-8">
                    <ScanComponent onScanComplete={handleScannedText} />
                    <JournalPrompt onPromptSelect={(text) => setJournalEntry(prev => prev ? `${prev}\n${text}` : text)} />
                    <UploadIcon OnImageUpload={setImageUrl} />
                </div>

                <fieldset className="mb-6 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                    <legend className="px-2 text-sm font-semibold text-gray-900">How should Echo respond?</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                            { value: 'listen', label: 'Just listen' },
                            { value: 'reflect', label: 'Reflect' },
                            { value: 'reframe', label: 'Reframe' },
                            { value: 'act', label: 'Small step' },
                            { value: 'patterns', label: 'Find pattern' },
                            { value: 'support', label: 'Need support' },
                        ].map((mode) => (
                            <label key={mode.value} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="support-mode"
                                    value={mode.value}
                                    checked={supportMode === mode.value}
                                    onChange={() => setSupportMode(mode.value)}
                                    className="peer sr-only"
                                />
                                <span className="flex min-h-10 items-center justify-center rounded-lg border border-gray-200 px-3 text-center text-sm font-medium text-gray-600 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
                                    {mode.label}
                                </span>
                            </label>
                        ))}
                    </div>
                    <label className="mt-4 flex items-start gap-3 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={supportMode !== 'listen' && allowGrowthAnalysis}
                            disabled={supportMode === 'listen'}
                            onChange={(event) => setAllowGrowthAnalysis(event.target.checked)}
                            className="mt-0.5 size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-pretty">Allow this entry to inform my future profile, constellation, and reports. “Just listen” entries always stay out.</span>
                    </label>
                </fieldset>

                <div className="relative bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6 md:p-10">
                    {imageUrl && (
                        <div className="absolute -top-12 -right-4 md:-right-12 z-20">
                            <div className="bg-white p-2 rounded-xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <Image
                                    src={imageUrl}
                                    width={120}
                                    height={120}
                                    alt="Uploaded image"
                                    className="rounded-lg object-cover"
                                    unoptimized
                                />
                                <p className="text-center text-xs text-gray-500 mt-2 font-handwriting">Memory</p>
                            </div>
                        </div>
                    )}

                    <textarea
                        className="w-full h-[45vh] md:h-[55vh] bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-handwriting text-3xl md:text-4xl leading-relaxed resize-none p-4"
                        placeholder="How was your day? What's on your mind?..."
                        value={journalEntry}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJournalEntry(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleOpen}
                        disabled={loading}
                        className="px-12 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        {loading ? (supportMode === 'listen' ? 'Saving...' : 'Reflecting...') : 'Save Entry'}
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center mb-4">
                            {loading ? (supportMode === 'listen' ? 'Saving privately...' : 'Reflecting...') : (supportMode === 'listen' ? 'Entry saved' : 'Your reflection')}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-4">
                        {loading ? (
                            <div className="space-y-4">
                                <Image
                                    src="/assets/loading.png"
                                    alt="Loading"
                                    width={120}
                                    height={120}
                                    className="animate-bounce object-contain"
                                />
                                <p className="text-gray-500 animate-pulse">{supportMode === 'listen' ? 'Keeping this one private...' : 'Considering your chosen support mode...'}</p>
                            </div>
                        ) : (
                            <div className="space-y-6 w-full">
                                <div className="flex justify-center relative">
                                    <Image
                                        src={numericScore < 0 ? "/assets/echo-sad.png" : "/assets/loved-echo.png"}
                                        alt="Mood Avatar"
                                        width={120}
                                        height={120}
                                        className="object-contain drop-shadow-lg"
                                    />
                                    {streakData && (
                                        <div className="absolute -top-4 -right-2 bg-orange-500 text-white rounded-full p-2 shadow-lg animate-bounce duration-1000">
                                            <Flame className="w-6 h-6 fill-current" />
                                        </div>
                                    )}
                                </div>

                                {streakData && (
                                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-4 text-white shadow-md">
                                        <p className="text-xs font-black uppercase tracking-widest opacity-80">Current Streak</p>
                                        <h4 className="text-3xl font-black flex items-center gap-2">{streakData.streak} Days <Flame className="w-7 h-7 fill-current" /></h4>
                                        {streakData.milestoneMessage && (
                                            <p className="text-sm font-bold mt-1 bg-white/20 px-2 py-0.5 rounded-lg inline-block italic">
                                                {streakData.milestoneMessage}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {mood && (
                                        <h3 className="text-xl font-medium text-gray-800">
                                            Echo thinks you're feeling <span className="text-indigo-600 font-bold">{mood}</span>
                                        </h3>
                                    )}
                                    <p className="text-gray-600 text-sm leading-relaxed p-4 bg-gray-50 rounded-xl">
                                        "{comment || 'Echo is analyzing...'}"
                                    </p>
                                </div>

                                {todoSuggestions.length > 0 && (
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-left">
                                        <p className="text-xs font-bold text-blue-600 uppercase mb-2">Echo's Recommendations</p>
                                        <ul className="space-y-2">
                                            {todoSuggestions.slice(0, 2).map((t, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 shrink-0" />
                                                    {t.task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Link
                                        href="/insights"
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                                    >
                                        View Insights
                                    </Link>
                                    <Link
                                        href="/"
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 transition-all"
                                    >
                                        Done
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Entry;
