import ChatBox from "./ChatComponent";
import { auth } from "@/app/lib/auth";

export const dynamic = 'force-dynamic';

export default async function page() {
    const session = await auth();
    const user = session?.user;

    return <ChatBox user={user} />;
}
