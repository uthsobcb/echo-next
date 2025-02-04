"use client"

import React, { useEffect, useState } from 'react'
import SearchBar from '@/app/components/SearchBar';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';

function ProfileEntries({ session }) {
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchEntries = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries?search=${searchQuery}`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            setEntries(response.data);

            console.log("Entries fetched:", entries);
        } catch (error) {
            console.log(error)
            console.error("Error fetching entries:", error.response?.data || error.message);
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [searchQuery])


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Search Your Entries
                </h2>
                <div className="flex lg:flex-row flex-col  w-full justify-center items-center m-3">
                    <div className="flex lg:w-1/2 w-full justify-center items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Type to search..."
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <input
                            type="date"
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                </div>
            </div>
            {entries.length > 0 ? (
                <div className="flex flex-col gap-6 overflow-x-auto pb-6 justify-center items-center">
                    <div className="relative max-w-2xl border-l-4 border-blue-500 pl-8">
                        {entries.map((entry, index) => {
                            const formattedDate = entry.createdAt
                                ? format(new Date(entry.createdAt), "EEE, MMM d, yyyy, h:mm a")
                                : "Unknown Date";
                            const truncateText = (text = "", wordLimit = 50) => {
                                const words = text.split(" ");
                                if (words.length > wordLimit) {
                                    return words.slice(0, wordLimit).join(" ") + "...";
                                }
                                return text;
                            };

                            return (
                                <div key={entry._id} className="mb-10 relative">
                                    <div className="absolute -left-8 top-2 flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full border-2 border-white shadow-md">
                                        {index + 1}
                                    </div>

                                    <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>

                                    <Link href={`/entry/${entry._id}`} className="block bg-white p-5 rounded-lg shadow-md transition hover:shadow-lg hover:bg-gray-50 border border-gray-200">
                                        <h2 className="text-lg font-semibold text-gray-900">{formattedDate || "Untitled Entry"}</h2>
                                        <p className="text-md text-gray-700 font-semibold mt-1">🌟 Mood: {entry.mood}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {entry.content ? truncateText(entry.content, 50) : "No content available."}
                                        </p>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">No journal entries found.</p>
            )}

        </div>
    )
}

export default ProfileEntries