import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import Todo from "@/app/models/Todo";
import { sendPushNotification } from "@/lib/expo-notifications";

const REMINDER_HOUR = 12; // noon local
const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

function buildMessage(count: number): { title: string; body: string } {
    const templates = [
        {
            title: "You've got things to do 📋",
            body: `${count} todo${count > 1 ? 's' : ''} still pending. A little progress goes a long way.`,
        },
        {
            title: "Midday check-in ✅",
            body: `Don't forget — you have ${count} task${count > 1 ? 's' : ''} waiting. Knock one out now.`,
        },
        {
            title: "Make progress today 💪",
            body: `You have ${count} unfinished todo${count > 1 ? 's' : ''}. Even one step counts.`,
        },
        {
            title: "Your todo list is waiting 📌",
            body: `${count} task${count > 1 ? 's' : ''} to tackle. Open Echo and get one done.`,
        },
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

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

                if (hour !== REMINDER_HOUR) continue;
                if (!user.pushToken) continue;

                // Check pending/in-progress todos for this user
                const pendingCount = await Todo.countDocuments({
                    userId: user._id,
                    status: { $in: ["pending", "in-progress"] },
                });

                if (pendingCount === 0) continue;

                // Global cooldown: skip if any notification sent in last 4 hours
                const recent = await NotificationModel.findOne({
                    userId: user._id,
                    sentAt: { $gt: cutoff },
                });
                if (recent) continue;

                const msg = buildMessage(pendingCount);
                const data = { screen: "Todo" };

                await sendPushNotification([user.pushToken], {
                    title: msg.title,
                    body: msg.body,
                    data,
                });

                await new NotificationModel({
                    userId: user._id,
                    title: msg.title,
                    body: msg.body,
                    type: NotificationType.TODO_REMINDER,
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
            { message: `Processed ${users.length} users, sent ${sentCount} todo reminders.` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in todo-reminders cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
