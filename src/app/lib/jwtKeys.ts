import { jwtVerify, type JWTPayload } from "jose";

const encoder = new TextEncoder();

/**
 * Verification secrets, newest first.
 *
 * LEGACY_JWT_SECRET is what makes rotating JWT_SECRET survivable: tokens are
 * always signed with the current secret, but cookies issued under the previous
 * one keep verifying until they expire. Set it to the outgoing secret when you
 * rotate, then remove it once the longest token lifetime (30d) has elapsed —
 * leaving it set indefinitely means the old secret never actually retires.
 *
 * NEXTAUTH_SECRET is read only as a fallback for deployments predating the
 * rename to JWT_SECRET.
 */
function verificationSecrets(): string[] {
    const current = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const legacy = process.env.LEGACY_JWT_SECRET;
    return [current, legacy].filter((s): s is string => typeof s === "string" && s !== "");
}

/** The secret new tokens are signed with. Never the legacy one. */
export function signingKey(): Uint8Array {
    const current = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!current) {
        throw new Error("Please define the JWT_SECRET environment variable inside .env.local");
    }
    return encoder.encode(current);
}

/**
 * Verify a token against the current secret, then the legacy one. Returns null
 * if neither matches, so callers treat rotation failures the same as any other
 * invalid token.
 */
export async function verifyWithRotation(token: string): Promise<JWTPayload | null> {
    for (const secret of verificationSecrets()) {
        try {
            const { payload } = await jwtVerify(token, encoder.encode(secret));
            return payload;
        } catch {
            // Wrong key, expired, or tampered — fall through to the next secret.
        }
    }
    return null;
}
