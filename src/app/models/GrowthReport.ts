import mongoose, { Document } from "mongoose";

export interface IGrowthReport extends Document {
    userId: mongoose.Types.ObjectId;
    period: "weekly" | "monthly";
    periodStart: Date;
    periodEnd: Date;
    encryptedData: string;
    createdAt: Date;
    updatedAt: Date;
}

const GrowthReportSchema = new mongoose.Schema<IGrowthReport>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        period: { type: String, enum: ["weekly", "monthly"], required: true },
        periodStart: { type: Date, required: true },
        periodEnd: { type: Date, required: true },
        encryptedData: { type: String, required: true },
    },
    { timestamps: true },
);

GrowthReportSchema.index({ userId: 1, createdAt: -1 });

const GrowthReport = (mongoose.models.GrowthReport as mongoose.Model<IGrowthReport>) ||
    mongoose.model<IGrowthReport>("GrowthReport", GrowthReportSchema);

export default GrowthReport;
