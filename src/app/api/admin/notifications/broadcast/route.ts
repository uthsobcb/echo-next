import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

export async function POST(req: Request) {
    try {
        const session = await auth(req);
        if (!session?.user || session.user.subscription !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
        }

        await connect();
        const { title, body, data, scheduledAt } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
        }

        // Create the notification record
        const notification = new NotificationModel({
            userId: null, // Broadcast
            title,
            body,
            type: NotificationType.CUSTOM,
            data: data || {},
            scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        });

        await notification.save();

        // If scheduled for now or in the past, send immediately
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            const users = await UserModel.find({ pushToken: { $ne: null } }).select('pushToken');
            const tokens = users.map(u => u.pushToken).filter(t => t) as string[];

            if (tokens.length > 0) {
                await sendPushNotification(tokens, { title, body, data });
                notification.sentAt = new Date();
                await notification.save();
            }

            return NextResponse.json({ message: `Broadcast sent to ${tokens.length} users.` }, { status: 200 });
        }

        return NextResponse.json({ message: "Broadcast scheduled successfully.", notificationId: notification._id }, { status: 201 });

    } catch (error: any) {
        console.error("Error in broadcast notification:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
