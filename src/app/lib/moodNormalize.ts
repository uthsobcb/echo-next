// Normalization for the /api/mood LLM response — extracted out of the route
// handler so it's independently testable/fuzzable, not because anything else
// calls it yet.

export const RISK_INDICATOR_TAGS = [
    "hopelessness",
    "worthlessness",
    "passive-ideation",
    "active-ideation",
    "self-harm-urge",
    "plan-or-method",
    "previous-attempt-mentioned",
    "substance-use-crisis",
] as const;

export interface NormalizedRisk {
    severity: "none" | "low" | "moderate" | "high";
    indicators: string[];
}

export function normalizeRisk(raw: any): NormalizedRisk {
    const severity = ["none", "low", "moderate", "high"].includes(raw?.severity) ? raw.severity : "none";
    const indicators = Array.isArray(raw?.indicators)
        ? raw.indicators.filter((tag: unknown) => (RISK_INDICATOR_TAGS as readonly string[]).includes(tag as string))
        : [];
    return { severity, indicators };
}

export function normalizeStatus(status: unknown): "pending" | "in-progress" | "completed" {
    const s = typeof status === "string" ? status.toLowerCase().trim() : "";
    if (s === "in progress" || s === "in_progress") return "in-progress";
    if (s === "completed" || s === "done") return "completed";
    return "pending";
}

export function extractJson(response: string): string {
    const start = response.indexOf("{");
    const end = response.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
        return response.slice(start, end + 1);
    }
    return response.replace(/```json|```/g, "").trim();
}
