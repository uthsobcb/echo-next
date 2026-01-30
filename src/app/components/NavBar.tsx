
import Image from 'next/image';
import { auth } from '@/app/lib/auth';
import Link from 'next/link';
import SignOut from './SignOut';
import MobileMenu from './MobileMenu';
import axios from 'axios';
import { Brain, PenTool } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default async function NavBar() {
    const session = await auth();
    let userData = null;

    if (session?.accessToken) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile`, {
                headers: { Authorization: `Bearer ${session.accessToken}` },
                withCredentials: true,
            });
            userData = response.data.user;
        } catch (error) {
            console.log("Error fetching profile:", error.response?.data || error.message);
        }
    }
    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="flex items-center justify-between w-full max-w-5xl p-2 pl-6 pr-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 pointer-events-auto transition-all duration-300 hover:shadow-xl hover:bg-white/90">

                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src="/assets/logo.png"
                                alt="Echo Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Echo
                        </span>
                    </Link>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-500 bg-indigo-50 rounded-full border border-indigo-100 uppercase">
                        Beta
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1">
                    {session?.user ? (
                        <>
                            <Link href="/entry">
                                <Button variant="ghost" className="rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 gap-2">
                                    <PenTool className="w-4 h-4" />
                                    Entry
                                </Button>
                            </Link>

                            <Link href="/memory">
                                <Button variant="ghost" className="rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 gap-2">
                                    <Brain className="w-4 h-4" />
                                    Memory
                                </Button>
                            </Link>

                            <div className="w-px h-6 bg-gray-200 mx-2" />

                            <Link href="/profile">
                                <Button variant="ghost" className="rounded-full pl-2 pr-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 gap-2">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-indigo-200">
                                        <Image
                                            src={userData?.image || "/assets/logo.png"}
                                            alt={userData?.name || "User"}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[100px]">{userData?.name?.split(' ')[0]}</span>
                                </Button>
                            </Link>

                            <div className='ml-1'>
                                <SignOut />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg">
                                    Sign Up Free
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <div className="lg:hidden">
                    <MobileMenu session={session} userData={userData} />
                </div>
            </nav>
        </header>
    );
}
