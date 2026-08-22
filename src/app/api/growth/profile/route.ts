import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import { encrypt } from "@/app/lib/encryption";
import GrowthProfile from "@/app/models/GrowthProfile";
import { decodeProfile, generateReflectionProfile, ObservationStatus } from "@/app/lib/growth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await connect();
        const profile = await generateReflectionProfile(session.user.id);
        return NextResponse.json({ profile });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to generate your profile.";
        console.error("Profile generation failed", error);
        return NextResponse.json({ error: message }, { status: message.startsWith("Write at least") ? 400 : 502 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth(req);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { observationId, status, text } = await req.json() as { observationId?: string; status?: ObservationStatus; text?: string };
        if (!observationId || (status === undefined && text === undefined) || (status !== undefined && !["proposed", "confirmed", "dismissed"].includes(status))) {
            return NextResponse.json({ error: "Invalid observation update." }, { status: 400 });
        }
        const correctedText = text === undefined ? undefined : text.trim().slice(0, 320);
        if (correctedText !== undefined && correctedText.length < 3) {
            return NextResponse.json({ error: "The corrected observation is too short." }, { status: 400 });
        }
        await connect();
        const record = await GrowthProfile.findOne({ userId: session.user.id });
        if (!record) return NextResponse.json({ error: "Generate a profile first." }, { status: 404 });
        const profile = decodeProfile(record.encryptedData);
        const observation = profile.observations.find(item => item.id === observationId);
        if (!observation) return NextResponse.json({ error: "Observation not found." }, { status: 404 });
        if (status) observation.status = status;
        if (correctedText) {
            observation.text = correctedText;
            observation.status = "confirmed";
        }
        record.encryptedData = encrypt(JSON.stringify(profile));
        await record.save();
        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Profile update failed", error);
        return NextResponse.json({ error: "Unable to update that observation." }, { status: 500 });
    }
}
