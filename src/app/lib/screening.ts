// PHQ-9 (depression) and GAD-7 (anxiety) are validated, publicly available
// self-report screening instruments — not diagnostic tools. Scoring and banding
// here follow the standard published cutoffs; this module never talks to the LLM.

export const PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading or watching television",
    "Moving or speaking so slowly that other people could have noticed, or being so fidgety/restless that you have been moving a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way",
] as const;

export const GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen",
] as const;

export type ScreeningType = "phq9" | "gad7";
export type ScreeningSeverity = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";

const QUESTION_COUNT: Record<ScreeningType, number> = { phq9: 9, gad7: 7 };
export const ANSWER_OPTIONS = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
] as const;

export function questionsFor(type: ScreeningType): readonly string[] {
    return type === "phq9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
}

export function validateAnswers(type: ScreeningType, answers: unknown): answers is number[] {
    return (
        Array.isArray(answers) &&
        answers.length === QUESTION_COUNT[type] &&
        answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3)
    );
}

function bandPhq9(total: number): ScreeningSeverity {
    if (total >= 20) return "severe";
    if (total >= 15) return "moderately-severe";
    if (total >= 10) return "moderate";
    if (total >= 5) return "mild";
    return "minimal";
}

function bandGad7(total: number): ScreeningSeverity {
    if (total >= 15) return "severe";
    if (total >= 10) return "moderate";
    if (total >= 5) return "mild";
    return "minimal";
}

export function scoreScreening(
    type: ScreeningType,
    answers: number[]
): { totalScore: number; severity: ScreeningSeverity } {
    const totalScore = answers.reduce((sum, a) => sum + a, 0);
    const severity = type === "phq9" ? bandPhq9(totalScore) : bandGad7(totalScore);
    return { totalScore, severity };
}

// PHQ-9 item 9 (index 8) screens for suicidal/self-harm ideation independent of
// the total score, per standard PHQ-9 administration guidance — a positive answer
// here must feed the same crisis-response path as a journal entry, not just move
// the total a couple of points.
export function phq9SuicideRisk(answers: number[]): { severity: "none" | "moderate" | "high"; indicators: string[] } {
    const item9 = answers[8] ?? 0;
    if (item9 <= 0) return { severity: "none", indicators: [] };
    if (item9 === 1) return { severity: "moderate", indicators: ["passive-ideation"] };
    return { severity: "high", indicators: ["active-ideation"] };
}
