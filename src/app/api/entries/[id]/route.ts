import { NextResponse, NextRequest } from "next/server";
import Entry from "@/app/models/Mood";
import { connect } from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import { encrypt, decrypt } from "@/app/lib/encryption";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const authHeader = req.headers.get("authorization");
        // console.log("Received Authorization Header:", authHeader);

        if (!authHeader?.startsWith("Bearer ")) {
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

        const userId = decodedToken.userId;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid user" }, { status: 401 });
        }

        const entry = await Entry.findOne({ _id: new mongoose.Types.ObjectId((await params)?.id), userId });
        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }
        // console.log("Entry found:", entry);
        const decryptedEntry = {
            ...entry.toObject(),
            content: entry.content && entry.content.includes(":") ? (() => {
                try {
                    return decrypt(entry.content);  // Try to decrypt if it's encrypted
                } catch (error) {
                    console.error("Error during decryption:", error);
                    return "Error decrypting content";
                }
            })() : entry.content  // If not encrypted, return content as is
        };

        // console.log("Decrypted Entry:", decryptedEntry);
        return NextResponse.json(decryptedEntry, { status: 200 });
    } catch (error) {
        console.error("Error fetching entry:", error);
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const authHeader = req.headers.get("authorization");
        // console.log("Received Authorization Header:", authHeader);

        if (!authHeader?.startsWith("Bearer ")) {
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

        const userId = decodedToken.userId;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized - Invalid user" }, { status: 401 });
        }

        const deletedEntry = await Entry.findByIdAndDelete({ _id: new mongoose.Types.ObjectId((await params)?.id), userId });
        if (!deletedEntry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching entry:", error);
        return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
    }
}

// export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//     try {

//         await connect();
//         const authHeader = req.headers.get("authorization");
//         console.log("Received Authorization Header:", authHeader);

//         if (!authHeader?.startsWith("Bearer ")) {
//             return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1];

//         let decodedToken;
//         try {
//             decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
//             console.log("Decoded Token:", decodedToken);
//         } catch (err) {
//             return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
//         }

//         const userId = decodedToken.userId;
//         if (!userId) {
//             return NextResponse.json({ message: "Unauthorized - Invalid user" }, { status: 401 });
//         }
//         const updateData = await req.json();
//         const entryId = params.id;
//         const updatedEntry = await Entry.findByIdAndUpdate(
//             new mongoose.Types.ObjectId(entryId),
//             updateData,
//             { new: true }
//         );

//         if (!updatedEntry) {
//             return NextResponse.json({ message: "Entry not found" }, { status: 404 });
//         }
//         return NextResponse.json(updatedEntry, { status: 200 });

//     }
//     catch (error) {
//         console.error("Error fetching entry:", error);
//         return NextResponse.json({ message: "Failed to fetch entry" }, { status: 500 });
//     }
// }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connect();

        const authHeader = req.headers.get("authorization");
        // console.log("Received Authorization Header:", authHeader);

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1];

        let decodedToken;
        try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
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

        // Parse the request body to extract update data
        const updateData = await req.json();

        // const deletedEntry = await Entry.findByIdAndDelete({ _id: new mongoose.Types.ObjectId((await params)?.id), userId });

        const updatedEntry = await Entry.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId((await params)?.id) },
            updateData,
            { new: true }
        );

        if (!updatedEntry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        console.error("Error updating entry:", error);
        return NextResponse.json({ message: "Failed to update entry" }, { status: 500 });
    }
}