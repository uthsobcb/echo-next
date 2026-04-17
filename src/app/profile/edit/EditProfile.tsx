"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
interface EditProfileProps {
    user: {
        name: string;
        email: string;
        image?: string;
        wantsWeeklyReport?: boolean;
        deleteRequested?: boolean;
    };
}

export default function EditProfile({ user }: EditProfileProps) {
    const [profileImage, setProfileImage] = useState(user.image);
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [wantsWeeklyReport, setWantsWeeklyReport] = useState(user.wantsWeeklyReport ?? true);
    const [deleteRequested, setDeleteRequested] = useState(user.deleteRequested || false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDeleteRequestToggle = async () => {
        const isRequesting = !deleteRequested;
        if (isRequesting) {
            const confirmed = window.confirm("Are you sure you want to request account deletion? An administrator will review and permanently delete your account.");
            if (!confirmed) return;
        }

        try {
            const response = await axios.put("/api/profile", {
                deleteRequested: isRequesting
            });

            if (response.status === 200) {
                setDeleteRequested(isRequesting);
                toast.success(isRequesting ? "Account deletion requested successfully." : "Deletion request cancelled.");
            } else {
                toast.error("Failed to update deletion request.");
            }
        } catch (error) {
            console.error("Error updating deletion request:", error);
            toast.error("Error updating deletion request.");
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUpdating(true);

        try {
            const response = await axios.put("/api/profile", {
                name,
                image: profileImage,
                currentPassword: currentPassword || undefined, // Only send if entered
                newPassword: newPassword || undefined, // Only send if entered
                wantsWeeklyReport,
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-6 py-8 sm:px-8">
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                    <p className="mt-2 text-blue-100">Update your personal information and settings</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Image */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
                                    <div className="relative group">
                                        <div className="relative w-40 h-40">
                                            <Image
                                                src={profileImage || `https://ui-avatars.com/api/?name=${name ? encodeURIComponent(name) : 'User'}`}
                                                alt="Profile Preview"
                                                fill
                                                className="rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition"
                                            />
                                            <label
                                                htmlFor="fileInput"
                                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <div className="text-white text-sm font-medium flex flex-col items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>Change Photo</span>
                                                </div>
                                            </label>
                                        </div>
                                        <input id="fileInput" type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                                    </div>
                                    <p className="mt-4 text-sm text-gray-500">
                                        Recommended: Square image, at least 400x400px
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="font-medium">Profile Tips</h3>
                                    </div>
                                    <ul className="mt-3 text-sm text-blue-600 space-y-2">
                                        <li>• Use a clear, professional photo</li>
                                        <li>• Keep your name up to date</li>
                                        <li>• Regularly update your password</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Personal Information Section */}
                            <div className="bg-white rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            value={user.email}
                                            disabled
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Email cannot be changed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className="bg-white rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Weekly Mood Report</label>
                                            <p className="text-sm text-gray-500">Receive a weekly summary of your mood entries via email.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={wantsWeeklyReport}
                                                onChange={(e) => setWantsWeeklyReport(e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="bg-white rounded-xl">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone Section */}
                            <div className="bg-red-50 rounded-xl p-6 border border-red-100 mt-8">
                                <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
                                <p className="text-sm text-red-700 mb-6">
                                    {deleteRequested 
                                        ? "You have requested to delete your account. An administrator will review and approve this request shortly."
                                        : "Once you delete your account, there is no going back. Please be certain."}
                                </p>
                                
                                <button
                                    type="button"
                                    onClick={handleDeleteRequestToggle}
                                    className={`px-4 py-2 font-medium rounded-lg transition-all ${
                                        deleteRequested 
                                            ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                                            : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                                    }`}
                                >
                                    {deleteRequested ? "Cancel Deletion Request" : "Request Account Deletion"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className={`flex-1 px-6 py-3 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02]
                                ${isUpdating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isUpdating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving Changes...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all transform hover:scale-[1.02]"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
