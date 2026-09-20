// ponytail: a rolling per-user baseline z-score, not a real time-series model —
// upgrade to EWMA/STL decomposition if this produces too many false positives
// once there's real usage data to tune against.

export type TrendDirection = "declining" | "improving" | "stable";

export interface MoodTrendResult {
    baselineMean: number;
    baselineStdDev: number;
    recentMean: number | null;
    zScore: number | null;
    direction: TrendDirection;
    alert: boolean;
}

const INSUFFICIENT_DATA: MoodTrendResult = {
    baselineMean: 0,
    baselineStdDev: 0,
    recentMean: null,
    zScore: null,
    direction: "stable",
    alert: false,
};

/**
 * Compares the mean of the last `recentWindow` mood scores (chronological order)
 * against the mean/stddev of the scores before them — the user's own baseline,
 * not a population norm. Flags a decline only when it's a real outlier relative
 * to how much that specific user's mood normally varies.
 */
export function detectMoodTrend(scores: number[], recentWindow = 5): MoodTrendResult {
    if (scores.length < recentWindow + 3) return INSUFFICIENT_DATA;

    const baseline = scores.slice(0, -recentWindow);
    const recent = scores.slice(-recentWindow);

    const baselineMean = baseline.reduce((s, v) => s + v, 0) / baseline.length;
    const variance = baseline.reduce((s, v) => s + (v - baselineMean) ** 2, 0) / baseline.length;
    const baselineStdDev = Math.sqrt(variance);

    const recentMean = recent.reduce((s, v) => s + v, 0) / recent.length;
    // Floor the divisor so a perfectly flat baseline (stddev 0) doesn't force
    // every zScore to 0 regardless of how far the recent window has moved.
    const zScore = (recentMean - baselineMean) / Math.max(baselineStdDev, 0.5);

    const direction: TrendDirection = zScore <= -1 ? "declining" : zScore >= 1 ? "improving" : "stable";

    return {
        baselineMean,
        baselineStdDev,
        recentMean,
        zScore,
        direction,
        alert: zScore <= -1.5,
    };
}
