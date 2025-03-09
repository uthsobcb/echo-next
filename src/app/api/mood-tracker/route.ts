import { NextRequest, NextResponse } from "next/server";
import Mood from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import UserModel from "@/app/models/User";
import { Resend } from 'resend';

// import { sendMail } from "@/app/lib/mailer";
export async function GET(req: NextRequest) {
    try {
        await connect();
        const resend = new Resend(process.env.RESEND_API_KEY);

        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
            console.log("Decoded Token:", decodedToken);
        } catch (err) {
            return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
        }

        const userId = decodedToken.userId;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid user" }, { status: 401 });
        }

        const moodData = await Mood.find({ userId }).sort({ createdAt: 1 }).select('mood score');

        const countMood = await Mood.countDocuments({ userId });


        const dbUser = await UserModel.findOne({ _id: userId });
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const email = dbUser.email;
        const userName = dbUser.name;
        let newBadge = null;
        if (countMood >= 7) {
            newBadge = "Pen Whisperer";
        }
        if (countMood >= 30) {
            newBadge = "Mindful Scribe";
        }
        if (countMood >= 45) {
            newBadge = "Thought Architect";
        }
        if (countMood >= 60) {
            newBadge = "Guardian of Inked Wisdom";
        }

        if (newBadge) {
            await UserModel.updateOne(
                { _id: userId },
                { $addToSet: { badge: newBadge } }
            );
            await resend.emails.send({
                from: "onboarding.resend.dev",
                to: email,
                subject: `🎖️ Congratulations, ${userName}! You've Earned a New Badge!`,
                html: `
                    <div style="background-color: #f9f9f9; padding: 40px; text-align: center;">
                        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1); margin: auto;">
                            <h1 style="color: #333;">🏆 Well Done, ${userName}!</h1>
                            <p style="color: #555; font-size: 16px;">
                                You've just unlocked the <strong style="color: #4A90E2;">${newBadge}</strong> badge! 🎉
                            </p>
                            <p style="color: #777; font-size: 14px;">
                                Your commitment to self-reflection and personal growth is inspiring. Keep journaling and earning more achievements!
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                            
                            <h3 style="color: #333;">💡 Your Recent Mood Insights</h3>
                            <ul style="list-style: none; padding: 0; text-align: left; margin: 0 auto; max-width: 400px; color: #555;">
                                ${moodData
                        .map(
                            (mood) =>
                                `<li style="background: #f3f3f3; padding: 8px; border-radius: 5px; margin: 5px 0;">
                                                <strong>${mood.mood}</strong> - Score: <span style="color: #4A90E2;">${mood.score}</span>
                                            </li>`
                        )
                        .join("")}
                            </ul>
                            
                            <p style="color: #777; font-size: 14px; margin-top: 20px;">
                                Keep tracking your emotions and let Echo be your guiding light. 🌟
                            </p>
                            
                            <a href="${process.env.NEXT_PUBLIC_BASEURL}/dashboard"
                                style="display: inline-block; background: #4A90E2; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; margin-top: 20px;">
                                View My Progress 🚀
                            </a>
            
                            <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
                                If you didn’t earn this badge, no worries! Keep journaling and exploring your thoughts with Echo.
                            </p>
                        </div>
                    </div>
                `,
            });

            // await sendMail(
            //     email,
            //     "Congratulations on Your New Badge!",
            //     `<h1>Hey ${userName}!!</h1><p>You just earned the <strong>${newBadge}</strong> badge! 🎉 Keep it up!</p>`
            // );

        }

        return NextResponse.json(moodData, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}
