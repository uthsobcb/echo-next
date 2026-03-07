import mongoose, { Schema, model, models } from "mongoose";

interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
    subscription: string;
    badge: string[];
    resetPasswordCode?: string;
    resetPasswordExpires?: Date;
    wantsWeeklyReport?: boolean;
    currentStreak: number;
    maxStreak: number;
    totalXp: number;
    lastEntryDate?: Date;
    timezone: string;
    pushToken?: string;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    subscription: {
        type: String,
        enum: ['free', 'plus', 'admin'],
        default: 'free'
    },
    badge: {
        type: [String],
        enum: [
            "Echo Sunshine",
            "Pen Whisperer",
            "Mindful Scribe",
            "Thought Architect",
            "Guardian of Inked Wisdom"
        ],
        default: ["Echo Sunshine"]
    },
    resetPasswordCode: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        required: false,
        default: null
    },
    wantsWeeklyReport: {
        type: Boolean,
        default: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    maxStreak: {
        type: Number,
        default: 0
    },
    totalXp: {
        type: Number,
        default: 0
    },
    lastEntryDate: {
        type: Date,
        default: null
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    pushToken: {
        type: String,
        default: null
    }
});

const UserModel = mongoose.models.User || model("User", UserSchema);
export default UserModel as mongoose.Model<IUser>;
