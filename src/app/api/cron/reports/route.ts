import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import Mood from "@/app/models/Mood";
import UserModel from "@/app/models/User";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();
        const resend = new Resend(process.env.RESEND_API_KEY);

        const users = await UserModel.find({ wantsWeeklyReport: { $ne: false } });
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const batchSize = 2;

        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (user) => {
                    try {
                        const moodData = await Mood.find({
                            userId: user._id,
                            createdAt: { $gte: oneWeekAgo }
                        }).sort({ createdAt: 1 });

                        const moodSummary = moodData.map(mood => `<li>${mood.mood} - Score: ${mood.score}</li>`).join("");
                        const moodCount = moodData.length;
                        const avgScore = moodCount > 0
                            ? (moodData.reduce((sum, mood) => sum + mood.score, 0) / moodCount).toFixed(2)
                            : "N/A";

                        const emailHtml = `
                <style>
                    @media only screen and (max-width: 600px) {
                        .container {
                        width: 100% !important;
                        padding: 20px !important;
                        }

                        .insight-box {
                        display: block !important;
                        width: 100% !important;
                        margin-bottom: 15px !important;
                        }

                        .cta-button {
                        display: block !important;
                        width: 100% !important;
                        text-align: center !important;
                        }

                        .header-text {
                        font-size: 22px !important;
                        }
                    }
                </style>
                    <div style="background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%); padding: 50px 20px; text-align: center; font-family: Arial, sans-serif;">
                    <div class="container" style="max-width: 600px; background: white; padding: 40px; border-radius: 15px; box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08); margin: auto; border: 1px solid rgba(0,0,0,0.05);">
                        <div style="background: #4A90E2; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <h1 class="header-text" style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">📊 Your Weekly Mood Report</h1>
                        </div>

                        <p style="color: #555; font-size: 18px; margin-bottom: 20px;">Hey <strong style="color: #4A90E2;">${user.name}</strong>, here's your mood journey this week! 🌈</p>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #4A90E2; margin-top: 0; font-size: 22px;">🌟 Key Insights</h3>
                        <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                            <div class="insight-box" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); width: 45%; margin: 10px 0;">
                            <p style="color: #777; margin: 0;">Total Entries</p>
                            <p style="color: #4A90E2; font-size: 24px; margin: 10px 0;">${moodCount}</p>
                            </div>
                            <div class="insight-box" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); width: 45%; margin: 10px 0;">
                            <p style="color: #777; margin: 0;">Avg. Score</p>
                            <p style="color: #4A90E2; font-size: 24px; margin: 10px 0;">${avgScore}</p>
                            </div>
                        </div>
                        </div>

                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                        <h3 style="color: #4A90E2; margin-top: 0; font-size: 22px;">💡 Mood Timeline</h3>
                        <ul style="list-style: none; padding: 0; margin: 0 auto; max-width: 400px; color: #555;">
                            ${moodSummary}
                        </ul>
                        </div>

                        <p style="color: #777; font-size: 16px; margin: 30px 0; line-height: 1.6;">
                        Keep shining and tracking your emotions. Remember, every mood is a step in your journey! 💫
                        </p>

                        <a href="https://my-echo.space/profile"
                        class="cta-button"
                        style="display: inline-block; background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
                                color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                                font-size: 16px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);">
                        View My Progress 🚀
                        </a>

                        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
                        <p style="color: #aaa; font-size: 12px; margin: 0;">
                            This is an automated weekly report from Echo. Keep journaling and growing! 📖✨
                        </p>
                        </div>
                    </div>
                    </div>
                        `;

                        await resend.emails.send({
                            from: "Echo☁️ <echo@uthsob.ninja>",
                            to: user.email,
                            subject: `📊 Echo Weekly Mood Report for ${user.name}`,
                            html: emailHtml,
                        });

                    } catch (err) {
                        console.error(`Failed to send report to ${user.email}:`, err);
                    }
                })
            );

            // Respect Resend’s 2 req/sec limit
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds between batches
        }

        return NextResponse.json({ message: "Weekly reports sent successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Error sending weekly reports:", error);
        return NextResponse.json({ message: "Error sending reports" }, { status: 500 });
    }
}
