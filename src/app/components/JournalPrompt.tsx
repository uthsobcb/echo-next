'use client';
import { useState } from "react";
import { Bot, Sparkles, X, ArrowRight } from "lucide-react";

const journalPrompts = [
    "What is one thing you're grateful for today and why?",
    "Describe a challenge you faced recently. How did you handle it?",
    "What is something you're looking forward to this week?",
    "Write about a time you stepped out of your comfort zone. How did it feel?",
    "If you could give your past self one piece of advice, what would it be?",
    "What are three things that made you smile today?",
    "How do you define success? Has your definition changed over time?",
    "What is a goal you want to achieve this year? What steps can you take to get there?",
    "Describe your ideal day from start to finish.",
    "What is something new you learned recently that excited you?",
    "Who has had a big impact on your life? How did they influence you?",
    "What is your biggest dream? What's stopping you from pursuing it?",
    "Describe a perfect weekend. How would you spend it?",
    "What emotions have you felt most often lately? Why?",
    "What does self-care look like for you? How can you prioritize it?",
    "Write a letter to your future self. What do you hope has changed?",
    "What is one habit you'd like to improve or build?",
    "What is your happiest childhood memory?",
    "If you had unlimited time and resources, what would you do with your life?",
    "What is a book, movie, or song that deeply moved you? Why?",
    "Describe a moment when you felt truly at peace.",
    "What's one thing you've done recently that you're proud of?",
    "How do you want to be remembered? What legacy do you hope to leave?",
    "Write about a time when you had to make a difficult decision. How did it turn out?",
    "What is something small that brings you joy every day?",
    "What would your perfect morning routine look like?",
    "What's a limiting belief you hold about yourself? How can you challenge it?",
    "How do you recharge when you're feeling emotionally drained?",
    "What does happiness mean to you? When was the last time you truly felt it?",
    "What's one thing you've been avoiding? Why?"
];

interface JournalPromptProps {
    onPromptSelect?: (text: string) => void;
}

export default function JournalPrompt({ onPromptSelect }: JournalPromptProps) {
    const [randomPrompt, setRandomPrompt] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        const randomIndex = Math.floor(Math.random() * journalPrompts.length);
        setRandomPrompt(journalPrompts[randomIndex]);
        setIsOpen(true);
    };

    const handleUsePrompt = () => {
        if (onPromptSelect && randomPrompt) {
            onPromptSelect(randomPrompt);
        }
        setIsOpen(false);
        setRandomPrompt("");
    };

    const handleClose = () => {
        setIsOpen(false);
        setRandomPrompt("");
    };

    return (
        <div className="relative flex min-w-0 flex-col items-center text-center">
            <button
                type="button"
                onClick={handleClick}
                className="flex size-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm transition-transform duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:size-14"
                aria-label="Get a journal prompt"
            >
                <Bot className="size-5 text-gray-700 sm:size-6" aria-hidden="true" />
            </button>
            <p className="mt-2 text-pretty text-xs font-medium leading-4 text-gray-700 sm:text-sm">Need a prompt?</p>

            {isOpen && randomPrompt && (
                <div className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 overflow-hidden rounded-2xl border border-indigo-100 bg-white text-left shadow-xl sm:absolute sm:inset-x-auto sm:left-1/2 sm:top-16 sm:w-80 sm:-translate-x-1/2 sm:translate-y-0" role="dialog" aria-modal="true" aria-label="Journal prompt">
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            Prompt idea
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                            aria-label="Close prompt"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                    <p className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">
                        {randomPrompt}
                    </p>
                    <div className="border-t border-gray-100 flex">
                        <button
                            type="button"
                            onClick={handleClick}
                            className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition font-medium"
                        >
                            Another one
                        </button>
                        {onPromptSelect && (
                            <button
                                type="button"
                                onClick={handleUsePrompt}
                                className="flex-1 py-2.5 text-xs text-indigo-600 hover:bg-indigo-50 transition font-bold flex items-center justify-center gap-1 border-l border-gray-100"
                            >
                                Use this <ArrowRight className="size-3" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
