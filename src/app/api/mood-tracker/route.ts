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
            // console.log("Decoded Token:", decodedToken);
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

        if (newBadge && !dbUser.badge.includes(newBadge)) {
            await UserModel.updateOne(
                { _id: userId },
                { $addToSet: { badge: newBadge } }
            );
            await resend.emails.send({
                from: "Echo☁️ Badge System <echo@uthsob.ninja>",
                to: email,
                subject: `🎖️ Congratulations, ${userName}! You've Earned a New Badge!`,
                html: `
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9f9f9; padding: 20px 0;">
                <tr>
                    <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); padding: 30px; margin: 0 auto;">
                        <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="https://i.ibb.co/C3c8DG4t/logov1.png" alt="Echo Logo" width="120" style="display: block; max-width: 120px; height: auto;">
                        </td>
                        </tr>
                        <tr>
                        <td style="text-align: center; font-family: Arial, sans-serif;">
                            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">🏆 Well Done, ${userName}!</h1>
                            <p style="color: #555555; font-size: 16px; margin-bottom: 15px;">
                            You've just unlocked the <strong style="color: #4A90E2;">${newBadge}</strong> badge! 🎉
                            </p>
                            <p style="color: #777777; font-size: 14px; margin-bottom: 25px;">
                            Your commitment to self-reflection and personal growth is inspiring. Keep journaling and earning more achievements!
                            </p>
                            <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;" />
                            <p style="color: #777777; font-size: 14px; margin-bottom: 25px;">
                            Keep tracking your emotions and let Echo be your guiding light. 🌟
                            </p>
                            <a href="${process.env.NEXT_PUBLIC_BASEURL}/profile"
                            style="display: inline-block; background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; margin-bottom: 25px;">
                            View My Progress 🚀
                            </a>
                            <p style="color: #aaaaaa; font-size: 12px; margin-top: 25px;">
                            If you didn’t earn this badge, no worries! Keep journaling and exploring your thoughts with Echo.
                            </p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
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
