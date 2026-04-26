import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import UserModel from "@/app/models/User";

export async function GET(req: Request) {
    try {
        const session = await auth(req);
        if (!session?.user || session.user.subscription !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
        }

        await connect();
        const users = await UserModel.find({}).select('_id name email').sort({ name: 1 });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error("Error listing users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}