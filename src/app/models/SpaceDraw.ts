import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISpaceDraw extends Document {
    user: mongoose.Types.ObjectId | string;
    timestamp: Date;
    contributionId?: mongoose.Types.ObjectId | string; // Optional: link to the message that unlocked this draw
}

const SpaceDrawSchema = new Schema<ISpaceDraw>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    contributionId: {
        type: Schema.Types.ObjectId,
        ref: "SpaceMessage",
        required: false
    }
});

// Index for performance on range queries (e.g., last 5 minutes)
SpaceDrawSchema.index({ user: 1, timestamp: -1 });

const SpaceDrawModel = models.SpaceDraw || model<ISpaceDraw>("SpaceDraw", SpaceDrawSchema);
export default SpaceDrawModel;
