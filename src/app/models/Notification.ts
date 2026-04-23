import mongoose, { Schema, model, models, Document } from "mongoose";

export enum NotificationType {
    JOURNAL_REMINDER = "JOURNAL_REMINDER",
    STREAK_RECOVERY = "STREAK_RECOVERY",
    TODO_REMINDER = "TODO_REMINDER",
    MOTIVATION = "MOTIVATION",
    MOOD_CHECKIN = "MOOD_CHECKIN",
    CUSTOM = "CUSTOM",
    SYSTEM = "SYSTEM"
}

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId | null;
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, any>;
    scheduledAt: Date;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        default: {}
    },
    scheduledAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    sentAt: {
        type: Date,
        default: null,
        index: true
    }
}, {
    timestamps: true
});

const NotificationModel = models.Notification || model<INotification>("Notification", NotificationSchema);
export default NotificationModel;
