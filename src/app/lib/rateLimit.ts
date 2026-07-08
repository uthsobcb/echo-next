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
