import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
const INACTIVITY_MS = 24 * 60 * 60 * 1000; // 24 hours

const STREAK_MESSAGES = [
    {
        title: "Don't lose your streak! 🔥",
        body: "It's been 24 hours since your last entry. Take a moment to reflect.",
    },
    {
        title: "Your streak needs you 📖",
        body: "Missing a day hurts. Write something — anything — to keep the momentum.",
    },
    {
        title: "Come back to Echo 🌿",
        body: "It's been a while. How are you feeling? Write it out.",
    },
    {
        title: "One entry a day 💪",
        body: "You were on a roll. Don't let today be the day you stop.",
    },
    {
        title: "Still thinking about your day? 🌙",
        body: "Your journal is waiting. Even one line is enough.",
    },
];

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const inactiveSince = new Date(Date.now() - INACTIVITY_MS);
        const cutoff = new Date(Date.now() - COOLDOWN_MS);

        const users = await UserModel.find({
            pushToken: { $ne: null },
            $or: [
                { lastEntryDate: { $lt: inactiveSince } },
                { lastEntryDate: null },
            ],
        });

        const sentNotifications = [];

        for (const user of users) {
            // Global cooldown: skip if ANY notification sent in last 4 hours
            const recent = await NotificationModel.findOne({
                userId: user._id,
                sentAt: { $gt: cutoff },
            });
            if (recent) continue;

            const msg = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
            const data = { screen: "Journal" };

            await sendPushNotification([user.pushToken], { title: msg.title, body: msg.body, data });

            const now = new Date();
            await new NotificationModel({
                userId: user._id,
                title: msg.title,
                body: msg.body,
                type: NotificationType.STREAK_RECOVERY,
                data,
                scheduledAt: now,
                sentAt: now,
            }).save();

            sentNotifications.push(user._id);
        }

        return NextResponse.json(
            { message: `Processed ${users.length} potential users, sent ${sentNotifications.length} STREAK_RECOVERY nudges.` },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in timely-nudges cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
