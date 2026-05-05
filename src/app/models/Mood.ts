import mongoose, { Document } from "mongoose";

export interface IMood extends Document {
    userId: mongoose.Types.ObjectId;
    mood: string;
    score: number;
    comment: string;
    content: string;
    imgUrl: string;
    createdAt: Date;
    todo?: string[];
}

const MoodSchema = new mongoose.Schema<IMood>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mood: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            default: "",
        },
        todo: {
            type: [String],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Mood = (mongoose.models.Mood as mongoose.Model<IMood>) ||
    mongoose.model<IMood>("Mood", MoodSchema);

export default Mood;
