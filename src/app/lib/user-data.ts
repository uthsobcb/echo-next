import { connect } from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";

export async function getUserProfile(userId: string) {
    try {
        await connect();
        const user = await UserModel.findOne({ _id: userId }).lean();
        if (!user) return null;

        // Convert to plain object if needed, though .lean() helps
        return {
            name: user.name,
            email: user.email,
            image: user.image,
            currentStreak: user.currentStreak,
            maxStreak: user.maxStreak,
            totalXp: user.totalXp,
            subscription: user.subscription,
            badge: user.badge,
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}
