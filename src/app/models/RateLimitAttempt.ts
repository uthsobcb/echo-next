import mongoose, { Schema, model, models } from "mongoose";

interface IRateLimitAttempt {
    key: string;
    createdAt: Date;
    expiresAt: Date;
}

const RateLimitAttemptSchema = new Schema<IRateLimitAttempt>({
    key: {
        type: String,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

// TTL index: MongoDB removes each document once its own expiresAt passes,
// letting one collection serve rate-limit windows of any length.
RateLimitAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitAttemptModel = models.RateLimitAttempt || model<IRateLimitAttempt>("RateLimitAttempt", RateLimitAttemptSchema);
export default RateLimitAttemptModel as mongoose.Model<IRateLimitAttempt>;
