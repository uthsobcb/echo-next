import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email, code, password } = await req.json();

        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : email;

        // The 6-digit code has only ~900k combinations over a 5-minute window, so bound
        // guess attempts per account (and per IP as defense-in-depth) independently of it expiring.
        const allowedByEmail = await checkRateLimit(`reset-password:email:${normalizedEmail}`, 10, 15 * 60);
        const allowedByIp = await checkRateLimit(`reset-password:ip:${getClientIp(req)}`, 20, 15 * 60);
        if (!allowedByEmail || !allowedByIp) {
            return NextResponse.json({ message: "Too many attempts. Please request a new code and try again later." }, { status: 429 });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || user.resetPasswordCode !== code || !user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
            return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
        }

        // Hash and save the new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({ message: "Password successfully reset!" });
    } catch (error) {
        return NextResponse.json({ message: "Error resetting password." }, { status: 500 });
    }
}
