import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

export async function GET() {
    try {
        await connect();

        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch todos for the authenticated user
        const todos = await Todo.find(
            { userId: user.id },
            "todo type status createdAt"
        ).sort({ createdAt: -1 });

        return NextResponse.json({ todos });
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
