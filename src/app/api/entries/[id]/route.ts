import { NextResponse, NextRequest } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { auth, getUserIdFromRequest } from "@/app/lib/auth";
import mongoose from "mongoose";
import { encrypt, decrypt } from "@/app/lib/encryption";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid or missing token" }, { status: 401 });
        }

        const entry = await Entry.findOne({ _id: new mongoose.Types.ObjectId((await params)?.id), userId });
        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }
        const decryptedEntry = {
            ...entry.toObject(),
            content: decrypt(entry.content),
        };

        return NextResponse.json(decryptedEntry, { status: 200 });
    } catch (error) {
        console.error("Error fetching entry:", error);
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid or missing token" }, { status: 401 });
        }

        const deletedEntry = await Entry.findOneAndDelete({ _id: new mongoose.Types.ObjectId((await params)?.id), userId });
        if (!deletedEntry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching entry:", error);
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid or missing token" }, { status: 401 });
        }

        const updateData = await req.json();

        const updatedEntry = await Entry.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId((await params)?.id), userId },
            updateData,
            { new: true }
        );

        if (!updatedEntry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        console.error("Error updating entry:", error);
        return NextResponse.json({ message: "Failed to update entry" }, { status: 500 });
    }
}