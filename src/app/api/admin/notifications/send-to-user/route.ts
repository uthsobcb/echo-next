import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await connect();
        const { userId, title, body, data, scheduledAt, type } = await req.json();

        if (!userId || !title || !body) {
            return NextResponse.json({ error: "UserId, title, and body are required" }, { status: 400 });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create the notification record
        const notification = new NotificationModel({
            userId: new mongoose.Types.ObjectId(userId),
            title,
            body,
            type: type || NotificationType.CUSTOM,
            data: data || {},
            scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        });

        await notification.save();

        // If scheduled for now or in the past, send immediately
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            if (user.pushToken) {
                await sendPushNotification([user.pushToken], { title, body, data });
                notification.sentAt = new Date();
                await notification.save();
                return NextResponse.json({ message: "Notification sent successfully." }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Notification saved but user has no push token.", notificationId: notification._id }, { status: 200 });
            }
        }

        return NextResponse.json({ message: "Notification scheduled successfully.", notificationId: notification._id }, { status: 201 });

    } catch (error: any) {
        console.error("Error in send-to-user notification:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
