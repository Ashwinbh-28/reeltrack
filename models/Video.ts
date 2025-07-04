import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export const video_dimensions = {
    width: 1080,
    height: 1920,
} as const; //this is bz TS sometimes override the video dimensions.

export interface IVideo {
    _id?: mongoose.Types.ObjectId; 
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls: boolean,
    transformation?: {
        width?: number;
        height?: number;
        quality?: number; // e.g., 80 for 80% quality
    }
}

const videoSchema = new Schema<IVideo>(
    {
        title: {type: String,required: true},
        description: {type: String, required: true},
        thumbnailUrl: {type: String, required: true},
        videoUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformation: {
            height: { type: Number, default: video_dimensions.height },
            width: { type: Number, default: video_dimensions.width },
            quality: { type: Number,min:1,max:100}, // Default quality set to 80%   
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;