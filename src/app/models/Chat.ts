import mongoose, { Document, Model } from "mongoose";

// Drop the existing collection to remove old schema constraints
if (mongoose.models.Chat) {
    delete mongoose.models.Chat;
}

interface IMessage {
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

interface IChat extends Document {
    userId: string;
    messages: IMessage[];
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    strict: false // Allow additional fields temporarily for backward compatibility
});

// Update the updatedAt timestamp on each save
chatSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat; 