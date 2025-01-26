import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // mood: {
        //     label: {
        //         type: String,
        //         required: true
        //     },
        //     score: {
        //         type: Number,
        //         required: true
        //     },
        //     comment: {
        //         type: String,
        //         required: true
        //     }
        // },
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
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Mood = mongoose.models.Mood || mongoose.model("Mood", MoodSchema);

export default Mood;
