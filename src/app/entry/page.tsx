'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowRight, Check, Flame, HeartHandshake, LockKeyhole, Sparkles } from 'lucide-react';

import JournalPrompt from '@/app/components/JournalPrompt';
import ScanComponent from '@/app/components/ScanComponent';
import UploadIcon from '@/app/components/UploadIcon';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Entry = () => {
    const pathname = usePathname();
    const isCapture = pathname.startsWith('/ui-capture/');
    const isReflectionCapture = pathname === '/ui-capture/reflection';
    const [open, setOpen] = useState(isReflectionCapture);
    const [journalEntry, setJournalEntry] = useState(isCapture ? 'Today felt heavy, but writing this down helped me slow the moment down.' : '');
    const [mood, setMood] = useState<string | null>(isReflectionCapture ? 'overwhelmed' : null);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState(isReflectionCapture ? -2 : 0);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string | null>(isReflectionCapture ? 'It sounds like today asked a lot from you. What would feel like a kind, realistic way to give yourself a little space tonight?' : null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [supportMode, setSupportMode] = useState('reflect');
    const [allowGrowthAnalysis, setAllowGrowthAnalysis] = useState(true);
    const [riskSeverity, setRiskSeverity] = useState<'none' | 'low' | 'moderate' | 'high'>('none');

    const [streakData, setStreakData] = useState<any>(isReflectionCapture ? { streak: 4, totalXp: 120, milestoneReached: false, milestoneMessage: null } : null);
    const [todoSuggestions, setTodoSuggestions] = useState<any[]>(isReflectionCapture ? [{ todo: 'Give yourself ten quiet minutes before the next task.' }] : []);

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

            const { mood, comment, score, streakData, todo, risk } = response.data;
            setMood(mood);
            setComment(comment);
            setScore(score);
            setStreakData(streakData);
            setTodoSuggestions(todo || []);
            setRiskSeverity(risk?.severity || 'none');

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
                <DialogContent className="max-h-[90dvh] overflow-y-auto p-0 sm:max-w-lg">
                    <DialogHeader className="border-b border-gray-100 px-6 py-5 text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                                {supportMode === 'listen' ? <LockKeyhole className="size-5" /> : <Sparkles className="size-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-balance text-xl font-semibold text-gray-950">
                                    {loading ? (supportMode === 'listen' ? 'Saving privately' : 'Making space for this') : (supportMode === 'listen' ? 'Saved without analysis' : 'A moment of reflection')}
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-pretty">
                                    {supportMode === 'listen' ? 'Echo is keeping this entry out of AI analysis and future patterns.' : 'This is a tentative reflection, not a definition of how you feel.'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {loading ? (
                        <div className="space-y-5 px-6 py-8" aria-busy="true">
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-2xl bg-gray-100" />
                                <div className="flex-1 space-y-2"><div className="h-4 w-2/3 rounded bg-gray-100" /><div className="h-3 w-1/2 rounded bg-gray-100" /></div>
                            </div>
                            <div className="h-28 rounded-xl bg-gray-100" />
                            <p className="text-center text-sm text-gray-500">{supportMode === 'listen' ? 'Saving your entry…' : 'Responding in the way you chose…'}</p>
                        </div>
                    ) : (
                        <div className="space-y-5 px-6 py-6">
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                                    <Image
                                        src={numericScore < 0 ? "/assets/echo-sad.png" : "/assets/loved-echo.png"}
                                        alt="Echo character"
                                        width={72}
                                        height={72}
                                        className="size-[72px] object-contain"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase text-indigo-700">{supportMode.replace('-', ' ')} mode</p>
                                    {supportMode === 'listen' ? (
                                        <p className="mt-1 text-balance text-lg font-semibold text-gray-950">Your words are saved. No interpretation added.</p>
                                    ) : mood && (
                                        <p className="mt-1 text-balance text-lg font-semibold text-gray-950">Echo noticed a <span className="text-indigo-700">{mood.toLowerCase()}</span> tone.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                                <div className="flex gap-3">
                                    <HeartHandshake className="mt-0.5 size-5 shrink-0 text-indigo-700" />
                                    <p className="text-pretty text-sm leading-6 text-gray-700">{comment || 'Your entry has been saved.'}</p>
                                </div>
                            </div>

                            {(riskSeverity === 'moderate' || riskSeverity === 'high') && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                                    <p className="text-sm font-semibold text-amber-950">You deserve human support, too.</p>
                                    <p className="mt-1 text-pretty text-sm leading-6 text-amber-900">Consider contacting someone you trust or a qualified local professional. If you may be in immediate danger, contact local emergency services now.</p>
                                </div>
                            )}

                            {todoSuggestions.length > 0 && (
                                <div className="rounded-xl border border-gray-200 p-4 text-left">
                                    <p className="text-sm font-semibold text-gray-900">Small next steps Echo noticed</p>
                                    <ul className="mt-3 space-y-3">
                                        {todoSuggestions.slice(0, 2).map((todo, index) => (
                                            <li key={index} className="flex items-start gap-2 text-pretty text-sm text-gray-600">
                                                <Check className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                                                {todo.todo || todo.task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {streakData && (
                                <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                                    <div className="flex items-center gap-3"><Flame className="size-5 text-orange-600" /><div><p className="text-sm font-semibold text-gray-900">{streakData.streak} {streakData.streak === 1 ? 'day' : 'days'} of showing up</p><p className="text-xs text-gray-500">A missed day never erases the reflection.</p></div></div>
                                    <span className="text-sm font-semibold tabular-nums text-orange-700">+10 XP</span>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && (
                        <DialogFooter className="gap-2 border-t border-gray-100 px-6 py-5 sm:space-x-0">
                            <Button variant="outline" onClick={() => setOpen(false)}>Back to journal</Button>
                            <Button asChild className="bg-none bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-sm">
                                <Link href="/growth">Open growth workspace <ArrowRight className="ml-2 size-4" /></Link>
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Entry;
