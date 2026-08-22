import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import { encrypt } from "@/app/lib/encryption";
import GrowthExperiment from "@/app/models/GrowthExperiment";
import GrowthReport from "@/app/models/GrowthReport";
import { decodeReport } from "@/app/lib/growth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { suggestionIndex } = await req.json() as { suggestionIndex?: number };
        if (!Number.isInteger(suggestionIndex) || (suggestionIndex as number) < 0 || (suggestionIndex as number) > 1) {
            return NextResponse.json({ error: "Choose a valid suggestion." }, { status: 400 });
        }
        await connect();
        const active = await GrowthExperiment.findOne({ userId: session.user.id, status: "active" });
        if (active) return NextResponse.json({ error: "Finish or stop your current experiment first." }, { status: 409 });
        const reportRecord = await GrowthReport.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
        if (!reportRecord) return NextResponse.json({ error: "Generate a report first." }, { status: 404 });
        const suggestion = decodeReport(reportRecord.encryptedData).suggestions[suggestionIndex as number];
        if (!suggestion) return NextResponse.json({ error: "Suggestion not found." }, { status: 404 });
        const startedAt = new Date();
        const endsAt = new Date(startedAt);
        endsAt.setDate(endsAt.getDate() + suggestion.durationDays);
        const payload = { ...suggestion, checkIns: [] as { date: string; rating: number; note: string }[] };
        const experiment = await GrowthExperiment.create({
            userId: session.user.id,
            encryptedData: encrypt(JSON.stringify(payload)),
            status: "active",
            startedAt,
            endsAt,
        });
        return NextResponse.json({ experiment: { id: experiment._id.toString(), ...payload, status: experiment.status, startedAt, endsAt } });
    } catch (error) {
        console.error("Experiment creation failed", error);
        return NextResponse.json({ error: "Unable to start that experiment." }, { status: 500 });
    }
}
