import { NextResponse } from "next/server";
import { auth } from "auth";
import { connect } from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

export async function PATCH(req: Request, { params }: { params: { moodId: string } }) {
    try {
        await connect();
        const session = await auth();
        const user = session?.user;
        const { moodId } = params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { oldTask, newTask, status } = await req.json();

        // Build dynamic update object
        const updateData: any = {};
        if (newTask) updateData.todo = newTask;
        if (status) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No update data provided." }, { status: 400 });
        }

        const updated = await Todo.findOneAndUpdate(
            {
                _id: moodId,
                userId: user.id,
                ...(oldTask && { todo: oldTask }) // only include if oldTask exists
            },
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
