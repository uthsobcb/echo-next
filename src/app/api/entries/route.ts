import { NextRequest, NextResponse } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const search = searchParams.get('search')

        await connect();

        const authHeader = req.headers.get("authorization");
        console.log("Received Authorization Header:", authHeader);

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

        const query = {
            userId
        }

        if (search) {
            query["$or"] = [{ content: { $regex: search, $options: "i" } }, { mood: { $regex: search, $options: "i" } }]
        }

        const entries = await Entry.find(query).sort({ createdAt: -1 });
        return NextResponse.json(entries, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}
