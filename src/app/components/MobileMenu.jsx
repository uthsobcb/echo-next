'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOut from "./SignOut";
import { Brain, PenIcon } from "lucide-react";

export default function MobileMenu({ session, userData }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="lg:hidden">
            <button
                onClick={toggleMenu}
                className="p-4 cursor-pointer flex justify-end"
            >
                <div className="w-8 h-8 flex flex-col justify-center gap-1.5">
                    <span className={`block h-0.5 w-8 bg-gray-500 transform transition-all duration-300 
                        ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 w-6 bg-gray-500 transition-all duration-300 
                        ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-4 bg-gray-500 transform transition-all duration-300 
                        ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50 animate-fadeIn"
                    onClick={closeMenu}
                >
                    <div
                        className="h-full w-[80%] max-w-sm bg-gray-900 shadow-2xl flex flex-col animate-slideRight"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end p-4">
                            <button
                                onClick={closeMenu}
                                className="text-gray-400 hover:text-white p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {userData.name ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                                        <Image
                                            src={userData?.image}
                                            alt={session?.user?.name}
                                            width={50}
                                            height={50}
                                            unoptimized
                                            className="rounded-full border-2 border-gray-700"
                                        />
                                        <div>
                                            <div className="text-white font-medium">{userData?.name}</div>
                                            <div className="text-gray-400 text-sm">Logged in</div>
                                        </div>
                                    </div>

                                    <nav className="space-y-2">
                                        <Link
                                            href="/entry"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg
                                                     hover:bg-gray-800 transition-all duration-200"
                                        >
                                            <PenIcon width={24} height={24} />

                                            New Entry
                                        </Link>
                                        <Link href="/memory" className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg
                                                     hover:bg-gray-800 transition-all duration-200"
                                        >
                                            <Brain width={24} height={24} />

                                            Memory
                                        </Link>

                                        <Link
                                            href="/profile"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg
                                                     hover:bg-gray-800 transition-all duration-200"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                    </nav>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block w-full text-center text-white bg-gray-800 hover:bg-gray-700
                                                 px-4 py-3 rounded-lg transition-all duration-200"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={closeMenu}
                                        className="block w-full text-center text-gray-300 border border-gray-700
                                                 hover:text-white hover:border-gray-600 px-4 py-3 rounded-lg
                                                 transition-all duration-200"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {userData.name && (
                            <div className="p-6 border-t border-gray-700">
                                <SignOut />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
