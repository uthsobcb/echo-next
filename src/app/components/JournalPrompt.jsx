'use client';
import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";

const journalPrompts = [
    "What is one thing you’re grateful for today and why?",
    "Describe a challenge you faced recently. How did you handle it?",
    "What is something you’re looking forward to this week?",
    "Write about a time you stepped out of your comfort zone. How did it feel?",
    "If you could give your past self one piece of advice, what would it be?",
    "What are three things that made you smile today?",
    "How do you define success? Has your definition changed over time?",
    "What is a goal you want to achieve this year? What steps can you take to get there?",
    "Describe your ideal day from start to finish.",
    "What is something new you learned recently that excited you?",
    "Who has had a big impact on your life? How did they influence you?",
    "What is your biggest dream? What’s stopping you from pursuing it?",
    "Describe a perfect weekend. How would you spend it?",
    "What emotions have you felt most often lately? Why?",
    "What does self-care look like for you? How can you prioritize it?",
    "Write a letter to your future self. What do you hope has changed?",
    "What is one habit you’d like to improve or build?",
    "What is your happiest childhood memory?",
    "If you had unlimited time and resources, what would you do with your life?",
    "What is a book, movie, or song that deeply moved you? Why?",
    "Describe a moment when you felt truly at peace.",
    "What’s one thing you’ve done recently that you’re proud of?",
    "How do you want to be remembered? What legacy do you hope to leave?",
    "Write about a time when you had to make a difficult decision. How did it turn out?",
    "What is something small that brings you joy every day?",
    "What would your perfect morning routine look like?",
    "What’s a limiting belief you hold about yourself? How can you challenge it?",
    "How do you recharge when you’re feeling emotionally drained?",
    "What does happiness mean to you? When was the last time you truly felt it?",
    "What’s one thing you’ve been avoiding? Why?"
];

export default function JournalPromptButton() {
    const [randomPrompt, setRandomPrompt] = useState("");

    const handleClick = () => {
        const randomIndex = Math.floor(Math.random() * journalPrompts.length);
        setRandomPrompt(journalPrompts[randomIndex]);

        setTimeout(() => {
            setRandomPrompt("");
        }, 5000);
    };

    return (
        <div className="flex flex-col items-center justify-center relative mt-5">
            <button
                onClick={handleClick}
                className="p-3 bg-white/80 rounded-full shadow hover:bg-white transition "
            >
                <Bot className="w-6 h-6 text-gray-700" />
            </button>


            {randomPrompt && (
                <div className="absolute top-full mt-4 w-72 p-6 bg-white text-blue-700 text-md px-4 py-3 rounded-lg shadow-lg border border-gray-200">
                    <Sparkles />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-5 h-5 bg-white rotate-45 border-t border-l border-gray-200"></div>

                    <p className="text-center mt-5">{randomPrompt}</p>
                </div>
            )}
            <p>Don't Know What to Write?</p>
        </div>

    );
}
