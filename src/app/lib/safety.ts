import mongoose from "mongoose";
import Mood from "@/app/models/Mood";
import UserModel from "@/app/models/User";
import RiskAlertModel, { RiskSeverity } from "@/app/models/RiskAlert";
import NotificationModel, { NotificationType } from "@/app/models/Notification";
import { sendPushNotification } from "@/lib/expo-notifications";

const THRESHOLD_COUNT = 3;
const THRESHOLD_WINDOW_DAYS = 14;
const NOTIFY_COOLDOWN_HOURS = 6;

const CRISIS_RESOURCE_BODY =
    "It sounds like things have been really heavy lately. You don't have to go through this alone — " +
    "free, confidential support is available 24/7 at findahelpline.com, or call/text 988 in the US. " +
    "If you're in immediate danger, please contact your local emergency services right now.";

/**
 * Records a detected risk severity for a journal entry and, if warranted, notifies the user.
 * Fails soft: any error here is logged, not thrown, so it never breaks the entry-save flow.
 */
export async function recordRiskFlagAndMaybeNotify(params: {
    userId: string;
    moodEntryId: mongoose.Types.ObjectId;
    severity: Exclude<RiskSeverity, never> | "none";
    indicators: string[];
}) {
    const { userId, moodEntryId, severity, indicators } = params;
    if (severity === "none") return;

    try {
        const user = await UserModel.findById(userId);
        if (!user) return;

        const cooldownActive =
            !!user.lastRiskNotifiedAt &&
            Date.now() - user.lastRiskNotifiedAt.getTime() < NOTIFY_COOLDOWN_HOURS * 60 * 60 * 1000;

        let shouldNotify = false;
        let triggerType: "immediate" | "threshold" = "threshold";

        if (severity === "high") {
            triggerType = "immediate";
            shouldNotify = !cooldownActive;
        } else {
            const windowStart = new Date(Date.now() - THRESHOLD_WINDOW_DAYS * 24 * 60 * 60 * 1000);
            const recentFlagCount = await Mood.countDocuments({
                userId,
                riskSeverity: { $in: ["low", "moderate", "high"] },
                createdAt: { $gte: windowStart },
            });
            triggerType = "threshold";
            shouldNotify = recentFlagCount >= THRESHOLD_COUNT && !cooldownActive;
        }

        await RiskAlertModel.create({
            userId,
            moodEntryId,
            severity,
            indicators,
            triggerType,
            notifiedUser: shouldNotify,
        });

        if (!shouldNotify) return;

        const notification = await NotificationModel.create({
            userId: new mongoose.Types.ObjectId(userId),
            title: "We're here for you",
            body: CRISIS_RESOURCE_BODY,
            type: NotificationType.WELLBEING_CHECKIN,
            data: { severity, findHelpUrl: "https://findahelpline.com" },
            scheduledAt: new Date(),
        });

        if (user.pushToken) {
            await sendPushNotification([user.pushToken], {
                title: notification.title,
                body: notification.body,
                data: notification.data,
            });
        }
        notification.sentAt = new Date();
        await notification.save();

        user.lastRiskNotifiedAt = new Date();
        await user.save();
    } catch (error) {
        console.error("Error recording risk flag / notifying user:", error);
    }
}
