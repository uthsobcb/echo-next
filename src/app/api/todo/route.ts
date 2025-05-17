import { NextResponse } from "next/server";
import { auth } from "auth";
import { connect } from "@/app/lib/mongodb";
import Mood from "@/app/models/Mood";

export async function GET() {
    try {
        await connect();

        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch moods with todos
        const moodsWithTodos = await Mood.find(
            {
                userId: user.id,
                todo: { $exists: true, $ne: [] }
            },
            "todo createdAt"
        ).sort({ createdAt: -1 });

        // Flatten todos with moodId + timestamp
        const todos = moodsWithTodos.flatMap(entry =>
            entry.todo.map((task: string) => ({
                task,
                createdAt: entry.createdAt,
                moodId: entry._id.toString()
            }))
        );

        return NextResponse.json({ todos });
    } catch (error) {
        console.error("Error fetching todos from mood entries:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
