import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ISpaceMessage extends Document {
    content: string;
    author: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const SpaceMessageSchema = new Schema<ISpaceMessage>({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, {
    timestamps: true
});

const SpaceMessageModel = models.SpaceMessage || model<ISpaceMessage>("SpaceMessage", SpaceMessageSchema);
export default SpaceMessageModel;
