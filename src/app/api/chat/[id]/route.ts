import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        const user = session?.user;
        const { id } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const chat = await Chat.findOne({
            _id: id,
            userId: user.id,
        }).lean();

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat" },
            { status: 500 }
        );
    }
}
