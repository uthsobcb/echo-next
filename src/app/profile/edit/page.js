import { auth } from "auth";
import EditProfile from "./EditProfile";

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return <p className="text-center mt-10 text-red-500">Unauthorized. Please log in.</p>;
    }

    return <EditProfile user={user} />;
}
