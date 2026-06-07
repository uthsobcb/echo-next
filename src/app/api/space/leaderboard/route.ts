import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import SpaceMessage from "@/app/models/SpaceMessage";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        // Aggregate SpaceMessage to count contributions per user
        const leaderboard = await SpaceMessage.aggregate([
            {
                $group: {
                    _id: "$author",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    name: "$userDetails.name",
                    image: "$userDetails.image"
                }
            }
        ]);

        return NextResponse.json({ data: leaderboard });
    } catch (error: any) {
        console.error("Error in space/leaderboard GET:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
