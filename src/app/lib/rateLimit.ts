import { NextRequest } from "next/server";
import RateLimitAttemptModel from "@/app/models/RateLimitAttempt";

export function getClientIp(req: NextRequest): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Sliding-window rate limit backed by Mongo (TTL-indexed), so it holds across
 * server restarts/instances without adding a new datastore dependency.
 * Returns true if the request is allowed, false if the limit was hit.
 */
export async function checkRateLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - windowSeconds * 1000);
    const count = await RateLimitAttemptModel.countDocuments({ key, createdAt: { $gte: windowStart } });
    if (count >= maxAttempts) return false;

    await RateLimitAttemptModel.create({ key, expiresAt: new Date(Date.now() + windowSeconds * 1000) });
    return true;
}

/**
 * Per-user daily cap on the AI-backed endpoints. Without it, one account can
 * drain a deployment's whole inference budget. Set AI_DAILY_LIMIT to override
 * every route's default, or to 0 to disable the cap entirely (self-hosters
 * running local inference usually want that). Invalid values fall back to the
 * route default rather than silently disabling the cap.
 */
export function resolveAiLimit(raw: string | undefined, routeDefault: number): number {
    const parsed = Number(raw);
    return raw === undefined || raw.trim() === "" || Number.isNaN(parsed) ? routeDefault : parsed;
}

export async function checkAiQuota(userId: string, route: string, routeDefault: number): Promise<boolean> {
    const limit = resolveAiLimit(process.env.AI_DAILY_LIMIT, routeDefault);
    if (limit <= 0) return true;
    return checkRateLimit(`ai:${route}:${userId}`, limit, 24 * 60 * 60);
}
