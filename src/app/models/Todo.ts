import mongoose from "mongoose";

interface ITodo {
    userId: mongoose.Schema.Types.ObjectId;
    todo: String;
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

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default Todo as mongoose.Model<ITodo>;
