import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import Post from "@/app/models/Post";
import { auth } from "@/app/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connect();

        // Try searching by ID first, then by slug
        let post = await Post.findById(id).catch(() => null);
        if (!post) {
            post = await Post.findOne({ slug: id });
        }

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.subscription !== 'admin') {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        await connect();

        const post = await Post.findByIdAndUpdate(id, data, { new: true });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.subscription !== 'admin') {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const { id } = await params;

        await connect();

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
