"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";


export default function EditProfile({ user }) {
    const [profileImage, setProfileImage] = useState(user.image);
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const imgUrl = response.data.data.url;
            setProfileImage(imgUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Image upload failed.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsUpdating(true);

        try {
            const response = await axios.put("/api/update-profile", {
                name,
                image: profileImage,
                currentPassword: currentPassword || undefined, // Only send if entered
                newPassword: newPassword || undefined, // Only send if entered
            });

            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                // setTimeout(() => router.push("/profile"), 4000);
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-md border p-6 rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h1>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative text-center opacity-80">
                    <div className="relative inline-block">
                        <label htmlFor="fileInput" className="cursor-pointer">
                            {/* Profile Image */}
                            <Image
                                src={profileImage}
                                alt="Profile Preview"
                                width={96}
                                height={96}
                                unoptimized
                                className="rounded-full mx-auto border shadow-sm hover:opacity-80 transition"
                            />
                            <div className="absolute bottom-2 left-1.5 transform -translate-x-1/2 text-white p-1 rounded-full shadow-md flex items-center justify-center">
                                <Image
                                    src="/assets/pen.svg"
                                    alt="Edit Icon"
                                    width={18}
                                    height={18}
                                    className="h-4 w-4"
                                />
                            </div>
                        </label>
                        <input id="fileInput" type="file" onChange={handleImageUpload} className="hidden" />
                    </div>

                </div>


                <div>
                    <label className="block font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        className="border w-full p-3 rounded-md focus:ring focus:ring-blue-300 outline-none"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="border w-full p-3 rounded-md bg-gray-100 outline-none"
                        defaultValue={user.email}
                        disabled
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Current Password (optional)</label>
                    <input
                        type="password"
                        className="border w-full p-3 rounded-md focus:ring focus:ring-blue-300 outline-none"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">New Password (optional)</label>
                    <input
                        type="password"
                        className="border w-full p-3 rounded-md focus:ring focus:ring-blue-300 outline-none"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className={`px-5 py-2.5 ${isUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
                            } text-white font-medium rounded-lg focus:ring focus:ring-blue-300`}
                    >
                        {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        className="px-5 py-2.5 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
