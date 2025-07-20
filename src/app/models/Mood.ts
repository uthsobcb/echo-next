import mongoose from "mongoose";

interface IMood {
    userId: mongoose.Schema.Types.ObjectId;
    mood: string;
    score: number;
    comment: string;
    content: string;
    imgUrl: string;
    createdAt: Date;
    todo?: [String];

}

const MoodSchema = new mongoose.Schema<IMood>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // mood: {
        //     label: {
        //         type: String,
        //         // required: true
        //     },
        //     score: {
        //         type: Number,
        //         // required: true
        //     },
        //     comment: {
        //         type: String,
        //         // required: true
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

const Mood = mongoose.models.Mood || mongoose.model("Mood", MoodSchema);

export default Mood as mongoose.Model<IMood>;
