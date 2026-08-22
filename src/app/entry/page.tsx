'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowRight, Check, Flame, HeartHandshake, LockKeyhole, Settings2, Sparkles } from 'lucide-react';

import JournalPrompt from '@/app/components/JournalPrompt';
import ScanComponent from '@/app/components/ScanComponent';
import UploadIcon from '@/app/components/UploadIcon';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const responseModes = [
    { value: 'reflect', label: 'Reflect it back', description: 'A gentle observation' },
    { value: 'reframe', label: 'Help me reframe', description: 'Another perspective' },
    { value: 'act', label: 'Suggest a step', description: 'One realistic action' },
    { value: 'patterns', label: 'Find a pattern', description: 'Connect recurring themes' },
    { value: 'support', label: 'I need support', description: 'Respond with extra care' },
];

const Entry = () => {
    const reduceMotion = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [mood, setMood] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [supportMode, setSupportMode] = useState('listen');
    const [allowGrowthAnalysis, setAllowGrowthAnalysis] = useState(true);
    const [riskSeverity, setRiskSeverity] = useState<'none' | 'low' | 'moderate' | 'high'>('none');

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
    const selectedResponse = responseModes.find(mode => mode.value === supportMode);

    return (
        <div className="min-h-dvh bg-indigo-50 px-3 pb-12 pt-36 sm:px-4 sm:pt-28">
            <motion.main
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                className="relative z-10 mx-auto max-w-4xl"
            >
                <h1 className="mb-8 text-center font-handwriting text-4xl text-indigo-600 sm:mb-10 md:text-6xl">
                    Dear Diary...
                </h1>

                <Sheet>
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', supportMode === 'listen' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700')}>
                                {supportMode === 'listen' ? <LockKeyhole className="size-5" aria-hidden="true" /> : <Sparkles className="size-5" aria-hidden="true" />}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-950">{supportMode === 'listen' ? 'Private save' : selectedResponse?.label}</p>
                                <p className={cn('truncate text-xs font-medium', supportMode === 'listen' ? 'text-emerald-700' : 'text-indigo-700')}>
                                    {supportMode === 'listen' ? 'No AI' : `Uses AI${allowGrowthAnalysis ? ' · Future insights on' : ''}`}
                                </p>
                            </div>
                        </div>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="shrink-0 rounded-xl"><Settings2 className="mr-2 size-4" aria-hidden="true" /> Journal options</Button>
                        </SheetTrigger>
                    </div>

                    <SheetContent side="right" className="w-full overflow-y-auto bg-white p-0 shadow-xl backdrop-blur-none data-[state=closed]:duration-200 data-[state=open]:duration-200 sm:max-w-md">
                        <SheetHeader className="border-b border-gray-200 px-6 py-5 text-left">
                            <SheetTitle className="text-balance text-xl">Journal options</SheetTitle>
                            <SheetDescription className="text-pretty">Add something to your entry or choose how Echo should respond when you save.</SheetDescription>
                        </SheetHeader>

                        <div className="space-y-8 px-6 py-6">
                            <section aria-labelledby="entry-tools-heading">
                                <h2 id="entry-tools-heading" className="text-sm font-semibold text-gray-950">Add to this entry</h2>
                                <p className="mt-1 text-pretty text-xs leading-5 text-gray-500">These tools stay out of the writing view until you need them.</p>
                                <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-indigo-50 p-4">
                                    <ScanComponent onScanComplete={handleScannedText} />
                                    <JournalPrompt onPromptSelect={(text) => setJournalEntry(prev => prev ? `${prev}\n${text}` : text)} />
                                    <UploadIcon OnImageUpload={setImageUrl} />
                                </div>
                            </section>

                            <section aria-labelledby="response-settings-heading">
                                <h2 id="response-settings-heading" className="text-sm font-semibold text-gray-950">When I save</h2>
                                <fieldset className="mt-3 space-y-2">
                                    <legend className="sr-only">Entry processing</legend>
                                    <label className="block cursor-pointer">
                                        <input type="radio" name="entry-processing" value="private" checked={supportMode === 'listen'} onChange={() => setSupportMode('listen')} className="peer sr-only" />
                                        <span className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-3 peer-checked:border-emerald-600 peer-checked:bg-emerald-50 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-2">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><LockKeyhole className="size-4" aria-hidden="true" /></span>
                                            <span><span className="block text-sm font-semibold text-gray-950">Private save <span className="text-emerald-700">· No AI</span></span><span className="mt-0.5 block text-xs text-gray-600">Store this entry without analysis.</span></span>
                                        </span>
                                    </label>
                                    <label className="block cursor-pointer">
                                        <input type="radio" name="entry-processing" value="ai" checked={supportMode !== 'listen'} onChange={() => setSupportMode(current => current === 'listen' ? 'reflect' : current)} className="peer sr-only" />
                                        <span className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-3 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600 peer-focus-visible:ring-offset-2">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700"><Sparkles className="size-4" aria-hidden="true" /></span>
                                            <span><span className="block text-sm font-semibold text-gray-950">Reflect with Echo <span className="text-indigo-700">· Uses AI</span></span><span className="mt-0.5 block text-xs text-gray-600">Ask for a response in the style you choose.</span></span>
                                        </span>
                                    </label>
                                </fieldset>

                                {supportMode !== 'listen' && (
                                    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }} className="mt-5 border-t border-gray-200 pt-5">
                                        <fieldset>
                                            <legend className="text-sm font-semibold text-gray-900">How should Echo help?</legend>
                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                {responseModes.map((mode) => (
                                                    <label key={mode.value} className="cursor-pointer">
                                                        <input type="radio" name="support-mode" value={mode.value} checked={supportMode === mode.value} onChange={() => setSupportMode(mode.value)} className="peer sr-only" />
                                                        <span className="flex min-h-16 flex-col justify-center rounded-xl border border-gray-200 px-3 py-2 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600 peer-focus-visible:ring-offset-2">
                                                            <span className="text-sm font-semibold text-gray-800">{mode.label}</span><span className="mt-0.5 text-xs text-gray-500">{mode.description}</span>
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                                            <input type="checkbox" checked={allowGrowthAnalysis} onChange={(event) => setAllowGrowthAnalysis(event.target.checked)} className="mt-0.5 size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                            <span><span className="block font-semibold text-gray-900">Use for future insights</span><span className="mt-1 block text-pretty text-xs leading-5 text-gray-600">Optional. Adds this entry to your profile, constellation, and reports.</span></span>
                                        </label>
                                    </motion.div>
                                )}
                            </section>
                        </div>

                        <SheetFooter className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
                            <SheetClose asChild><Button className="w-full bg-indigo-600 hover:bg-indigo-700">Done</Button></SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-[#fffdf8] p-4 shadow-lg sm:p-8 md:p-10">
                    {imageUrl && (
                        <div className="absolute -top-12 -right-4 md:-right-12 z-20">
                            <div className="rotate-3 rounded-xl bg-white p-2 shadow-lg transition-transform duration-200 hover:rotate-0">
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
                        id="journal-entry"
                        aria-label="Journal entry"
                        aria-describedby={error ? 'journal-entry-error' : undefined}
                        aria-invalid={Boolean(error)}
                        className="min-h-[55dvh] w-full resize-none border-none bg-transparent p-3 font-handwriting text-2xl leading-relaxed text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:min-h-[50dvh] sm:p-4 sm:text-3xl md:text-4xl"
                        placeholder="How was your day? What's on your mind?..."
                        value={journalEntry}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJournalEntry(e.target.value)}
                    />

                    {error && <p id="journal-entry-error" role="alert" className="mt-2 text-center text-sm text-red-600">{error}</p>}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleOpen}
                        disabled={loading}
                        className={cn("min-h-12 rounded-full px-10 text-base shadow-md transition-transform duration-200 active:scale-95 sm:px-12 sm:text-lg", supportMode === 'listen' ? "bg-emerald-700 hover:bg-emerald-800" : "bg-indigo-600 hover:bg-indigo-700")}
                    >
                        {loading ? (supportMode === 'listen' ? 'Saving privately…' : 'Reflecting…') : (supportMode === 'listen' ? 'Save privately — No AI' : 'Save & reflect with AI')}
                    </Button>
                </div>
            </motion.main>

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
