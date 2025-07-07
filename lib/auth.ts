import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text"},
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password',type: 'password'}
            },

            async authorize(credentials){
                if(!credentials || !credentials.email || !credentials.password){
                    throw new Error('Invalid credentials');
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({email: credentials.email});

                    if(!user){
                        throw new Error('User not found');
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if(!isValid){
                        throw new Error('Invalid password');
                    }


                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email
                    }


                } catch (error) {
                    console.error("Console Auth Error!",error);
                    throw error
                }
            }
        })
    ],

    callbacks: {
        async jwt ({token,user}) {
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session,token}) {
            if(session.user){
                session.user.id = token.id as string;   
            }
            return session;
        }
    },
    pages:{
        signIn: "/login",
        error: "/login"
    },
    session:{
        strategy: "jwt",
        maxAge: 30* 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
}