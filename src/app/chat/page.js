import ChatBox from "./ChatComponent";
import SubscriptionWarning from "@/app/components/SubscriptionWarning"
import { auth } from "auth";
export default async function page() {
    const session = await auth();
    const isSubscribe = session?.user?.subscription === "free" ? false : true;

    if (!isSubscribe) {
        return <ChatBox />
    }
    else return <SubscriptionWarning />
}
