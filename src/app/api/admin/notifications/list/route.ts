import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import NotificationModel from "@/app/models/Notification";

export async function GET(req: Request) {
    try {
        const session = await auth(req);
        if (!session?.user || session.user.subscription !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
        }

        await connect();

        // Fetch last 50 notifications, sorted by creation date
        const notifications = await NotificationModel.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'name email');

        return NextResponse.json({ notifications }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching notification list:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
