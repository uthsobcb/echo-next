import mongoose, { Document } from "mongoose";

export interface IGrowthExperiment extends Document {
    userId: mongoose.Types.ObjectId;
    encryptedData: string;
    status: "active" | "completed" | "stopped";
    startedAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GrowthExperimentSchema = new mongoose.Schema<IGrowthExperiment>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        encryptedData: { type: String, required: true },
        status: { type: String, enum: ["active", "completed", "stopped"], default: "active", index: true },
        startedAt: { type: Date, default: Date.now },
        endsAt: { type: Date, required: true },
    },
    { timestamps: true },
);

GrowthExperimentSchema.index({ userId: 1, status: 1, createdAt: -1 });

const GrowthExperiment = (mongoose.models.GrowthExperiment as mongoose.Model<IGrowthExperiment>) ||
    mongoose.model<IGrowthExperiment>("GrowthExperiment", GrowthExperimentSchema);

export default GrowthExperiment;
