'use client';
import { useState } from "react";
import Image from "next/image";

export default function EditProfile() {
    const [profileImage, setProfileImage] = useState("/default-profile.png");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-md border p-6 rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h1>

            <form className="space-y-6">
                <div className="text-center">
                    <Image
                        src={profileImage}
                        alt="Profile Preview"
                        width={96}
                        height={96}
                        className="rounded-full mx-auto border shadow-sm"
                    />
                    <label className="block font-medium text-gray-700 mt-2">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 mt-1
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                        onChange={handleImageChange}
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        className="border w-full p-3 rounded-md focus:ring focus:ring-blue-300 outline-none"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="border w-full p-3 rounded-md focus:ring focus:ring-blue-300 outline-none"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Receive Notifications</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="notification"
                                value="yes"
                                className="form-radio text-blue-600"
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="notification"
                                value="no"
                                className="form-radio text-blue-600"
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        type="button"
                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300"
                    >
                        Save
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
