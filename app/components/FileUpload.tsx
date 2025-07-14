"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";


interface ImageKitUploadResponse {
    fileId: string;
    url: string;
    name: string;
    thumbnailUrl?: string;
    height?: number;
    width?: number;
    size?: number;
    fileType?: string;
}

// ✅ Use the type here
interface FileUploadProps {
    onSuccess: (res: ImageKitUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
const [uploading, setUploading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [progress, setProgress] = useState<number | null>(null);

const validateFile = (file: File): boolean => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
    }
    if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100 MB");
        return false;
    }
    return true;
};

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);
    setProgress(null);

    try {
    const authRes = await fetch("/api/auth/imagekit-auth");
    const auth = await authRes.json();

    const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
            if (onProgress) onProgress(percent);
        }
        },
    });

    onSuccess({
        fileId: res.fileId ?? "",
        url: res.url ?? "",
        name: res.name ?? "",
        thumbnailUrl: res.thumbnailUrl,
        height: res.height,
        width: res.width,
        size: res.size,
        fileType: res.fileType,
    });
    } catch (error) {
    console.error("Upload failed", error);
    setError("Upload failed. Try again.");
    } finally {
    setUploading(false);
    }
};

return (
    <>
    <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
    />
    {error && <p style={{ color: "red" }}>{error}</p>}
    {uploading && <p>Uploading: {progress ?? 0}%</p>}
    </>
);
};

export default FileUpload;
