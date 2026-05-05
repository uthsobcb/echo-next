"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        setToken(tokenParam || "");
        if (!tokenParam) {
            setMessage("Invalid or expired reset link.");
            setIsSuccess(false);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setMessage("");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setMessage(data.message);
        setIsSuccess(res.ok);
        setLoading(false);

        if (res.ok) {
            setTimeout(() => router.push("/login"), 2000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Set New Password
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-8">
                        Choose a strong password for your account.
                    </p>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-center text-sm font-medium ${isSuccess
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {message}
                            {isSuccess && (
                                <p className="text-xs mt-1 opacity-75">Redirecting you to login...</p>
                            )}
                        </div>
                    )}

                    {!token ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm mb-4">
                                This link is invalid or has expired. Please request a new one.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200"
                            >
                                Request New Link
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300
                                             text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500
                                             focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-gray-400 mt-1.5">At least 8 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3
                                         rounded-lg transition-colors duration-200 disabled:opacity-50
                                         disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Resetting Password...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
