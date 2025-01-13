'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header className="flex items-center justify-center m-3">
            <nav className="flex items-center justify-around lg:w-1/3 w-full border rounded-xl p-4 bg-gray-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <a href="/" className="flex justify-center">
                        <Image src="/assets/logo.png" alt="Logo" width={46} height={100} />
                    </a>
                    <a href="/" className="hidden lg:block">
                        <h1 className="text-cyan-900 font-bold text-lg">Echo</h1>
                    </a>
                </div>
                <div>
                    {isLoggedIn ? (
                        <a
                            href="/my"
                            className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium"
                            aria-label="Account Page"
                        >
                            Account
                        </a>
                    ) : (
                        <a
                            href="/login"
                            className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium"
                            aria-label="Login Page"
                        >
                            Login
                        </a>
                    )}
                </div>
            </nav>
        </header>
    );
}
