import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
    userId: mongoose.Types.ObjectId;
    todo: string;
    type?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema = new mongoose.Schema<ITodo>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        todo: {
            type: String,
        },
        type: {
            type: String,
            default: "todo",
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "completed", "in-progress"],
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Todo = (mongoose.models.Todo as mongoose.Model<ITodo>) ||
    mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
