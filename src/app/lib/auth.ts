import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!secret) {
    throw new Error("Please define the JWT_SECRET environment variable inside .env.local");
}

const JWT_SECRET = new TextEncoder().encode(secret);
const TOKEN_NAME = "auth_token";

export interface Session {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
        subscription?: string;
        badge?: string[];
    };
    accessToken: string;
}

/**
 * Create a signed JWT token
 */
export async function createToken(payload: any, expiresIn = "30d") {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(JWT_SECRET);
    return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Get the current session from cookies (for server components and API routes)
 */
export async function auth(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(TOKEN_NAME)?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token) as any;
        if (!payload) {
            return null;
        }

        return {
            user: {
                id: payload.userId as string,
                name: payload.name as string,
                email: payload.email as string,
                image: payload.image as string,
                subscription: payload.subscription as string,
                badge: payload.badge as string[],
            },
            accessToken: token,
        };
    } catch (error: any) {
        if (error.digest === 'DYNAMIC_SERVER_USAGE' || error.message?.includes('Dynamic server usage')) {
            throw error;
        }
        console.error("Auth error:", error);
        return null;
    }
}

/**
 * Set the auth token in cookies
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
    });
}

/**
 * Remove the auth token from cookies
 */
export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAME);
}

/**
 * Sign out the user
 */
export async function signOut() {
    await removeAuthCookie();
}
