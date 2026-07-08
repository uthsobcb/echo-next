import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import { sendEmail } from "@/app/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const rawEmail = formData.get("email") as string;
    const password = formData.get("password") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !rawEmail || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      // console.log("Received image, upload logic goes here...");


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
  <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
    <div style="background-color: #f9f9f9; padding: 40px 20px; text-align: center;">
      <div class="container" style="max-width: 600px; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: auto; text-align: left; font-family: Arial, sans-serif;">
        
        <h1 style="color: #333333; font-size: 28px; margin: 0 0 20px; text-align: center;">Welcome to <span style="color: #4A90E2;">Echo</span>! 🌟</h1>

        <p style="color: #555555; font-size: 16px;">Hi <strong>${name}</strong>,</p>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Your journey with <strong>Echo</strong>, your personal AI-powered journaling companion, starts now!
        </p>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Here’s what you can do:
        </p>

        <ul style="margin: 20px 0; color: #555555; font-size: 14px; padding-left: 0; list-style-type: none;">
          <li style="margin-bottom: 10px;">📖 Reflect on your thoughts with AI-generated insights.</li>
          <li style="margin-bottom: 10px;">🧠 Track and analyze your mood over time.</li>
          <li style="margin-bottom: 10px;">🌦 Let <strong>Echo</strong> change its form based on your emotions.</li>
          <li style="margin-bottom: 10px;">📝 Capture your moments effortlessly.</li>
          <li style="margin-bottom: 10px;">🤖 Talk to Echo about your day!</li>
        </ul>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Ready to begin? Click below to start journaling with Echo.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://echojournal.life/login"
             class="button"
             style="display: inline-block; background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px;">
            Start Journaling 🚀
          </a>
        </div>

        <p style="color: #aaaaaa; font-size: 12px; margin-top: 30px; text-align: center;">
          If you didn't sign up for Echo, you can safely ignore this email.
        </p>

      </div>
    </div>
  </body>
    `;

    await sendEmail({
      to: email,
      subject: "Welcome to Echo - Your AI Journaling Companion!",
      html: emailHtml,
    });


    return NextResponse.json({ message: "User registered successfully", imageUrl }, { status: 201 });

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Server Error", error: (error as Error).message }, { status: 500 });
  }
}
