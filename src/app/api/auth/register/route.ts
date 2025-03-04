import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
    try {
        await connect();
        const resend = new Resend(process.env.RESEND_API_KEY);

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const imageFile = formData.get("image") as File | null;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = "";
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            console.log("Received image, upload logic goes here...");


        } else {
            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
        });

        await newUser.save();

        const emailHtml = `
        <div style="background-color: #f9f9f9; padding: 40px; text-align: center;">
            <div style="max-width: 600px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: auto;">
                <h1 style="color: #333;">Welcome to <span style="color: #4A90E2;">Echo</span>! 🌟</h1>
                <p style="color: #555; font-size: 16px;">Hi <strong>${name}</strong>,</p>
                <p style="color: #777; font-size: 14px;">
                    Your journey with <strong>Echo</strong>, your personal AI-powered journaling companion, starts now!
                </p>
                <p style="color: #777; font-size: 14px;">
                    Here’s what you can do:
                </p>
                <ul style="text-align: left; margin: 20px auto; max-width: 400px; color: #555;">
                    <li>📖 Reflect on your thoughts with AI-generated insights.</li>
                    <li>🧠 Track and analyze your mood over time.</li>
                    <li>🌦 Let <strong>Echo</strong> change its form based on your emotions.</li>
                    <li>📝 Capture your moments effortlessly.</li>
                    <li>🤖 Talk to Echo about your day!.</li>
                </ul>
                <p style="color: #777; font-size: 14px;">
                    Ready to begin? Click below to start journaling with Echo.
                </p>
                <a href="${process.env.NEXT_PUBLIC_URL}/login" 
                    style="display: inline-block; background: #4A90E2; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; margin-top: 20px;">
                    Start Journaling 🚀
                </a>
                <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
                    If you didn't sign up for Echo, you can safely ignore this email.
                </p>
            </div>
        </div>
    `;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Welcome to Echo - Your AI Journaling Companion!",
            html: emailHtml,
        });


        return NextResponse.json({ message: "User registered successfully", imageUrl }, { status: 201 });

    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}
