'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

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
            });

            setMood(response.data.mood);
            setComment(response.data.comment);
            setScore(response.data.score);
            toast.success('Successfully Stored!');
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
                    <JournalPrompt />
                    <UploadIcon OnImageUpload={setImageUrl} />
                </div>

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
                        className="w-full h-[60vh] bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-handwriting text-3xl md:text-4xl leading-relaxed resize-none p-4"
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
                        {loading ? 'Analyzing...' : 'Save Entry'}
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center mb-4">
                            {loading ? 'Analyzing Mood...' : 'Mood Analysis'}
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
                                <p className="text-gray-500 animate-pulse">Reading your thoughts...</p>
                            </div>
                        ) : (
                            <div className="space-y-6 w-full">
                                <div className="flex justify-center">
                                    <Image
                                        src={numericScore < 0 ? "/assets/echo-sad.png" : "/assets/loved-echo.png"}
                                        alt="Mood Avatar"
                                        width={120}
                                        height={120}
                                        className="object-contain drop-shadow-lg"
                                    />
                                </div>

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

                                <Link
                                    href="/chat"
                                    className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                                >
                                    Talk to Echo about this? →
                                </Link>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Entry;
