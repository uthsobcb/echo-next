import mongoose, { Document } from "mongoose";

export interface IGrowthProfile extends Document {
    userId: mongoose.Types.ObjectId;
    encryptedData: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

const GrowthProfileSchema = new mongoose.Schema<IGrowthProfile>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
        encryptedData: { type: String, required: true },
        version: { type: Number, default: 1 },
    },
    { timestamps: true },
);

const GrowthProfile = (mongoose.models.GrowthProfile as mongoose.Model<IGrowthProfile>) ||
    mongoose.model<IGrowthProfile>("GrowthProfile", GrowthProfileSchema);

export default GrowthProfile;
