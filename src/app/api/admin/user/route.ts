import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb"
// import jwt from "jsonwebtoken";
import UserModel from '@/app/models/User'

export async function PATCH(req: NextRequest) {
    try {
        const { userId, updates } = await req.json();

        if (!userId || !updates) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        await connect();

        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await connect();

        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error", details: (error as Error).message }, { status: 500 });
    }
}