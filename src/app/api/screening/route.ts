import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import Screening from "@/app/models/Screening";
import { scoreScreening, validateAnswers, phq9SuicideRisk, ScreeningType } from "@/app/lib/screening";
import { recordRiskFlagAndMaybeNotify } from "@/app/lib/safety";

export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { type, answers } = await req.json();
        if (type !== "phq9" && type !== "gad7") {
            return NextResponse.json({ error: "type must be 'phq9' or 'gad7'." }, { status: 400 });
        }
        if (!validateAnswers(type as ScreeningType, answers)) {
            return NextResponse.json({ error: "Invalid answers for this instrument." }, { status: 400 });
        }

        await connect();

        const { totalScore, severity } = scoreScreening(type, answers);
        const screening = await Screening.create({
            userId: session.user.id,
            type,
            answers,
            totalScore,
            severity,
        });

        if (type === "phq9") {
            const risk = phq9SuicideRisk(answers);
            await recordRiskFlagAndMaybeNotify({
                userId: session.user.id,
                screeningId: screening._id,
                severity: risk.severity,
                indicators: risk.indicators,
            });
        }

        return NextResponse.json({ id: screening._id, type, totalScore, severity }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/screening:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const rawType = req.nextUrl.searchParams.get("type");
        const query: Record<string, unknown> = { userId: session.user.id };
        if (rawType === "phq9" || rawType === "gad7") query.type = rawType;

        const history = await Screening.find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .select("type totalScore severity createdAt");

        return NextResponse.json({ history });
    } catch (error) {
        console.error("Error in GET /api/screening:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
