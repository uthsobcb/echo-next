import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        // Connect to MongoDB
        await connectToDatabase();

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Generate a JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        return NextResponse.json({ token, message: "Login successful." });
    } catch (error) {
        console.error("Error in login route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
