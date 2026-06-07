import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const now = new Date();

        // Find notifications that are scheduled for now or earlier and haven't been sent
        const pendingNotifications = await NotificationModel.find({
            scheduledAt: { $lte: now },
            sentAt: null
        });

        if (pendingNotifications.length === 0) {
            return NextResponse.json({ message: "No pending notifications to send." }, { status: 200 });
        }

        let sentCount = 0;

        for (const notification of pendingNotifications) {
            let tokens: string[] = [];

            if (notification.userId) {
                // Targeted notification
                const user = await UserModel.findById(notification.userId);
                if (user && user.pushToken) {
                    tokens = [user.pushToken];
                }
            } else {
                // Broadcast notification
                const users = await UserModel.find({ pushToken: { $ne: null } }).select('pushToken');
                tokens = users.map(u => u.pushToken).filter(t => t) as string[];
            }

            if (tokens.length > 0) {
                await sendPushNotification(tokens, {
                    title: notification.title,
                    body: notification.body,
                    data: notification.data
                });

                notification.sentAt = new Date();
                await notification.save();
                sentCount++;
            } else {
                // Mark as processed even if no tokens found to avoid infinite loop
                notification.sentAt = new Date();
                await notification.save();
            }
        }

        return NextResponse.json({ message: `Processed ${pendingNotifications.length} notifications, successfully sent ${sentCount}.` }, { status: 200 });

    } catch (error: any) {
        console.error("Error in scheduled-queue cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
