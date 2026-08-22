import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import { decrypt, encrypt } from "@/app/lib/encryption";
import GrowthExperiment from "@/app/models/GrowthExperiment";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const body = await req.json();
        await connect();
        const experiment = await GrowthExperiment.findOne({ _id: id, userId: session.user.id });
        if (!experiment) return NextResponse.json({ error: "Experiment not found." }, { status: 404 });
        const payload = JSON.parse(decrypt(experiment.encryptedData));

        if (body.action === "check-in") {
            const rating = Number(body.rating);
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
            }
            payload.checkIns = Array.isArray(payload.checkIns) ? payload.checkIns : [];
            payload.checkIns.push({ date: new Date().toISOString(), rating, note: String(body.note || "").trim().slice(0, 280) });
            experiment.encryptedData = encrypt(JSON.stringify(payload));
        } else if (body.action === "complete" || body.action === "stop") {
            experiment.status = body.action === "complete" ? "completed" : "stopped";
        } else {
            return NextResponse.json({ error: "Invalid experiment action." }, { status: 400 });
        }

        await experiment.save();
        return NextResponse.json({ experiment: { id, ...payload, status: experiment.status, startedAt: experiment.startedAt, endsAt: experiment.endsAt } });
    } catch (error) {
        console.error("Experiment update failed", error);
        return NextResponse.json({ error: "Unable to update that experiment." }, { status: 500 });
    }
}
