"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EntryCard() {
    const router = useRouter();
    const { _id } = useParams();

    const [entry, setEntry] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!_id) return;

        const fetchEntry = async () => {
            try {
                const response = await axios.get(`/api/entries/${_id}`);
                setEntry(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Error fetching entry");
            }
        };

        fetchEntry();
    }, [_id]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!entry) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 px-4 py-6">
            <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Entry from: {entry.createdAt || "Unknown Date"}</h2>
                <p className="text-md mt-1">🌟 Mood: {entry.mood}</p>
                {/* <p> </p> */}

                <div className="flex justify-around mt-6">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md font-medium">Edit</button>
                    <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-medium">Delete</button>
                </div>
            </div>

            <div className="w-11/12 max-w-5xl bg-[#F5DEB3] border rounded-md p-8">
                <p className="text-gray-900 font-handwriting text-5xl leading-snug">{entry.content}</p>
            </div>

            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-md mt-4">
                <p className="text-lg font-semibold">
                    {entry.comment}
                </p>
                <p className="mt-2">
                    Need someone to talk to about your feelings?
                    Echo listens to you attentively and responds with empathy. It doesn’t judge, interrupt, or assume—just a space where you can share your thoughts freely.
                </p>
                <Link href={{ pathname: "/chat", query: { entryContent: entry.content } }}>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Talk to Echo
                    </button>
                </Link>
            </div>
        </div>
    );
}
