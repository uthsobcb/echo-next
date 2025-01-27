import { NextRequest, NextResponse } from "next/server";
import Mood from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";

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
        const moodData = await Mood.find({ userId }).sort({ createdAt: -1 }).select('mood score');

        return NextResponse.json(moodData, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}