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
        <div className="relative flex flex-col items-center justify-center mt-5">
            <button
                onClick={handleClick}
                className="p-2 bg-white/80 rounded-full shadow hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Get a journal prompt"
            >
                <Bot className="w-6 h-6 text-gray-700" />
            </button>
            <p className="mt-2 text-sm text-gray-500">Don't Know What to Write?</p>

            {isOpen && randomPrompt && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            Prompt idea
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                            aria-label="Close prompt"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">
                        {randomPrompt}
                    </p>
                    <div className="border-t border-gray-100 flex">
                        <button
                            onClick={handleClick}
                            className="flex-1 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition font-medium"
                        >
                            Another one
                        </button>
                        {onPromptSelect && (
                            <button
                                onClick={handleUsePrompt}
                                className="flex-1 py-2.5 text-xs text-indigo-600 hover:bg-indigo-50 transition font-bold flex items-center justify-center gap-1 border-l border-gray-100"
                            >
                                Use this <ArrowRight className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
