// For connection to MongoDB using Mongoose
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        
        // opts is used to configure the connection options for mongoose.
        const opts = {
            bufferCommands: false, // Disable mongoose's buffering of commands
            maxPoolSize: 10, // Set the maximum pool size to 10 used for multiple connnections of db.
        }
        
        mongoose
        .connect(MONGODB_URI,opts)
        .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error;
    }

    return cached.conn
}