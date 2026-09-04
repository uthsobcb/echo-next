
import Image from 'next/image';
import { auth, Session } from '@/app/lib/auth';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import UserMenu from './UserMenu';
import { Github } from 'lucide-react';

function UserMenuSkeleton() {
    return (
        <div className="flex items-center gap-2 animate-pulse">
            <div className="w-20 h-10 bg-gray-100 rounded-full" />
            <div className="w-24 h-10 bg-gray-100 rounded-full" />
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <div className="w-32 h-10 bg-gray-100 rounded-full" />
        </div>
    )
}

export default async function NavBar() {
    const session = await auth();

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
                                sizes="32px"
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
                    <Link
                        href="https://github.com/uthsobcb/echo-next"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Echo on GitHub"
                        className="flex items-center justify-center size-9 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        <Github className="size-5" />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1">
                    {session?.user ? (
                        <Suspense fallback={<UserMenuSkeleton />}>
                            <UserMenu session={session as Session} />
                        </Suspense>
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
                    <MobileMenu session={session} userData={session?.user ?? null} />
                </div>
            </nav>
        </header>
    );
}
