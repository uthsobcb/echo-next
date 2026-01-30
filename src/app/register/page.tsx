"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const resUserExists = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await resUserExists.json();

            if (!resUserExists.ok) {
                setError(data.message || "Registration failed");
                toast.error(data.message || "Registration failed");
            } else {
                toast.success("Account created successfully!");
                router.push("/login");
            }
        } catch (error) {
            setError("Error during registration");
            toast.error("Error during registration");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        toast.info("Google Sign-in coming soon!");
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
            <div className="w-full max-w-md relative z-10">
                <Card className="border-white/40 shadow-2xl">
                    <CardHeader className="space-y-3 text-center">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-base">
                            Start your mindfulness journey today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-white/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-white/50"
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base shadow-lg shadow-indigo-200"
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Sign Up"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white/80 px-2 text-gray-500 backdrop-blur-sm rounded-full">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11 bg-white/50 hover:bg-white/80 border-gray-200"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <Image
                                        src="/assets/google.svg"
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        className="mr-2"
                                    />
                                    Google
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
