import { NextRequest, NextResponse } from "next/server";
import Mood from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import UserModel from "@/app/models/User";

export async function GET(req: NextRequest) {
    try {
        await connect();

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

        // const countMood = await Mood.countDocuments({ userId });

        // const dbUser = await UserModel.findOne({ userId });
        // if (!dbUser) {
        //     return NextResponse.json({ error: "User not found" }, { status: 404 });
        // }

        // let newBadge = null;

        // if (countMood >= 15 && !dbUser.badge.includes("Pen Whisperer")) {
        //     newBadge = "Pen Whisperer";
        // } else if (countMood >= 20 && !dbUser.badge.includes("Master Scribe")) {
        //     newBadge = "Master Scribe";
        // }

        // if (newBadge) {
        //     dbUser.badge.push(newBadge);
        //     await dbUser.save();
        // }


        return NextResponse.json(moodData, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}