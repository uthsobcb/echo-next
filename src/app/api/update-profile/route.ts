import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import { auth } from "auth";

export async function PUT(req: NextRequest) {
    try {
        await connect();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
        }

        const { name, image, currentPassword, newPassword } = await req.json();

        const user = await UserModel.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (name) user.name = name;
        if (image) user.image = image;

        if (currentPassword && newPassword) {
            if (!user.password) {
                return NextResponse.json({ message: "Password update not allowed for this account." }, { status: 400 });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return NextResponse.json({ success: true, message: "Profile updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Server error. Please try again later.", error: error.message }, { status: 500 });
    }
}
