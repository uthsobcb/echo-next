import mongoose from 'mongoose';

declare global {
    var mongoose: { conn: any; promise: any } | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const mCached = cached;

export async function connect() {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        throw new Error('MONGODB_URI environment variable is required');
    }

    if (mCached.conn) {
        return mCached.conn;
    }

    if (!mCached.promise) {
        const opts = {
            bufferCommands: false,
        };

        mCached.promise = mongoose.connect(mongodbUri, opts).then((mongoose) => {
            console.log("MongoDB connected successfully");
            return mongoose;
        });
    }

    try {
        mCached.conn = await mCached.promise;
    } catch (e) {
        mCached.promise = null;
        console.error("MongoDB connection error:", e);
        throw e;
    }

    return mCached.conn;
}
