import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import SpaceDraw from "@/app/models/SpaceDraw";
import SpaceMessage from "@/app/models/SpaceMessage";

// GET /api/space/status - Check if user can draw
export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const fiveMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        // Count draws in the last 5 minutes
        const drawCount = await SpaceDraw.countDocuments({
            user: session.user.id,
            timestamp: { $gte: fiveMinutesAgo }
        });

        // 0 draws -> free
        // 1 draw -> need to post a message for the 2nd one
        // 2 or more draws -> blocked until window resets

        let canDraw = false;
        let requiresMessage = false;
        let nextAvailableAt = null;

        if (drawCount === 0) {
            canDraw = true;
        } else if (drawCount === 1) {
            canDraw = true;
            requiresMessage = true;
        } else {
            const firstDraw = await SpaceDraw.findOne({ user: session.user.id }).sort({ timestamp: -1 }).skip(drawCount - 1);
            if (firstDraw) {
                nextAvailableAt = new Date(firstDraw.timestamp.getTime() + 5 * 60 * 1000);
            }
        }

        return NextResponse.json({
            drawCount,
            canDraw,
            requiresMessage,
            nextAvailableAt
        });
    } catch (error: any) {
        console.error("Error in space/status GET:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/space/draw - Record a draw
export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const drawCount = await SpaceDraw.countDocuments({
            user: session.user.id,
            timestamp: { $gte: fiveMinutesAgo }
        });

        if (drawCount >= 2) {
            return NextResponse.json({ error: "Rate limit exceeded. Wait 5 minutes." }, { status: 429 });
        }

        let contributionId = null;

        if (drawCount === 1) {
            // Need a message post between the 1st and 2nd draw
            // Find the most recent message posted by the user AFTER their last draw
            const lastDraw = await SpaceDraw.findOne({ user: session.user.id }).sort({ timestamp: -1 });
            const message = await SpaceMessage.findOne({
                author: session.user.id,
                createdAt: { $gt: lastDraw?.timestamp || fiveMinutesAgo }
            }).sort({ createdAt: -1 });

            if (!message) {
                return NextResponse.json({ error: "Positive message required for extra draw" }, { status: 403 });
            }
            contributionId = message._id;
        }

        const draw = await SpaceDraw.create({
            user: session.user.id,
            timestamp: new Date(),
            contributionId
        });

        return NextResponse.json({ message: "Draw recorded", data: draw });
    } catch (error: any) {
        console.error("Error in space/draw POST:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
