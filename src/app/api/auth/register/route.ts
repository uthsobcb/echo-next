import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        // Connect to MongoDB
        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error in register route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
