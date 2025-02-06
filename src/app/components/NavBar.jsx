

import Image from 'next/image';
import { signIn, signOut, auth } from 'auth';
import Link from 'next/link';
import SignOut from './SignOut';
import MobileMenu from './MobileMenu';
export default async function NavBar() {
    const session = await auth();
    // console.log(session);

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

                <MobileMenu session={session} />
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
                                    src={session?.user?.image}
                                    alt={session?.user?.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-gray-300 shadow-sm"
                                />
                                {session?.user?.name}
                            </Link>
                            <div className='flex items-center gap-2'>
                                <Image src='/assets/chatbot.svg' alt="ChatBOT" width={24} height={24} />

                                <Link href="/chat" className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm">
                                    Chat
                                </Link>
                            </div>
                            <SignOut />
                        </div>
                    ) : (
                        <div className='gap-2 flex'>
                            <Link
                                href="/login"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-sm bg-cyan-100 px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-200 "
                                aria-label="Login Page"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium text-sm bg-cyan-100 px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-200"
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
