import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import UserModel from '@/app/models/User';
import Entry from '@/app/models/Mood';
import Mood from '@/app/models/Mood';
import { auth } from "auth";

export async function GET(req: NextRequest) {
    try {
        await connect();

        const userSession = await auth();

        if (!(userSession?.user as any)?.subscription || (userSession.user as any).subscription !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized: Admin access only" },
                { status: 403 }
            );
        }


        const allUser = await UserModel.find();
        const allEntry = await Entry.find();
        const moodData = await Mood.find().select("mood");

        return NextResponse.json(
            { users: allUser, entries: allEntry.length, mood: moodData },
            { status: 200 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
