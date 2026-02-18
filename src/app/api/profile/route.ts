import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import { auth } from "@/app/lib/auth";
import { jwtVerify } from "jose";
import { getUserProfile } from "@/app/lib/user-data";

export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized - Invalid or missing token" }, { status: 401 });
        }

        const userId = session.user.id;
        const user = await getUserProfile(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true, user }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Server error. Please try again later.", error: (error as Error).message }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        await connect();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
        }

        const { name, image, currentPassword, newPassword, wantsWeeklyReport } = await req.json();

        const user = await UserModel.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (name) user.name = name;
        if (image) user.image = image;
        if (typeof wantsWeeklyReport !== 'undefined') user.wantsWeeklyReport = wantsWeeklyReport;

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
        return NextResponse.json({ message: "Server error. Please try again later.", error: (error as Error).message }, { status: 500 });
    }
}
