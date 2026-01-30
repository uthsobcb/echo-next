import mongoose, { Schema, model, models } from "mongoose";

export interface IPost {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: string;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true,
        default: "Admin"
    },
    tags: {
        type: [String],
        default: []
    },
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save hook to generate slug if not provided? 
// For now, we'll let the admin handle slugs or generate them in the API.

const PostModel = mongoose.models.Post || model("Post", PostSchema);
export default PostModel as mongoose.Model<IPost>;
