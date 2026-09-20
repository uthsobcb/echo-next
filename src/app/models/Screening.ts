import mongoose, { Document } from "mongoose";

export interface IScreening extends Document {
    userId: mongoose.Types.ObjectId;
    type: "phq9" | "gad7";
    answers: number[];
    totalScore: number;
    severity: "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
    createdAt: Date;
}

const ScreeningSchema = new mongoose.Schema<IScreening>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["phq9", "gad7"],
            required: true,
        },
        answers: {
            type: [Number],
            required: true,
        },
        totalScore: {
            type: Number,
            required: true,
        },
        severity: {
            type: String,
            enum: ["minimal", "mild", "moderate", "moderately-severe", "severe"],
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

ScreeningSchema.index({ userId: 1, type: 1, createdAt: -1 });

const Screening =
    (mongoose.models.Screening as mongoose.Model<IScreening>) ||
    mongoose.model<IScreening>("Screening", ScreeningSchema);

export default Screening;
