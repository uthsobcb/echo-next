import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASEURL}/api/auth/google/callback`;

    if (!GOOGLE_CLIENT_ID) {
        return NextResponse.json({ error: "Google Client ID not configured" }, { status: 500 });
    }

    // CSRF protection: the callback must present the same value back, proving the
    // request originated from this browser's own OAuth flow.
    const state = crypto.randomBytes(16).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
    });

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        state,
    };

    const qs = new URLSearchParams(options);
    const authUrl = `${rootUrl}?${qs.toString()}`;

    return NextResponse.redirect(authUrl);
}
