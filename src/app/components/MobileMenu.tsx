"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOut from "./SignOut";
import { Brain, PenTool, Menu, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";

export default function MobileMenu({ session, userData }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6 text-gray-700" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
                <SheetHeader className="text-left mb-6">
                    <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Echo
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                    {session?.user && userData ? (
                        <>
                            <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                                    <Image
                                        src={userData.image || "/assets/logo.png"}
                                        alt={userData.name || "User"}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{userData.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-[150px]">{userData.email}</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <SheetClose asChild>
                                    <Link href="/entry">
                                        <Button variant="ghost" className="w-full justify-start text-lg h-12 gap-3 font-normal">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <PenTool className="w-5 h-5" />
                                            </div>
                                            New Entry
                                        </Button>
                                    </Link>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Link href="/memory">
                                        <Button variant="ghost" className="w-full justify-start text-lg h-12 gap-3 font-normal">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                <Brain className="w-5 h-5" />
                                            </div>
                                            Memories
                                        </Button>
                                    </Link>
                                </SheetClose>

                                <div className="h-px bg-gray-100 my-2" />

                                <SheetClose asChild>
                                    <Link href="/profile">
                                        <Button variant="ghost" className="w-full justify-start text-lg h-12 gap-3 font-normal">
                                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                                                <Image
                                                    src="/assets/logo.png"
                                                    width={20}
                                                    height={20}
                                                    alt="Echo"
                                                    className="opacity-50"
                                                />
                                            </div>
                                            Profile
                                        </Button>
                                    </Link>
                                </SheetClose>

                                <div className="mt-4">
                                    <SignOut />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 mt-4">
                            <SheetClose asChild>
                                <Link href="/login">
                                    <Button variant="outline" className="w-full h-12 text-base gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Log In
                                    </Button>
                                </Link>
                            </SheetClose>

                            <SheetClose asChild>
                                <Link href="/register">
                                    <Button className="w-full h-12 text-base gap-2 shadow-lg shadow-indigo-200">
                                        <UserPlus className="w-4 h-4" />
                                        Create Account
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
