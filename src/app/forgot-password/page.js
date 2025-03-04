"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter code & new password

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setMessage(data.message);
        if (res.ok) setStep(2); // Move to step 2 if email is valid
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, password }),
        });

        const data = await res.json();
        setMessage(data.message);
        setLoading(false);

        if (res.ok) {
            setTimeout(() => (window.location.href = "/login"), 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
            {message && <p className={`mt-2 text-center ${res.ok ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

            {step === 1 ? (
                <form onSubmit={handleSendCode} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Verification Code</label>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 w-full rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}
