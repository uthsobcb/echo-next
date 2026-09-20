"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardCheck, HeartPulse } from "lucide-react";
import {
    PHQ9_QUESTIONS,
    GAD7_QUESTIONS,
    ANSWER_OPTIONS,
    ScreeningType,
} from "@/app/lib/screening";

const SEVERITY_COLOR: Record<string, string> = {
    minimal: "bg-green-50 text-green-700 border-green-200",
    mild: "bg-yellow-50 text-yellow-700 border-yellow-200",
    moderate: "bg-orange-50 text-orange-700 border-orange-200",
    "moderately-severe": "bg-red-50 text-red-700 border-red-200",
    severe: "bg-red-100 text-red-800 border-red-300",
};

interface HistoryItem {
    _id: string;
    type: ScreeningType;
    totalScore: number;
    severity: string;
    createdAt: string;
}

export default function ScreeningPage() {
    const [type, setType] = useState<ScreeningType>("phq9");
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [result, setResult] = useState<{ totalScore: number; severity: string } | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const questions = type === "phq9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;

    useEffect(() => {
        setAnswers(new Array(questions.length).fill(null));
        setResult(null);
        setError("");
    }, [type]);

    useEffect(() => {
        axios.get("/api/screening").then(res => setHistory(res.data.history || [])).catch(() => {});
    }, [result]);

    const allAnswered = answers.every(a => a !== null);

    async function handleSubmit() {
        if (!allAnswered) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await axios.post("/api/screening", { type, answers });
            setResult({ totalScore: res.data.totalScore, severity: res.data.severity });
        } catch {
            setError("Could not submit the check-in. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 mb-1">
                    <HeartPulse className="text-indigo-600 w-9 h-9" />
                    Wellbeing Check-in
                </h1>
                <p className="text-gray-500 font-medium mb-8">
                    Optional, validated self-report questionnaires (PHQ-9 / GAD-7). This is a screening
                    signal, not a diagnosis — it does not replace a conversation with a professional.
                </p>

                <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 flex gap-1 w-fit mb-8">
                    {(["phq9", "gad7"] as ScreeningType[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                type === t ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            {t === "phq9" ? "PHQ-9 (depression)" : "GAD-7 (anxiety)"}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        Over the last 2 weeks, how often have you been bothered by:
                    </p>
                    {questions.map((q, i) => (
                        <div key={i} className="border-b border-gray-50 pb-5 last:border-0">
                            <p className="font-semibold text-gray-800 mb-3">{i + 1}. {q}</p>
                            <div className="flex flex-wrap gap-2">
                                {ANSWER_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setAnswers(a => a.map((v, idx) => (idx === i ? opt.value : v)))}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                            answers[i] === opt.value
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || submitting}
                        className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                    >
                        {submitting ? "Submitting…" : "Submit check-in"}
                    </button>

                    {result && (
                        <div className={`rounded-2xl border p-5 ${SEVERITY_COLOR[result.severity] ?? ""}`}>
                            <p className="font-bold">Score: {result.totalScore}</p>
                            <p className="capitalize">{result.severity.replace("-", " ")}</p>
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ClipboardCheck className="text-indigo-600" />
                            History
                        </h3>
                        <div className="space-y-2">
                            {history.map(h => (
                                <div key={h._id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</span>
                                    <span className="font-bold uppercase text-gray-400 text-xs">{h.type}</span>
                                    <span className="font-bold">{h.totalScore}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${SEVERITY_COLOR[h.severity] ?? ""}`}>
                                        {h.severity.replace("-", " ")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
