import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import { generateGrowthReport } from "@/app/lib/growth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await req.json().catch(() => ({}));
        const period = body.period === "monthly" ? "monthly" : "weekly";
        await connect();
        const report = await generateGrowthReport(session.user.id, period);
        return NextResponse.json({ report, period });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to generate your report.";
        console.error("Report generation failed", error);
        return NextResponse.json({ error: message }, { status: message.startsWith("Write at least") ? 400 : 502 });
    }
}
