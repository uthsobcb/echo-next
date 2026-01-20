
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignOut() {
    const router = useRouter();

    async function handleSignOut() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    }

    return (
        <div className='flex justify-center w-full'>
            <button
                type="button"
                onClick={handleSignOut}
                className="py-2 p-3 rounded-md w-full sm:w-auto text-center text-cyan-900 hover:text-cyan-700 transition duration-300 font-semibold text-sm flex items-center"
            >
                <Image
                    src="/assets/signout.svg"
                    alt="sign out icon"
                    width={24}
                    height={24}
                />
                Sign Out
            </button>
        </div>
    );
}