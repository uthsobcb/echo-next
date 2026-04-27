import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

const MORNING_HOUR = 8; // 8 AM local
const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

// Alternates between motivation and mood check-in to add variety
const MORNING_NOTIFICATIONS = [
    {
        type: NotificationType.MOTIVATION,
        title: "Good morning! 🌅",
        body: "Start your day with intention. What's one thing you want to feel by tonight?",
        data: { screen: "Journal" },
    },
    {
        type: NotificationType.MOOD_CHECKIN,
        title: "Morning check-in 😊",
        body: "How are you waking up today? Log your mood and set the tone.",
        data: { screen: "MoodTracker" },
    },
    {
        type: NotificationType.MOTIVATION,
        title: "A fresh start ✨",
        body: "Yesterday is done. Today is yours. What will you make of it?",
        data: { screen: "Journal" },
    },
    {
        type: NotificationType.MOOD_CHECKIN,
        title: "How's your energy? ⚡",
        body: "Take 30 seconds to check in with yourself. Your future self will thank you.",
        data: { screen: "MoodTracker" },
    },
    {
        type: NotificationType.MOTIVATION,
        title: "Morning moment 🌿",
        body: "Write one sentence about how you're feeling right now. That's all.",
        data: { screen: "Journal" },
    },
    {
        type: NotificationType.MOTIVATION,
        title: "Rise & reflect 🌤",
        body: "The best journalers write in the morning. Today's a great day to start.",
        data: { screen: "Journal" },
    },
];

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const users = await UserModel.find({ pushToken: { $ne: null } });
        const cutoff = new Date(Date.now() - COOLDOWN_MS);
        let sentCount = 0;

        for (const user of users) {
            const userTimezone = user.timezone || "UTC";

            try {
                const now = new Date();
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: userTimezone,
                    hour: "numeric",
                    hour12: false,
                });

                const parts = formatter.formatToParts(now);
                let hourStr = parts.find(p => p.type === "hour")?.value;
                if (hourStr === "24") hourStr = "0";
                const hour = parseInt(hourStr || "0", 10);

                if (hour !== MORNING_HOUR) continue;
                if (!user.pushToken) continue;

                // Global cooldown: skip if any notification sent in last 4 hours
                const recent = await NotificationModel.findOne({
                    userId: user._id,
                    sentAt: { $gt: cutoff },
                });
                if (recent) continue;

                const msg = MORNING_NOTIFICATIONS[Math.floor(Math.random() * MORNING_NOTIFICATIONS.length)];

                await sendPushNotification([user.pushToken], {
                    title: msg.title,
                    body: msg.body,
                    data: msg.data,
                });

                await new NotificationModel({
                    userId: user._id,
                    title: msg.title,
                    body: msg.body,
                    type: msg.type,
                    data: msg.data,
                    scheduledAt: now,
                    sentAt: now,
                }).save();

                sentCount++;
            } catch (err) {
                console.error(`Error processing user ${user._id}:`, err);
            }
        }

        return NextResponse.json(
            { message: `Processed ${users.length} users, sent ${sentCount} morning notifications.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in morning-motivation cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
