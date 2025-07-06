

import Image from 'next/image';
import { signIn, signOut, auth } from 'auth';
import Link from 'next/link';
import SignOut from './SignOut';
import MobileMenu from './MobileMenu';
import axios from 'axios';
import { Brain } from 'lucide-react';
export default async function NavBar() {
    const session = await auth();
    let userData = [];
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
            withCredentials: true,
        });
        userData = response.data.user;
    } catch (error) {
        console.log("Error fetching entries:", error.response?.data || error.message);
    }
    return (
        <header className="flex items-center justify-center m-3">
            <nav className="flex items-center justify-between lg:w-2/3 w-full border rounded-xl p-4 bg-gray-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex justify-center">
                        <Image src="/assets/logo.png" alt="Logo" width={46} height={100} />
                    </Link>
                    <Link href="/" className="block">
                        <span className="text-xl font-bold text-indigo-500">Echo</span>
                    </Link>
                </div>

                <MobileMenu session={session} userData={userData} />
                <div className="items-center space-x-4 p-2 rounded-lg lg:block hidden">
                    {session?.user ? (
                        <div className="flex items-center space-x-3">
                            <div className='flex items-center mx-2'>
                                <Image src='/assets/pen.svg' alt="Entry" width={24} height={24} />

                                <Link href="/entry" className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm mx-1">
                                    Entry
                                </Link>
                            </div>
                            <div className='flex items-center mx-2'>
                                <Brain width={24} height={24} />
                                <Link href="/memory" className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm mx-1">
                                    Memory
                                </Link>
                            </div>
                            <Link
                                href="/profile"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm flex items-center gap-2"
                                aria-label="Account Page"
                            >
                                <Image
                                    src={userData?.image}
                                    alt={userData?.name}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="rounded-full border border-gray-300 shadow-sm"
                                />
                                {userData?.name}
                            </Link>
                            <SignOut />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                                aria-label="Login Page"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300"
                                aria-label="Register Page"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
