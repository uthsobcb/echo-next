import mongoose, { Schema, model, models, Document } from "mongoose";

export type RiskSeverity = "low" | "moderate" | "high";

export interface IRiskAlert extends Document {
    userId: mongoose.Types.ObjectId;
    moodEntryId: mongoose.Types.ObjectId;
    severity: RiskSeverity;
    indicators: string[];
    triggerType: "immediate" | "threshold";
    notifiedUser: boolean;
    acknowledgedByAdmin: boolean;
    acknowledgedAt?: Date;
    createdAt: Date;
}

const RiskAlertSchema = new Schema<IRiskAlert>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    moodEntryId: {
        type: Schema.Types.ObjectId,
        ref: "Mood",
        required: true,
    },
    severity: {
        type: String,
        enum: ["low", "moderate", "high"],
        required: true,
    },
    // Structured category tags only (e.g. "passive-ideation") — never raw journal excerpts,
    // to keep this admin-visible collection free of verbatim sensitive content.
    indicators: {
        type: [String],
        default: [],
    },
    triggerType: {
        type: String,
        enum: ["immediate", "threshold"],
        required: true,
    },
    notifiedUser: {
        type: Boolean,
        default: false,
    },
    acknowledgedByAdmin: {
        type: Boolean,
        default: false,
        index: true,
    },
    acknowledgedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const RiskAlertModel = models.RiskAlert || model<IRiskAlert>("RiskAlert", RiskAlertSchema);
export default RiskAlertModel;
