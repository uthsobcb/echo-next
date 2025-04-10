import ChatBox from "./ChatComponent";
import { auth } from "auth";
export default async function page() {
    const session = await auth();

    const user = session?.user; {
        return <ChatBox user={user} />
    }
}
