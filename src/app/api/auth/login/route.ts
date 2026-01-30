import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { createToken, setAuthCookie } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // Connect to MongoDB
        await connect();

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login failed: User with email ${email} not found.`);
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`Login failed: Password mismatch for user ${email}.`);
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Generate a JWT with user info
        // We use plain objects/strings to avoid DataCloneError in jose/SignJWT
        const tokenPayload = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            subscription: user.subscription,
            // Spread the array to ensure it's a plain JS array, not a Mongoose array
            badge: Array.isArray(user.badge) ? [...user.badge] : [],
        };

        const token = await createToken(tokenPayload);

        // Set the auth cookie
        await setAuthCookie(token);

        return NextResponse.json({
            token,
            message: "Login successful.",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image,
            }
        });
    } catch (error: any) {
        console.error("Error in login route:", error.message, error.stack);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
