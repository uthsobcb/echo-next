import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

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
    if (mCached.conn) {
        return mCached.conn;
    }

    if (!mCached.promise) {
        const opts = {
            bufferCommands: false,
            strictQuery: false,
        };

        mCached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
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