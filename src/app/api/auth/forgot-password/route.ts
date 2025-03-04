import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = verificationCode;
        user.resetPasswordExpires = new Date(Date.now() + 6400000); // Code expires in 5 minutes
        await user.save();

        // Send email with verification code
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Password Reset Code",
            html: `<p>Your password reset code is: <strong>${verificationCode}</strong></p>`,
        });

        return NextResponse.json({ message: "Verification code sent to email." });
    } catch (error) {
        return NextResponse.json({ message: "Error sending email." }, { status: 500 });
    }
}
