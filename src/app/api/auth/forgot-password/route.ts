import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { sendEmail } from "@/app/lib/email";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        // Generate a cryptographically secure 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        user.resetPasswordCode = verificationCode;
        user.resetPasswordExpires = new Date(Date.now() + 300000); // Code expires in 5 minutes (300,000ms)
        await user.save();

        // Send email with verification code
        const { error } = await sendEmail({
            to: normalizedEmail,
            subject: "Password Reset Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; background-color: #ffffff;">
                <h2 style="color: #2d89ef; text-align: center; margin-bottom: 10px;">Reset Your Password</h2>
                <p style="color: #333;">Hello,</p>
                <p style="color: #333;">
                    You recently requested to reset your password. Use the verification code below to proceed:
                </p>
                <div style="font-size: 24px; font-weight: bold; text-align: center; background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0; letter-spacing: 2px;">
                    ${verificationCode}
                </div>
                
                <p style="color: #555;">
                    This code is valid for next 5 minutes. If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="color: #555;">
                    Thank you, <br>
                    <strong>Echo</strong>
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="color: #777; font-size: 12px; text-align: center;">
                    This email was sent to ${normalizedEmail} upon request. If you didn’t request this, please ignore it or contact support.
                </p>
            </div>
        `,
        });

        if (error) {
            console.error("Failed to send reset email:", error);
            return NextResponse.json({ message: "Failed to send verification code. Please try again later." }, { status: 500 });
        }

        return NextResponse.json({ message: "Verification code sent to email." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Error processing request." }, { status: 500 });
    }
}
