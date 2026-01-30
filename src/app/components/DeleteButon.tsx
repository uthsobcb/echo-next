"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

interface DeleteButtonProps {
    entryId: string;
    accessToken: string;
}

export default function DeleteButton({ entryId, accessToken }: DeleteButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/entries/${entryId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success("Entry deleted successfully!");
                router.push("/profile");
                router.refresh();
            }
        } catch (err: any) {
            console.error("Error deleting entry:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete entry";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-xl shadow-md font-medium hover:bg-red-600 transition disabled:opacity-50"
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : "Delete"}
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
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
