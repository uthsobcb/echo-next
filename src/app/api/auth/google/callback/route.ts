import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { createToken, setAuthCookie } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASEURL}/login?error=no_code`);
    }

    try {
        // 1. Exchange code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASEURL}/api/auth/google/callback`,
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
            console.error("Google token exchange error:", tokens.error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASEURL}/login?error=token_exchange_failed`);
        }

        // 2. Get user info from Google
        const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const googleUser = await userinfoResponse.json();

        if (!googleUser.email) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASEURL}/login?error=no_email_from_google`);
        }

        // 3. Find or Create User in MongoDB
        await connect();

        const normalizedEmail = googleUser.email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Create new user if they don't exist
            user = await User.create({
                name: googleUser.name,
                email: normalizedEmail,
                image: googleUser.picture,
                // Google users get a random hashed password (they authenticate via OAuth, not password)
                password: await bcrypt.hash(crypto.randomUUID(), 10),
                subscription: "free",
            });
        } else if (googleUser.picture && (!user.image || user.image === "/assets/logo.png")) {
            // Update profile image if missing or default
            user.image = googleUser.picture;
            await user.save();
        }

        // 4. Create Session Token (Consistent with Login route)
        const tokenPayload = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            subscription: user.subscription,
            badge: Array.isArray(user.badge) ? [...user.badge] : [],
        };

        const token = await createToken(tokenPayload);

        // 5. Set Auth Cookie
        await setAuthCookie(token);

        // 6. Redirect to app
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASEURL}/entry`);

    } catch (error: any) {
        console.error("Google Auth error:", error.message);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASEURL}/login?error=internal_server_error`);
    }
}
