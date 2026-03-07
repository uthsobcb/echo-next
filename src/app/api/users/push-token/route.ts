import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import UserModel from "@/app/models/User";

export async function POST(req: Request) {
    try {
        const { token, timezone } = await req.json();

        await connect();
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }

        const dbUser = await UserModel.findById(user.id);
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (token !== undefined) dbUser.pushToken = token;
        if (timezone !== undefined) dbUser.timezone = timezone;

        await dbUser.save();

        return NextResponse.json({
            message: "Push data updated successfully",
            pushToken: dbUser.pushToken,
            timezone: dbUser.timezone
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating push token:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
