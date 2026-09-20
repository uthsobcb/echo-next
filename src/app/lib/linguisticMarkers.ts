// Deterministic, non-LLM text signal computed from an entry's own plaintext at
// read time (never stored) — a reproducible complement to the single generative
// mood label, and one that doesn't depend on prompt compliance or model quality.
// Word lists are small and intentionally coarse; not a validated LIWC-style tool.

const ABSOLUTIST_WORDS = new Set([
    "always", "never", "nothing", "everything", "everyone", "nobody", "none",
    "completely", "totally", "every", "all", "forever", "impossible", "constantly", "entirely",
]);

const FIRST_PERSON_SINGULAR = new Set(["i", "me", "my", "mine", "myself"]);

const NEGATION_WORDS = new Set([
    "not", "no", "never", "cannot", "nothing", "nobody", "none", "neither", "nor",
]);

export interface LinguisticMarkers {
    wordCount: number;
    absolutistRatio: number;
    firstPersonRatio: number;
    negationRatio: number;
}

export function computeLinguisticMarkers(text: string): LinguisticMarkers {
    const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
    const wordCount = words.length;
    if (wordCount === 0) {
        return { wordCount: 0, absolutistRatio: 0, firstPersonRatio: 0, negationRatio: 0 };
    }

    let absolutist = 0;
    let firstPerson = 0;
    let negation = 0;
    for (const word of words) {
        if (ABSOLUTIST_WORDS.has(word)) absolutist++;
        if (FIRST_PERSON_SINGULAR.has(word)) firstPerson++;
        if (NEGATION_WORDS.has(word) || word.endsWith("n't")) negation++;
    }

    return {
        wordCount,
        absolutistRatio: absolutist / wordCount,
        firstPersonRatio: firstPerson / wordCount,
        negationRatio: negation / wordCount,
    };
}
