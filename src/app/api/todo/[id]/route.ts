import { NextResponse } from "next/server";
import { auth } from "auth";
import { connect } from "@/app/lib/mongodb";
import Mood from "@/app/models/Mood";

export async function PATCH(req: Request, { params }: { params: { moodId: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { oldTask, newTask } = await req.json();
        if (!oldTask || !newTask) {
            return NextResponse.json({ error: "Both oldTask and newTask are required." }, { status: 400 });
        }

        const mood = await Mood.findOne({ _id: params.moodId, userId: user.id });
        if (!mood) return NextResponse.json({ error: "Mood entry not found." }, { status: 404 });

        const index = mood.todo.findIndex((t: string) => t === oldTask);
        if (index === -1) return NextResponse.json({ error: "Task not found in todo list." }, { status: 404 });

        mood.todo[index] = newTask;
        await mood.save();

        return NextResponse.json({ message: "Todo updated", todo: mood.todo });
    } catch (error) {
        console.error("Error updating todo:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export async function DELETE(req: Request, { params }: { params: { moodId: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { task } = await req.json();
        if (!task) return NextResponse.json({ error: "Task to delete is required." }, { status: 400 });

        const mood = await Mood.findOneAndUpdate(
            { _id: params.moodId, userId: user.id },
            { $pull: { todo: task } },
            { new: true }
        );

        if (!mood) return NextResponse.json({ error: "Mood entry not found." }, { status: 404 });

        return NextResponse.json({ message: "Todo deleted", todo: mood.todo });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
