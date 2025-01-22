import { NextResponse, NextRequest } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
    try {
        await connect();

        const authHeader = req.headers.get("authorization");
        console.log("Received Authorization Header:", authHeader);

        if (!authHeader?.startsWith("Bearer ")) {
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

        const entry = await Entry.findOne({ _id: new mongoose.Types.ObjectId(params.id), userId });
        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }
        console.log("Entry found:", entry);
        return NextResponse.json(entry, { status: 200 });
    } catch (error) {
        console.error("Error fetching entry:", error);
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}
