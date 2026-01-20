import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET);
const TOKEN_NAME = "auth_token";

/**
 * Create a signed JWT token
 */
export async function createToken(payload, expiresIn = "30d") {
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
export async function verifyToken(token) {
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
export async function auth() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(TOKEN_NAME)?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return null;
        }

        return {
            user: {
                id: payload.userId,
                name: payload.name,
                email: payload.email,
                image: payload.image,
                subscription: payload.subscription,
                badge: payload.badge,
            },
            accessToken: token,
        };
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}

/**
 * Set the auth token in cookies
 */
export async function setAuthCookie(token) {
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
