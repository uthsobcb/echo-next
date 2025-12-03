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
        <style>
      @media only screen and (max-width: 620px) {
        .container {
          width: 100% !important;
          padding: 20px !important;
        }
        .content {
          padding: 20px !important;
        }
        h1 {
          font-size: 22px !important;
        }
        .button {
          display: block !important;
          width: 100% !important;
        }
        ul {
          padding-left: 20px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
    <div style="background-color: #f9f9f9; padding: 40px 20px; text-align: center;">
      <div class="container" style="max-width: 600px; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: auto;">
        
        <h1 style="color: #333333; font-size: 28px; margin: 0 0 20px;">Welcome to <span style="color: #4A90E2;">Echo</span>! 🌟</h1>

        <p style="color: #555555; font-size: 16px;">Hi <strong>${name}</strong>,</p>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Your journey with <strong>Echo</strong>, your personal AI-powered journaling companion, starts now!
        </p>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Here’s what you can do:
        </p>

        <ul style="text-align: left; margin: 20px auto; max-width: 400px; color: #555555; font-size: 14px; padding-left: 0; list-style-type: none;">
          <li style="margin-bottom: 10px;">📖 Reflect on your thoughts with AI-generated insights.</li>
          <li style="margin-bottom: 10px;">🧠 Track and analyze your mood over time.</li>
          <li style="margin-bottom: 10px;">🌦 Let <strong>Echo</strong> change its form based on your emotions.</li>
          <li style="margin-bottom: 10px;">📝 Capture your moments effortlessly.</li>
          <li style="margin-bottom: 10px;">🤖 Talk to Echo about your day!</li>
        </ul>

        <p style="color: #777777; font-size: 14px; line-height: 1.5;">
          Ready to begin? Click below to start journaling with Echo.
        </p>

        <a href="https://my-echo.space/login"
           class="button"
           style="display: inline-block; background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; margin-top: 20px;">
          Start Journaling 🚀
        </a>

        <p style="color: #aaaaaa; font-size: 12px; margin-top: 20px;">
          If you didn't sign up for Echo, you can safely ignore this email.
        </p>

      </div>
    </div>
    `;

    await resend.emails.send({
      from: "Echo☁️<welcome@my-echo.space>",
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
