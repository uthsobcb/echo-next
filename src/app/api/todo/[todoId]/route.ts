import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { connect } from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

export async function PATCH(req: Request, { params }: { params: Promise<{ todoId: string }> }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        const { todoId } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { oldTask, newTask, status } = await req.json();

        const updateData: { todo?: string; status?: string } = {};
        if (newTask && newTask !== oldTask) updateData.todo = newTask;
        if (status) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No update data provided." }, { status: 400 });
        }

        const updated = await Todo.findOneAndUpdate(
            { _id: todoId, userId: user.id },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Todo not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo updated", todo: updated });
    } catch (error) {
        console.error("Error updating todo:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ todoId: string }> }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        const { todoId } = await params;

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const deleted = await Todo.findOneAndDelete({ _id: todoId, userId: user.id });

        if (!deleted) {
            return NextResponse.json({ error: "Todo not found or already deleted." }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted", deleted });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
