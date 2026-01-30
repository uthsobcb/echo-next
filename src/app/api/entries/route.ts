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
            query["$or"] = [{ content: { $regex: search, $options: "i" } }, { mood: { $regex: search, $options: "i" } }]
        }

        const entries = await Entry.find(query).sort({ createdAt: -1 });
        const decryptedEntries = entries.map(entry => {
            return {
                ...entry.toObject(),
                content: entry.content && entry.content.includes(":") ? (() => {
                    try {
                        return decrypt(entry.content);  // Try to decrypt if it's encrypted
                    } catch (error) {
                        console.error("Error during decryption:", error);
                        return "Error decrypting content";
                    }
                })() : entry.content  // If not encrypted, return content as is
            }
        });
        // console.log("Decrypted Entries:", decryptedEntries);
        return NextResponse.json(decryptedEntries, { status: 200 });

    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json({ message: "Failed to fetch entries" }, { status: 500 });
    }
}
