"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SignOut() {
    const router = useRouter();

    async function handleSignOut() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    }

    return (
        <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start md:justify-center text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </Button>
    );
}