import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connect();
        const database = mongoose.connection.db;
        if (!database) throw new Error("Database connection is not ready");
        await database.admin().ping();

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Health check failed", error);
        return NextResponse.json(
            { status: "unhealthy", timestamp: new Date().toISOString() },
            { status: 503 },
        );
    }
}
