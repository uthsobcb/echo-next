"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
                toast.error("Your mail or password is incorrect. Please Try with correct mail and password.");

            } else {
                router.push("/entry", { replace: true });
                router.refresh();

            }
        } catch (error) {
            setError("Login failed. Please try again.");
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setLoading(true);
        signIn("google", { callbackUrl: "/entry" });
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 ">
            <form onSubmit={onSubmit} className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-md border p-6 sm:p-8 space-y-6">
                    <div className="space-y-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Login
                        </h1>
                        <p className="text-sm text-gray-500">
                            Welcome back! Please login to your account.
                        </p>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="pico@mail.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="ml-3 text-sm">
                                <label className="font-light text-gray-500">
                                    <Link
                                        href="/forgot-password"
                                        className="font-medium text-primary-600 hover:underline text-primary-500"
                                    >
                                        Forgot Password?
                                    </Link>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2 mt-4">
                            <input
                                type="checkbox"
                                id="agree"
                                className="mt-1"
                                defaultChecked
                                disabled
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

                        <button
                            className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        {/* <div className="flex items-center my-4">
                                <hr className="w-full border-gray-300" />
                                <span className="px-2 text-gray-500">OR</span>
                                <hr className="w-full border-gray-300" />
                            </div> */}

                        {/* <button
                                className="w-full bg-violet-500  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-red-800 text-white flex items-center justify-center gap-2"
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <Image src="/assets/google.svg" alt="Google" width={24} height={24} />
                                Sign in with Google
                            </button> */}

                        <p className="text-sm text-gray-500 mt-2">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
