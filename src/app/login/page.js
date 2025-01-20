"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
                toast.error(result.error);

            } else {
                router.push("/entry");
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
        <div className="p-12">
            <form onSubmit={onSubmit}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Login
                            </p>
                            {error && <div className="text-red-500 text-sm">{error}</div>}

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

                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <div className="flex items-center my-4">
                                <hr className="w-full border-gray-300" />
                                <span className="px-2 text-gray-500">OR</span>
                                <hr className="w-full border-gray-300" />
                            </div>

                            <button
                                className="w-full bg-violet-500  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-red-800 text-white flex items-center justify-center gap-2"
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <Image src="/assets/google.svg" alt="Google" width={24} height={24} />
                                Sign in with Google
                            </button>

                            <p className="text-sm text-gray-500 mt-2">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-blue-500 hover:underline">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
