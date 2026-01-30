'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className='flex-1 bg-blue-600 px-4 py-2.5 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center'
        >
            <div className='flex items-center justify-center gap-2'>
                <LogOut className="w-4 h-4" />
                Sign Out
            </div>
        </button>
    );
}
