import { NextResponse } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { auth } from "auth";

export async function GET(req: Request) {
    try {
        await connect();

        const session = await auth();
        const user = session?.user;

        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const entries = await Entry.find({ userId: user?.id });
        return NextResponse.json(entries, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}
