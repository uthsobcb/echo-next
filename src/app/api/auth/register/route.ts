import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
// import { sendMail } from "@/app/lib/mailer";
export async function POST(req: NextRequest) {
    try {
        await connect();

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
        // await sendMail(
        //     email,
        //     "Welcome to Echo!",
        //     `<h1>Hi ${name}, Welcome to Echo!</h1><p>We're excited to have you on board.</p>`
        // );

        return NextResponse.json({ message: "User registered successfully", imageUrl }, { status: 201 });

    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}
