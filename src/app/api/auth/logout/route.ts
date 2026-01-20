import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/app/lib/auth";

export async function POST() {
    try {
        await removeAuthCookie();
        return NextResponse.json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in logout route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function GET() {
    try {
        await removeAuthCookie();
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000"));
    } catch (error) {
        console.error("Error in logout route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
