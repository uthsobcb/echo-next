

import Image from 'next/image';
import { signIn, signOut, auth } from 'auth';
import Link from 'next/link';
import SignOut from './SignOut';
import MobileMenu from './MobileMenu';
import axios from 'axios';
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
            <nav className="flex items-center justify-around lg:w-1/3 w-full border rounded-xl p-4 bg-gray-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex justify-center">
                        <Image src="/assets/logo.png" alt="Logo" width={46} height={100} />
                    </Link>
                    <Link href="/" className="block">
                        <h1 className="text-cyan-900 font-bold text-lg">Echo</h1>
                    </Link>
                </div>

                <MobileMenu session={session} userData={userData} />
                <div className="items-center space-x-4 p-2 rounded-lg lg:block hidden">
                    {session?.user ? (
                        <div className="flex items-center space-x-3">
                            <div className='flex items-center'>
                                <Image src='/assets/pen.svg' alt="Entry" width={24} height={24} />

                                <Link href="/entry" className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm">
                                    Entry
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
                        <div className='gap-2 flex'>
                            <Link
                                href="/login"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-sm bg-cyan-100 px-4 py-2 rounded-xl shadow-sm hover:bg-cyan-200 "
                                aria-label="Login Page"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-sm bg-cyan-100 px-4 py-2 rounded-xl shadow-sm hover:bg-cyan-200"
                                aria-label="Login Page"
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
