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
        enum: ['free', 'plus'],
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
    }
});

const UserModel = models.User || model("User", UserSchema);
export default UserModel as mongoose.Model<IUser>;
