import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import RiskAlertModel from "@/app/models/RiskAlert";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth(req);
        if (!session?.user || session.user.subscription !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
        }

        await connect();

        const { id } = await params;
        const alert = await RiskAlertModel.findByIdAndUpdate(
            id,
            { acknowledgedByAdmin: true, acknowledgedAt: new Date() },
            { new: true }
        );

        if (!alert) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 });
        }

        return NextResponse.json({ alert }, { status: 200 });
    } catch (error) {
        console.error("Error acknowledging risk alert:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
