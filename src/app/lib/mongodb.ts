import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(String(process.env.MONGO_URI));

        isConnected = true;
    } catch (error) {
        console.error(error);
    }
};