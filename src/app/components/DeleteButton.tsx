"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-xl shadow-md font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
                disabled={isDeleting}
            >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Are you sure you want to delete this entry? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium text-sm"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 font-medium text-sm flex items-center gap-2"
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
