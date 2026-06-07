import { NextRequest, NextResponse } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { decrypt } from "@/app/lib/encryption";
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const search = searchParams.get('search')

        await connect();

        const session = await auth(req);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized - Invalid or missing token" }, { status: 401 });
        }

        const userId = session.user.id;

        const query: Record<string, any> = {
            userId
        };

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query["$or"] = [{ content: { $regex: escapedSearch, $options: "i" } }, { mood: { $regex: escapedSearch, $options: "i" } }]
        }

        const entries = await Entry.find(query).sort({ createdAt: -1 });
        // decrypt() already returns unencrypted/undecryptable content as-is, so no extra branching needed here.
        const decryptedEntries = entries.map(entry => ({
            ...entry.toObject(),
            content: decrypt(entry.content),
        }));
        return NextResponse.json(decryptedEntries, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}
