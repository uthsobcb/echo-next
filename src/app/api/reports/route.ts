import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import Mood from "@/app/models/Mood";
import UserModel from "@/app/models/User";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Get all users
        const users = await UserModel.find({});
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        for (const user of users) {
            const userId = user._id;
            const email = user.email;
            const userName = user.name;

            // Fetch mood entries from the past 7 days
            const moodData = await Mood.find({
                userId,
                createdAt: { $gte: oneWeekAgo }
            }).sort({ createdAt: 1 });

            if (!moodData.length) continue; // Skip users with no entries

            // Analyze moods
            const moodSummary = moodData.map(mood => `<li>${mood.mood} - Score: ${mood.score}</li>`).join("");
            const moodCount = moodData.length;
            const avgScore = (moodData.reduce((sum, mood) => sum + mood.score, 0) / moodCount).toFixed(2);

            // Prepare email content
            const emailHtml = `
                <div style="background-color: #f9f9f9; padding: 40px; text-align: center;">
                    <div style="max-width: 600px; background: white; padding: 30px; border-radius: 10px; 
                                box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: auto;">
                        <h1 style="color: #333;">📊 Your Weekly Mood Report</h1>
                        <p style="color: #555;">Hey <strong>${userName}</strong>, here's your mood summary for this week.</p>
                        
                        <h3 style="color: #4A90E2;">🌟 Key Insights</h3>
                        <p style="color: #777;">Total Mood Entries: <strong>${moodCount}</strong></p>
                        <p style="color: #777;">Average Mood Score: <strong>${avgScore}</strong></p>

                        <h3 style="color: #333;">💡 Mood Breakdown</h3>
                        <ul style="list-style: none; padding: 0; text-align: left; margin: 0 auto; max-width: 400px; color: #555;">
                            ${moodSummary}
                        </ul>

                        <p style="color: #777; font-size: 14px; margin-top: 20px;">
                            Keep journaling and tracking your emotions. Echo is always here to support you! 💙
                        </p>

                        <a href="${process.env.NEXT_PUBLIC_BASEURL}/dashboard"
                            style="display: inline-block; background: #4A90E2; color: white; text-decoration: none; 
                                    padding: 12px 25px; border-radius: 5px; font-size: 16px; margin-top: 20px;">
                            View My Progress 🚀
                        </a>

                        <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
                            This is an automated weekly report from Echo. Happy journaling! 📖
                        </p>
                    </div>
                </div>
            `;

            // Send Email
            await resend.emails.send({
                from: "onboarding.resend.dev",
                to: email,
                subject: `📊 Echo Weekly Mood Report for ${userName}`,
                html: emailHtml,
            });
        }

        return NextResponse.json({ message: "Weekly reports sent successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Error sending weekly reports:", error);
        return NextResponse.json({ message: "Error sending reports", error: error.message }, { status: 500 });
    }
}
