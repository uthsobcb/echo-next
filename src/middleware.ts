import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || ""
);

const protectedRoutes = [
    "/entry",
    "/chat",
    "/insights",
    "/profile",
    "/admin",
    "/todo",
    "/meditate",
    "/memory",
    "/space",
];

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/guide", "/a-landing"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip API routes, static files, and public routes
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;
    let isAuthenticated = false;

    if (token) {
        try {
            await jwtVerify(token, JWT_SECRET);
            isAuthenticated = true;
        } catch {
            // Token invalid or expired
        }
    }

    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
    const isPublicAuthRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Redirect unauthenticated users away from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login/register
    if (isPublicAuthRoute && isAuthenticated && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/entry", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
