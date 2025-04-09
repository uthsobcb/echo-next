"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);


    const onSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await axios.post("/api/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSuccess(response.data.message);
            toast.success("Signup successful. Redirecting to login page...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed");
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <form onSubmit={onSignup} className="w-full">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6 sm:p-8">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    Create your account
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Start your journaling journey with Echo
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-900">
                                        Name
                                    </label>
                                    <input
                                        name="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Mr. Pico"
                                        type="text"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-900">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="pico@mail.com"
                                        type="email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1.5 text-sm font-medium text-gray-900">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                    />
                                </div>
                                <div className="flex items-start space-x-2 mt-4">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        className="mt-1"
                                        checked={agreeChecked}
                                        onChange={(e) => setAgreeChecked(e.target.checked)}
                                    />
                                    <label htmlFor="agree" className="text-sm text-gray-700">
                                        I agree to the{" "}
                                        <a
                                            href="/legal/privacy-policy"
                                            className="text-blue-600 underline hover:text-blue-800"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Privacy Policy
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="/legal/tnc"
                                            className="text-blue-600 underline hover:text-blue-800"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Terms & Conditions
                                        </a>.
                                    </label>
                                </div>
                            </div>
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={!agreeChecked}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
