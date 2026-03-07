import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";

export async function GET(req: Request) {
    try {
        await connect();

        // Find users with a push token
        const users = await UserModel.find({ pushToken: { $ne: null } });

        const notifications = [];

        for (const user of users) {
            const userTimezone = user.timezone || 'UTC';

            try {
                const userNow = new Date();

                // Get parts from formatter
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: userTimezone,
                    hour: 'numeric',
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                const parts = formatter.formatToParts(userNow);
                let hourPart = parts.find(p => p.type === 'hour')?.value;
                if (hourPart === '24') hourPart = '0'; // Handle 24-hour edge cases
                const hour = parseInt(hourPart || '0', 10);

                const year = parts.find(p => p.type === 'year')?.value;
                const month = parts.find(p => p.type === 'month')?.value;
                const day = parts.find(p => p.type === 'day')?.value;
                const currentLocalDay = `${year}-${month}-${day}`;

                let lastEntryLocalDay = null;
                if (user.lastEntryDate) {
                    const lastEntryFormatter = new Intl.DateTimeFormat('en-US', {
                        timeZone: userTimezone,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    const leParts = lastEntryFormatter.formatToParts(user.lastEntryDate);
                    const leYear = leParts.find(p => p.type === 'year')?.value;
                    const leMonth = leParts.find(p => p.type === 'month')?.value;
                    const leDay = leParts.find(p => p.type === 'day')?.value;
                    lastEntryLocalDay = `${leYear}-${leMonth}-${leDay}`;
                }

                // Important: 20 is 8:00 PM
                if (hour === 20 && currentLocalDay !== lastEntryLocalDay) {
                    notifications.push({
                        to: user.pushToken,
                        title: "Don't lose your streak! 🔥",
                        body: "Take a minute to journal your thoughts and keep your streak alive.",
                        sound: 'default'
                    });
                }

            } catch (err) {
                console.error(`Error processing timezone for user ${user._id}:`, err);
            }
        }

        if (notifications.length > 0) {
            // Send requests to Expo push service
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notifications)
            });

            if (!response.ok) {
                console.error("Failed to send Expo push notifications:", await response.text());
                return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
            }
        }

        return NextResponse.json({ message: `Processed ${users.length} users, sent ${notifications.length} reminders.` }, { status: 200 });

    } catch (error) {
        console.error("Error in reminder cron job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
