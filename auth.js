import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongodbClientPromise from "@/app/lib/mongodbClientPromise"
import CredentialProvider from "next-auth/providers/credentials";
import UserModel from "@/app/models/User";
import { connect } from '@/app/lib/mongodb';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: MongoDBAdapter(mongodbClientPromise, { databaseName: "echo" }),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {

                if (credentials === null) return null;
                await connect();
                try {
                    const user = await UserModel.findOne({ email: credentials.email });
                    if (user) {
                        const isMatch = user?.password === credentials.password;
                        if (isMatch) {
                            return user;
                        } else {
                            throw new Error("Invalid password");
                        }
                    }
                    else {
                        throw new Error("User not found");
                    }

                } catch (error) {
                    throw error;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
})