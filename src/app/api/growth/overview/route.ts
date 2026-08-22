import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import { decrypt } from "@/app/lib/encryption";
import GrowthProfile from "@/app/models/GrowthProfile";
import GrowthReport from "@/app/models/GrowthReport";
import GrowthExperiment from "@/app/models/GrowthExperiment";
import { decodeProfile, decodeReport } from "@/app/lib/growth";

export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await connect();

        const [profileRecord, reportRecords, experimentRecord] = await Promise.all([
            GrowthProfile.findOne({ userId: session.user.id }),
            GrowthReport.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(6),
            GrowthExperiment.findOne({ userId: session.user.id, status: "active" }).sort({ createdAt: -1 }),
        ]);

        return NextResponse.json({
            profile: profileRecord ? { ...decodeProfile(profileRecord.encryptedData), updatedAt: profileRecord.updatedAt } : null,
            reports: reportRecords.map(report => ({
                id: report._id.toString(),
                period: report.period,
                createdAt: report.createdAt,
                ...decodeReport(report.encryptedData),
            })),
            activeExperiment: experimentRecord ? {
                id: experimentRecord._id.toString(),
                status: experimentRecord.status,
                startedAt: experimentRecord.startedAt,
                endsAt: experimentRecord.endsAt,
                ...JSON.parse(decrypt(experimentRecord.encryptedData)),
            } : null,
        });
    } catch (error) {
        console.error("Growth overview failed", error);
        return NextResponse.json({ error: "Unable to load your growth workspace." }, { status: 500 });
    }
}
