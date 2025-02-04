"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DeleteButton({ entryId, accessToken }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BASEURL}/api/entries/${entryId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            toast.success("Entry deleted successfully!");
            router.push("/profile");
        } catch (err) {
            console.error("Error deleting entry:", err);
            toast.error("Failed to delete entry");
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-medium hover:bg-red-600 transition"
            >
                Delete
            </button>


            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to delete this entry? This action cannot be undone.</p>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
