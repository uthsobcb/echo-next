import { NextResponse } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { auth } from "auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const entry = await Entry.findOne({ _id: params.id, userId: user.id });
        if (!entry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

        return NextResponse.json(entry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { title, date, mood, excerpt } = await req.json();
        const updatedEntry = await Entry.findOneAndUpdate(
            { _id: params.id, userId: user.id },
            { title, date, mood, excerpt },
            { new: true }
        );

        if (!updatedEntry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update entry" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const deletedEntry = await Entry.findOneAndDelete({ _id: params.id, userId: user.id });

        if (!deletedEntry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete entry" }, { status: 500 });
    }
}
