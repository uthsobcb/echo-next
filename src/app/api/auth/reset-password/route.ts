import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email, code, password } = await req.json();
        const user = await User.findOne({ email });

        if (!user || user.resetPasswordCode !== code || user?.resetPasswordExpires.getTime() < Date.now()) {
            return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
        }

        // Hash and save the new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();

        return NextResponse.json({ message: "Password successfully reset!" });
    } catch (error) {
        return NextResponse.json({ message: "Error resetting password." }, { status: 500 });
    }
}
