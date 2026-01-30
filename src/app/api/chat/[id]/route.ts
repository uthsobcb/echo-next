import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { decrypt } from "@/app/lib/encryption";

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

        // Decrypt the chat data for the frontend
        const decryptedChat = {
            ...chat,
            threadSummary: chat.threadSummary ? decrypt(chat.threadSummary) : "",
            messages: Array.isArray(chat.messages)
                ? chat.messages.map((m: any) => ({
                    ...m,
                    text: decrypt(m.text)
                }))
                : []
        };

        return NextResponse.json(decryptedChat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        const user = session?.user;
        const { id } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const chat = await Chat.findOneAndDelete({
            _id: id,
            userId: user.id,
        });

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        const user = session?.user;
        const { id } = await params;
        const { threadSummary } = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!threadSummary) {
            return NextResponse.json({ error: "Summary is required" }, { status: 400 });
        }

        await connect();

        const { encrypt } = await import("@/app/lib/encryption");

        const chat = await Chat.findOneAndUpdate(
            { _id: id, userId: user.id },
            { threadSummary: encrypt(threadSummary) },
            { new: true }
        );

        if (!chat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Chat updated successfully" });
    } catch (error) {
        console.error("Error updating chat:", error);
        return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
    }
}
