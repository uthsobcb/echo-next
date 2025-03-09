import ChatBox from "./ChatComponent";
import SubscriptionWarning from "@/app/components/SubscriptionWarning"
import { auth } from "auth";
export default async function page() {
    const session = await auth();
    const isSubscribe = session?.user?.subscription === "free" ? false : true;
    const user = session?.user;
    if (!isSubscribe) {
        return <ChatBox user={user} />
    }
    else return <SubscriptionWarning />
}
