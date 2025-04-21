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

        // Get all users
        const allUsers = await UserModel.find();

        // Get total entries count
        const totalEntries = await Entry.countDocuments();

        // Get mood data
        const moodData = await Mood.find().select("mood");

        // Get user-wise entry counts using aggregation
        const userEntryCounts = await Entry.aggregate([
            {
                $group: {
                    _id: "$userId",
                    entryCount: { $sum: 1 }
                }
            }
        ]);

        // Create a map of user IDs to entry counts
        const entryCountMap = Object.fromEntries(
            userEntryCounts.map(item => [item._id.toString(), item.entryCount])
        );

        // Combine user data with entry counts
        const usersWithEntries = allUsers.map(user => ({
            ...user.toObject(),
            entryCount: entryCountMap[user._id.toString()] || 0
        }));

        return NextResponse.json(
            {
                users: usersWithEntries,
                entries: totalEntries,
                mood: moodData
            },
            { status: 200 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
