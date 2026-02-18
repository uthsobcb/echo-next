import { getUserProfile } from "@/app/lib/user-data";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, PenTool } from "lucide-react";
import SignOut from "./SignOut";
import { Session } from "@/app/lib/auth";

export default async function UserMenu({ session }: { session: Session }) {
    const userData = await getUserProfile(session.user.id);

    // Fallback if user data fetch fails but session exists (shouldn't happen often)
    const name = userData?.name || session.user.name;
    const image = userData?.image || session.user.image;

    return (
        <div className="flex items-center gap-1">
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
                            src={image || "/assets/logo.png"}
                            alt={name || "User"}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px]">{name?.split(' ')[0]}</span>
                </Button>
            </Link>

            <div className='ml-1'>
                <SignOut />
            </div>
        </div>
    );
}
