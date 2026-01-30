import ChatBox from "./ChatComponent";
import { auth } from "@/app/lib/auth";

export const dynamic = 'force-dynamic';

export default async function page() {
    const session = await auth();
    const user = session?.user;

    const chatUser = user ? {
        name: user.name as string,
        email: user.email as string,
        image: user.image as string
    } : null;

    return <ChatBox user={chatUser} />;
}
