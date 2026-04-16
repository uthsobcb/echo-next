import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        // One day ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find users who haven't posted in 24h and have a push token
        // Also check if we already sent a STREAK_RECOVERY notification in the last 24h to avoid spamming
        const users = await UserModel.find({
            pushToken: { $ne: null },
            $or: [
                { lastEntryDate: { $lt: twentyFourHoursAgo } },
                { lastEntryDate: null }
            ]
        });

        const sentNotifications = [];

        for (const user of users) {
            // Check for recent STREAK_RECOVERY notification
            const recentNotification = await NotificationModel.findOne({
                userId: user._id,
                type: NotificationType.STREAK_RECOVERY,
                sentAt: { $gt: twentyFourHoursAgo }
            });

            if (recentNotification) continue;

            const title = "Don't lose your streak! 🔥";
            const body = "It's been 24 hours since your last entry. Take a moment to reflect.";
            const data = { screen: "Journal" };

            // Send push notification
            if (user.pushToken) {
                await sendPushNotification([user.pushToken], { title, body, data });

                // Log it in Notifications table
                const notification = new NotificationModel({
                    userId: user._id,
                    title,
                    body,
                    type: NotificationType.STREAK_RECOVERY,
                    data,
                    scheduledAt: new Date(),
                    sentAt: new Date()
                });
                await notification.save();
                sentNotifications.push(user._id);
            }
        }

        return NextResponse.json({
            message: `Processed ${users.length} potential users, sent ${sentNotifications.length} STREAK_RECOVERY nudges.`
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in timely-nudges cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
