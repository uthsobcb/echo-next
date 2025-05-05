import mongoose, { Document, Model } from "mongoose";

if (mongoose.models.Chat) {
    delete mongoose.models.Chat;
}

export interface IMessage {
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

interface IChat extends Document {
    userId: string;
    messages: IMessage[];
    threadSummary?: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'ai']
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    messages: {
        type: [messageSchema],
        default: []
    },
    threadSummary: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

chatSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
