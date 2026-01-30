import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import SpaceMessage from "@/app/models/SpaceMessage";
import SpaceDraw from "@/app/models/SpaceDraw";

// POST /api/space/message - Post a new message
export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content } = await req.json();
        if (!content || content.length < 5) {
            return NextResponse.json({ error: "Message too short" }, { status: 400 });
        }

        await connect();

        const message = await SpaceMessage.create({
            content,
            author: session.user.id
        });

        return NextResponse.json({ message: "Message posted successfully", data: message });
    } catch (error: any) {
        console.error("Error in space/message POST:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET /api/space/message - Get a random message (excluding user's own)
export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        // Get a random message from someone else
        const count = await SpaceMessage.countDocuments({ author: { $ne: session.user.id } });
        if (count === 0) {
            return NextResponse.json({ error: "No messages found" }, { status: 404 });
        }

        const random = Math.floor(Math.random() * count);
        const message = await SpaceMessage.findOne({ author: { $ne: session.user.id } }).skip(random);

        return NextResponse.json({ data: message });
    } catch (error: any) {
        console.error("Error in space/message GET:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
