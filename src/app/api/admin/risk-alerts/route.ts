import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import RiskAlertModel from "@/app/models/RiskAlert";

export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user || session.user.subscription !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
        }

        await connect();

        const onlyUnacknowledged = req.nextUrl.searchParams.get("unacknowledged") === "true";
        const query = onlyUnacknowledged ? { acknowledgedByAdmin: false } : {};

        const alerts = await RiskAlertModel.find(query)
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(200);

        return NextResponse.json({ alerts }, { status: 200 });
    } catch (error) {
        console.error("Error listing risk alerts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
