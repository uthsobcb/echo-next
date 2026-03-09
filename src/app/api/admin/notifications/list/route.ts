import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import NotificationModel from "@/app/models/Notification";

export async function GET(req: Request) {
    try {
        await connect();

        // Fetch last 50 notifications, sorted by creation date
        const notifications = await NotificationModel.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'name email');

        return NextResponse.json({ notifications }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching notification list:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
