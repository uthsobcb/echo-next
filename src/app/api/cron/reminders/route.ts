import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

const REMINDER_HOUR = 20; // 8 PM local
const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

const JOURNAL_MESSAGES = [
    {
        title: "Time to reflect 📝",
        body: "A few minutes of journaling can change your whole night. What's on your mind?",
    },
    {
        title: "Your journal is waiting ✨",
        body: "Capture today before it slips away. What made you feel something today?",
    },
    {
        title: "Evening check-in 🌙",
        body: "How did today go? Write it down — even one sentence counts.",
    },
    {
        title: "Don't break the chain 🔥",
        body: "Keep your streak alive. A quick journal entry is all it takes.",
    },
    {
        title: "Reflect & recharge 💭",
        body: "What's one thing you're grateful for today? Journal it.",
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
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });

                const parts = formatter.formatToParts(now);
                let hourStr = parts.find(p => p.type === "hour")?.value;
                if (hourStr === "24") hourStr = "0";
                const hour = parseInt(hourStr || "0", 10);

                if (hour !== REMINDER_HOUR) continue;

                // Check if user journaled today (local day)
                const year = parts.find(p => p.type === "year")?.value;
                const month = parts.find(p => p.type === "month")?.value;
                const day = parts.find(p => p.type === "day")?.value;
                const todayLocal = `${year}-${month}-${day}`;

                let lastEntryLocalDay = null;
                if (user.lastEntryDate) {
                    const lf = new Intl.DateTimeFormat("en-US", {
                        timeZone: userTimezone,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });
                    const lp = lf.formatToParts(user.lastEntryDate);
                    lastEntryLocalDay = `${lp.find(p => p.type === "year")?.value}-${lp.find(p => p.type === "month")?.value}-${lp.find(p => p.type === "day")?.value}`;
                }

                if (todayLocal === lastEntryLocalDay) continue; // already journaled today

                // Global cooldown: skip if any notification sent in last 4 hours
                const recent = await NotificationModel.findOne({
                    userId: user._id,
                    sentAt: { $gt: cutoff },
                });
                if (recent) continue;

                const msg = JOURNAL_MESSAGES[Math.floor(Math.random() * JOURNAL_MESSAGES.length)];
                const data = { screen: "Journal" };

                await sendPushNotification([user.pushToken], { title: msg.title, body: msg.body, data });

                await new NotificationModel({
                    userId: user._id,
                    title: msg.title,
                    body: msg.body,
                    type: NotificationType.JOURNAL_REMINDER,
                    data,
                    scheduledAt: now,
                    sentAt: now,
                }).save();

                sentCount++;
            } catch (err) {
                console.error(`Error processing user ${user._id}:`, err);
            }
        }

        return NextResponse.json(
            { message: `Processed ${users.length} users, sent ${sentCount} reminders.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in reminder cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
