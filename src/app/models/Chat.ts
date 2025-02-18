import mongoose, { Schema, model, Model } from "mongoose";

interface IChat {
    userId: mongoose.Schema.Types.ObjectId;
    message: string;
    reply: string;
    createdAt: Date;
    apiKey: string;
}

const ChatSchema = new Schema<IChat>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        reply: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        apiKey: {
            type: String,
        },
    },
    { timestamps: true }
);

const Chat = model("Chat", ChatSchema);
export default Chat as Model<IChat>;