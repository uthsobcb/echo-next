import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongodbClientPromise from "@/app/lib/mongodbClientPromise";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/app/models/User";
import { connect } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

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
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                await connect();

                try {
                    const user = await UserModel.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    // Compare hashed password
                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!isMatch) {
                        throw new Error("Invalid password");
                    }

                    // Return user data without password
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        subscription: user.subscription,
                        badges: user.badge || [],
                    };

                } catch (error) {
                    throw new Error(error.message || "Login failed");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.subscription = user.subscription;
                token.badge = user.badge || [];
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.image;
                session.user.subscription = token.subscription;
                session.user.badge = token.badge || [];
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
