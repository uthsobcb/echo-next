import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";
import Post from "@/app/models/Post";
import { auth } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get("all") !== "true";

        const query = publishedOnly ? { published: true } : {};
        const posts = await Post.find(query).sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // Check if user is admin
        if (!session || session.user?.subscription !== 'admin') {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const data = await req.json();

        if (!data.title || !data.content || !data.slug) {
            return NextResponse.json({ error: "Title, content, and slug are required." }, { status: 400 });
        }

        await connect();

        const post = await Post.create({
            ...data,
            author: session.user.name || "Admin"
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Error creating post:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "A post with this slug already exists." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
