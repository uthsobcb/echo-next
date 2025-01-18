

import Image from 'next/image';
import { signIn, signOut, auth } from 'auth';
import Link from 'next/link';

export default async function NavBar() {
    const session = await auth();
    console.log(session);

    return (
        <header className="flex items-center justify-center m-3">
            <nav className="flex items-center justify-around lg:w-1/3 w-full border rounded-xl p-4 bg-gray-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex justify-center">
                        <Image src="/assets/logo.png" alt="Logo" width={46} height={100} />
                    </Link>
                    <Link href="/" className="hidden lg:block">
                        <h1 className="text-cyan-900 font-bold text-lg">Echo</h1>
                    </Link>
                </div>
                <div>
                    {
                        session?.user ? (
                            <Link
                                href="/profile"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium p-2"
                                aria-label="Account Page"
                            >
                                {session?.user?.name}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="text-cyan-900 hover:text-cyan-700 transition duration-300 font-medium"
                                aria-label="Login Page"
                            >
                                Login
                            </Link>
                        )}
                </div>
            </nav>
        </header>
    );
}
