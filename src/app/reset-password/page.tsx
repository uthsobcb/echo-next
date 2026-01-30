"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams) {
            const tokenParam = searchParams.get("token");
            setToken(tokenParam || "");
            if (!tokenParam) {
                setMessage("Invalid or expired token.");
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setMessage(data.message);
        setLoading(false);

        if (res.ok) {
            setTimeout(() => router.push("/login"), 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold">Reset Your Password</h2>
            {message && <p className="mt-2 text-green-500">{message}</p>}
            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 mt-4 w-full rounded disabled:opacity-50"
                    disabled={loading || !token}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
