import { NextRequest, NextResponse } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { decrypt } from "@/app/lib/encryption";
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const search = searchParams.get('search')

        await connect();

        const authHeader = req.headers.get("authorization");
        // console.log("Received Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decodedToken;
        try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
            const { payload } = await jwtVerify(token, secret);
            decodedToken = payload;
            // console.log("Decoded Token:", decodedToken);
        } catch (err) {
            return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
        }

        const userId = (decodedToken as { userId: string }).userId;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid user" }, { status: 401 });
        }

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
