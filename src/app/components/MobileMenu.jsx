'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignOut from "./SignOut";

export default function MobileMenu({ session, userData }) {
    const [isOpen, setIsOpen] = useState(false);
    // const [user, setUser] = useState(userData);
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="lg:hidden">

            <button onClick={toggleMenu} className="p-4 cursor-pointer flex justify-end">
                <Image src="/assets/menu.svg" alt="Menu" width={36} height={36} className="transition-transform duration-300" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeMenu}>
                    <div className="bg-gray-50 border rounded-xl shadow-lg flex flex-col items-center gap-6 p-8 w-4/5 max-w-md relative text-center" onClick={(e) => e.stopPropagation()}>
                        {userData.name ? (
                            <div className="flex flex-col items-center gap-6 w-full">
                                <Link href="/entry" onClick={closeMenu} className="flex items-center gap-3 text-cyan-900 hover:text-cyan-700 font-semibold text-base w-full justify-center py-3">
                                    <Image src="/assets/pen.svg" alt="Entry" width={26} height={26} />
                                    Entry
                                </Link>
                                <Link href="/profile" onClick={closeMenu} className="flex items-center gap-3 text-cyan-900 hover:text-cyan-700 font-semibold text-base w-full justify-center py-3">
                                    <Image src={userData?.image} alt={session?.user?.name} width={36} height={36} unoptimized className="rounded-full border border-gray-300 shadow-sm" />
                                    {userData?.name}
                                </Link>
                                <SignOut />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 w-full items-center">
                                <Link href="/login" onClick={closeMenu} className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-base bg-cyan-100 px-8 py-3 rounded-xl shadow-sm hover:bg-cyan-200 w-4/5 text-center">
                                    Login
                                </Link>
                                <Link href="/register" onClick={closeMenu} className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-base bg-cyan-100 px-8 py-3 rounded-xl shadow-sm hover:bg-cyan-200 w-4/5 text-center">
                                    Register
                                </Link>
                            </div>
                        )}

                        <button onClick={closeMenu} className="absolute top-4 right-4 text-cyan-900 hover:text-cyan-700 font-semibold cursor-pointer text-lg">
                            <Image src="/assets/cross.svg" alt="Menu" width={32} height={32} className="transition-transform duration-300" />

                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
